import express from 'express';
import User from '../models/User.js';
import Habit from '../models/Habit.js';
import Goal from '../models/Goal.js';
import Achievement from '../models/Achievement.js';
import Activity from '../models/Activity.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -verificationCode -resetPasswordCode')
      .populate('followers', 'username profile.avatar')
      .populate('following', 'username profile.avatar');
    
    const habitCount = await Habit.countDocuments({ userId: req.user.id });
    const goalCount = await Goal.countDocuments({ userId: req.user.id });
    const achievements = await Achievement.find({ userId: req.user.id });

    res.json({
      ...user.toObject(),
      stats: {
        habits: habitCount,
        goals: goalCount,
        achievements: achievements.length,
        followers: user.followers.length,
        following: user.following.length
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/me
// @desc    Update user profile
// @access  Private
router.put('/me', auth, async (req, res) => {
  const { bio, avatar, location, website } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    
    if (bio !== undefined) user.profile.bio = bio;
    if (avatar !== undefined) user.profile.avatar = avatar;
    if (location !== undefined) user.profile.location = location;
    if (website !== undefined) user.profile.website = website;

    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, async (req, res) => {
  const { darkMode, emailNotifications, habitReminders } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    
    if (darkMode !== undefined) user.preferences.darkMode = darkMode;
    if (emailNotifications !== undefined) user.preferences.emailNotifications = emailNotifications;
    if (habitReminders !== undefined) user.preferences.habitReminders = habitReminders;

    await user.save();
    
    res.json(user.preferences);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/:userId
// @desc    Get user profile by ID
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -email -verificationCode -resetPasswordCode -preferences')
      .populate('followers', 'username profile.avatar')
      .populate('following', 'username profile.avatar');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const habitCount = await Habit.countDocuments({ userId: req.params.userId, isPublic: true });
    const goalCount = await Goal.countDocuments({ userId: req.params.userId });
    const achievements = await Achievement.find({ userId: req.params.userId, isShared: true });

    res.json({
      ...user.toObject(),
      stats: {
        habits: habitCount,
        goals: goalCount,
        achievements: achievements.length,
        followers: user.followers.length,
        following: user.following.length
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile/follow/:userId
// @desc    Follow a user
// @access  Private
router.post('/follow/:userId', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (req.params.userId === req.user.id) {
      return res.status(400).json({ msg: 'Cannot follow yourself' });
    }

    if (currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ msg: 'Already following this user' });
    }

    currentUser.following.push(req.params.userId);
    userToFollow.followers.push(req.user.id);

    await currentUser.save();
    await userToFollow.save();

    res.json({ msg: 'User followed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile/unfollow/:userId
// @desc    Unfollow a user
// @access  Private
router.post('/unfollow/:userId', auth, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.userId);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user.id);

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ msg: 'User unfollowed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/search
// @desc    Search users
// @access  Private
router.get('/search/users', auth, async (req, res) => {
  try {
    const { q } = req.query;
    
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { 'profile.bio': { $regex: q, $options: 'i' } }
      ]
    })
    .select('username profile.avatar profile.bio')
    .limit(20);

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/:userId/activity
// @desc    Get user activity feed
// @access  Private
router.get('/:userId/activity', auth, async (req, res) => {
  try {
    const id = req.params.userId === 'me' ? req.user.id : req.params.userId;
    const activities = await Activity.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
