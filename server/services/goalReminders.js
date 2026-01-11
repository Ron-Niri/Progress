import cron from 'node-cron';
import Goal from '../models/Goal.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailService.js';

// Run every day at 9:00 AM
const scheduleGoalReminders = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('🔔 Running goal deadline reminder check...');
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find all users with goal reminders enabled
      const users = await User.find({ 
        'preferences.goalReminders': true,
        'preferences.emailNotifications': true 
      });

      for (const user of users) {
        const reminderDays = user.preferences.reminderDaysBefore || 3;
        const reminderDate = new Date(today);
        reminderDate.setDate(reminderDate.getDate() + reminderDays);

        // Find goals that:
        // 1. Belong to this user
        // 2. Have a target date
        // 3. Are not completed
        // 4. Target date is within reminder window
        // 5. Haven't been reminded yet (or last reminder was more than 24 hours ago)
        const goals = await Goal.find({
          userId: user._id,
          status: { $ne: 'completed' },
          targetDate: {
            $gte: today,
            $lte: reminderDate
          },
          $or: [
            { reminderSent: false },
            { lastReminderDate: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
          ]
        });

        if (goals.length > 0) {
          // Send reminder email
          await sendGoalReminderEmail(user, goals, reminderDays);

          // Update reminder status for all goals
          const goalIds = goals.map(g => g._id);
          await Goal.updateMany(
            { _id: { $in: goalIds } },
            { 
              $set: { 
                reminderSent: true, 
                lastReminderDate: new Date() 
              } 
            }
          );

          console.log(`✅ Sent reminder to ${user.email} for ${goals.length} goal(s)`);
        }
      }

      console.log('✅ Goal reminder check completed');
    } catch (error) {
      console.error('❌ Error in goal reminder cron job:', error);
    }
  });

  console.log('✅ Goal reminder cron job scheduled (runs daily at 9:00 AM)');
};

const sendGoalReminderEmail = async (user, goals, reminderDays) => {
  const goalsList = goals.map(goal => {
    const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
    const urgencyColor = daysLeft <= 1 ? '#ef4444' : daysLeft <= 3 ? '#f59e0b' : '#3b82f6';
    
    return `
      <div style="background: #f9fafb; border-left: 4px solid ${urgencyColor}; padding: 16px; margin-bottom: 12px; border-radius: 8px;">
        <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 18px; font-weight: 600;">
          🎯 ${goal.title}
        </h3>
        <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
          <strong>Deadline:</strong> ${new Date(goal.targetDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
          <strong>Days Left:</strong> <span style="color: ${urgencyColor}; font-weight: 600;">${daysLeft} day${daysLeft !== 1 ? 's' : ''}</span>
        </p>
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
          <strong>Progress:</strong> ${goal.progress}%
        </p>
        ${goal.description ? `<p style="margin: 0; color: #4b5563; font-size: 13px; font-style: italic;">${goal.description}</p>` : ''}
      </div>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">
              ⏰ Goal Deadline Reminder
            </h1>
            <p style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
              You have ${goals.length} goal${goals.length !== 1 ? 's' : ''} approaching ${goals.length !== 1 ? 'their' : 'its'} deadline
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.6;">
              Hi <strong>${user.username}</strong>,
            </p>
            <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.6;">
              This is a friendly reminder that the following goal${goals.length !== 1 ? 's are' : ' is'} due within the next <strong>${reminderDays} day${reminderDays !== 1 ? 's' : ''}</strong>:
            </p>

            ${goalsList}

            <div style="margin-top: 32px; padding: 20px; background: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                💡 <strong>Pro Tip:</strong> Break down your goals into smaller sub-goals to make them more achievable. You've got this!
              </p>
            </div>

            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.CLIENT_URL}/goals" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View Your Goals
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; text-align: center;">
              You're receiving this because you have goal reminders enabled.
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
              <a href="${process.env.CLIENT_URL}/settings" style="color: #667eea; text-decoration: none;">Manage notification preferences</a>
            </p>
          </div>

        </div>

        <!-- Footer Text -->
        <p style="margin: 24px 0 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Progress. Keep pushing forward! 💪
        </p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: `⏰ Reminder: ${goals.length} Goal${goals.length !== 1 ? 's' : ''} Due Soon`,
    html: htmlContent
  });
};

export default scheduleGoalReminders;
