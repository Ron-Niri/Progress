import express from 'express';
import Habit from '../models/Habit.js';
import Goal from '../models/Goal.js';
import Journal from '../models/Journal.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/stats
// @desc    Get user statistics
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Habit stats
    const totalHabits = await Habit.countDocuments({ userId });
    const habits = await Habit.find({ userId });
    const activeStreaks = habits.filter(h => h.streak > 0).length;
    const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
    
    // Calculate completion rate (last 7 days)
    const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
    const completionRate = totalHabits > 0 ? Math.round((totalCompletions / (totalHabits * 7)) * 100) : 0;

    // Goal stats
    const totalGoals = await Goal.countDocuments({ userId });
    const completedGoals = await Goal.countDocuments({ userId, status: 'completed' });
    const inProgressGoals = await Goal.countDocuments({ userId, status: 'in-progress' });

    // Journal stats
    const totalJournalEntries = await Journal.countDocuments({ userId });
    
    // Weekly habit completion data
    const weeklyData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      let dayCompletions = 0;
      habits.forEach(habit => {
        const completed = habit.completedDates.some(d => {
          const completedDate = new Date(d);
          return completedDate >= date && completedDate < nextDate;
        });
        if (completed) dayCompletions++;
      });
      
      const percentage = totalHabits > 0 ? Math.round((dayCompletions / totalHabits) * 100) : 0;
      
      weeklyData.push({
        name: days[date.getDay()],
        completion: percentage
      });
    }

    res.json({
      habits: {
        total: totalHabits,
        activeStreaks,
        longestStreak,
        completionRate
      },
      goals: {
        total: totalGoals,
        completed: completedGoals,
        inProgress: inProgressGoals
      },
      journal: {
        totalEntries: totalJournalEntries
      },
      weeklyData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
