import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import Habit from '../models/Habit.js';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.username.toLowerCase() === process.env.ADMIN_USERNAME?.toLowerCase()) {
      next();
    } else {
      res.status(403).json({ msg: 'Access denied. Admin only.' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// @route   GET api/admin/stats
// @desc    Get system-wide statistics
// @access  Admin only
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const [userCount, goalCount, habitCount, activeGoals, upcomingDeadlines] = await Promise.all([
      User.countDocuments(),
      Goal.countDocuments(),
      Habit.countDocuments(),
      Goal.countDocuments({ status: { $ne: 'completed' } }),
      Goal.find({ 
        status: { $ne: 'completed' },
        targetDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
      }).countDocuments()
    ]);

    res.json({
      users: userCount,
      goals: goalCount,
      habits: habitCount,
      activeGoals,
      upcomingDeadlines
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/test-email
// @desc    Send a test email
// @access  Admin only
router.post('/test-email', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    await sendEmail({
      to: user.email,
      subject: '🧪 Test Email from Progress Admin Panel',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: white; border-radius: 16px; padding: 40px; text-align: center;">
              <h1 style="color: #667eea; margin: 0 0 20px 0;">✅ Email System Working!</h1>
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                This is a test email sent from the Admin Panel at ${new Date().toLocaleString()}.
              </p>
              <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  <strong>User:</strong> ${user.username}<br>
                  <strong>Email:</strong> ${user.email}<br>
                  <strong>Server Time:</strong> ${new Date().toISOString()}
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });

    res.json({ msg: 'Test email sent successfully', sentTo: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to send test email', error: err.message });
  }
});

// @route   POST api/admin/trigger-goal-reminders
// @desc    Manually trigger goal reminder check (for testing)
// @access  Admin only
router.post('/trigger-goal-reminders', auth, isAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await User.find({ 
      'preferences.goalReminders': true,
      'preferences.emailNotifications': true 
    });

    let totalReminders = 0;
    const results = [];

    for (const user of users) {
      const reminderDays = user.preferences.reminderDaysBefore || 3;
      const reminderDate = new Date(today);
      reminderDate.setDate(reminderDate.getDate() + reminderDays);

      const goals = await Goal.find({
        userId: user._id,
        status: { $ne: 'completed' },
        targetDate: {
          $gte: today,
          $lte: reminderDate
        }
      });

      if (goals.length > 0) {
        results.push({
          user: user.username,
          email: user.email,
          goalsFound: goals.length,
          goals: goals.map(g => ({ title: g.title, deadline: g.targetDate }))
        });
        totalReminders += goals.length;
      }
    }

    res.json({ 
      msg: 'Goal reminder check completed',
      usersChecked: users.length,
      totalReminders,
      results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to trigger reminders', error: err.message });
  }
});

// @route   GET api/admin/recent-goals
// @desc    Get recent goals with deadlines
// @access  Admin only
router.get('/recent-goals', auth, isAdmin, async (req, res) => {
  try {
    const goals = await Goal.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/users
// @desc    Get all users with their preferences
// @access  Admin only
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('username email preferences createdAt')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/reset-reminder/:goalId
// @desc    Reset reminder status for a specific goal
// @access  Admin only
router.post('/reset-reminder/:goalId', auth, isAdmin, async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      req.params.goalId,
      { reminderSent: false, lastReminderDate: null },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }

    res.json({ msg: 'Reminder status reset', goal });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
