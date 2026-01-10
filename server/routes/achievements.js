import express from 'express';
import Achievement from '../models/Achievement.js';
import User from '../models/User.js';
import Habit from '../models/Habit.js';
import Goal from '../models/Goal.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/achievements
// @desc    Get user achievements
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(achievements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/achievements/:id/share
// @desc    Share an achievement
// @access  Private
router.post('/:id/share', auth, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({ msg: 'Achievement not found' });
    }

    if (achievement.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    achievement.isShared = true;
    await achievement.save();

    res.json(achievement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/achievements/feed
// @desc    Get shared achievements from followed users
// @access  Private
router.get('/feed', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    const achievements = await Achievement.find({
      userId: { $in: currentUser.following },
      isShared: true
    })
    .populate('userId', 'username profile.avatar')
    .sort({ createdAt: -1 })
    .limit(50);

    res.json(achievements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/achievements/leaderboard
// @desc    Get leaderboard
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('username profile.avatar')
      .limit(100);

    const leaderboard = await Promise.all(users.map(async (user) => {
      const habits = await Habit.find({ userId: user._id });
      const goals = await Goal.find({ userId: user._id, status: 'completed' });
      const achievements = await Achievement.find({ userId: user._id });
      
      const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
      const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
      
      // Calculate score
      const score = (totalStreak * 10) + (goals.length * 50) + (achievements.length * 25);

      return {
        userId: user._id,
        username: user.username,
        avatar: user.profile.avatar,
        stats: {
          totalStreak,
          longestStreak,
          completedGoals: goals.length,
          achievements: achievements.length,
          score
        }
      };
    }));

    // Sort by score
    leaderboard.sort((a, b) => b.stats.score - a.stats.score);

    res.json(leaderboard.slice(0, 50));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
