import express from 'express';
import HabitTemplate from '../models/HabitTemplate.js';
import Habit from '../models/Habit.js';
import Achievement from '../models/Achievement.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/habits/templates
// @desc    Get all habit templates
// @access  Private
router.get('/templates', auth, async (req, res) => {
  try {
    const templates = await HabitTemplate.find().sort({ popularity: -1 });
    res.json(templates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/habits/from-template/:templateId
// @desc    Create habit from template
// @access  Private
router.post('/from-template/:templateId', auth, async (req, res) => {
  try {
    const template = await HabitTemplate.findById(req.params.templateId);
    
    if (!template) {
      return res.status(404).json({ msg: 'Template not found' });
    }

    const newHabit = new Habit({
      userId: req.user.id,
      title: template.title,
      description: template.description,
      frequency: template.frequency,
      icon: template.icon,
      color: template.color,
      category: template.category,
      tags: template.tags
    });

    const habit = await newHabit.save();
    
    // Increment template popularity
    template.popularity += 1;
    await template.save();

    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/habits
// @desc    Get all habits for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/habits/public
// @desc    Get public habits from followed users
// @access  Private
router.get('/public', auth, async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const currentUser = await User.findById(req.user.id);
    
    const habits = await Habit.find({
      userId: { $in: currentUser.following },
      isPublic: true
    })
    .populate('userId', 'username profile.avatar')
    .sort({ createdAt: -1 })
    .limit(50);

    res.json(habits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/habits
// @desc    Create a habit
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, frequency, icon, color, category, tags, reminder, isPublic } = req.body;
  try {
    const newHabit = new Habit({
      userId: req.user.id,
      title,
      description,
      frequency,
      icon: icon || '✓',
      color: color || '#10B981',
      category: category || 'general',
      tags: tags || [],
      reminder: reminder || { enabled: false },
      isPublic: isPublic || false
    });
    const habit = await newHabit.save();
    
    // Check for first habit achievement
    const habitCount = await Habit.countDocuments({ userId: req.user.id });
    if (habitCount === 1) {
      const achievement = new Achievement({
        userId: req.user.id,
        type: 'first_habit',
        title: 'First Step',
        description: 'Created your first habit!',
        icon: '🎯'
      });
      await achievement.save();
    }
    
    res.json(habit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });
        if (habit.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const { title, description, icon, color, category, tags, reminder, isPublic } = req.body;
        
        if (title) habit.title = title;
        if (description !== undefined) habit.description = description;
        if (icon) habit.icon = icon;
        if (color) habit.color = color;
        if (category) habit.category = category;
        if (tags) habit.tags = tags;
        if (reminder) habit.reminder = reminder;
        if (isPublic !== undefined) habit.isPublic = isPublic;

        await habit.save();
        res.json(habit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/habits/:id/check
// @desc    Check/Uncheck a habit for today
// @access  Private
router.put('/:id/check', auth, async (req, res) => {
    try {
        let habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });
        if (habit.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const completedToday = habit.completedDates.some(date => {
            const d = new Date(date);
            return d >= today && d < tomorrow;
        });

        if (completedToday) {
            habit.completedDates = habit.completedDates.filter(date => {
                const d = new Date(date);
                return !(d >= today && d < tomorrow);
            });
            if (habit.streak > 0) habit.streak -= 1;
        } else {
            habit.completedDates.push(new Date());
            habit.streak += 1;
            
            // Check for streak achievements
            if (habit.streak === 7) {
                const achievement = new Achievement({
                    userId: req.user.id,
                    type: 'week_streak',
                    title: 'Week Warrior',
                    description: 'Maintained a 7-day streak!',
                    icon: '🔥'
                });
                await achievement.save();
            } else if (habit.streak === 30) {
                const achievement = new Achievement({
                    userId: req.user.id,
                    type: 'month_streak',
                    title: 'Month Master',
                    description: 'Maintained a 30-day streak!',
                    icon: '⭐'
                });
                await achievement.save();
            }
        }

        await habit.save();
        res.json(habit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/habits/:id/notes
// @desc    Add a note to a habit
// @access  Private
router.post('/:id/notes', auth, async (req, res) => {
    try {
        let habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });
        if (habit.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const { content } = req.body;
        habit.notes.push({ content, date: new Date() });
        await habit.save();
        
        res.json(habit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/habits/:id
// @desc    Delete a habit
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });
        if (habit.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await Habit.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Habit removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
