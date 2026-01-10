import express from 'express';
import Habit from '../models/Habit.js';
import auth from '../middleware/auth.js';

const router = express.Router();

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

// @route   POST api/habits
// @desc    Create a habit
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, frequency } = req.body;
  try {
    const newHabit = new Habit({
      userId: req.user.id,
      title,
      description,
      frequency
    });
    const habit = await newHabit.save();
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

        // Check if already completed today
        const completedToday = habit.completedDates.some(date => {
            const d = new Date(date);
            return d >= today && d < tomorrow;
        });

        if (completedToday) {
            // Uncheck - remove today's date
            habit.completedDates = habit.completedDates.filter(date => {
                const d = new Date(date);
                return !(d >= today && d < tomorrow);
            });
            if (habit.streak > 0) habit.streak -= 1;
        } else {
            // Check - add today's date
            habit.completedDates.push(new Date());
            habit.streak += 1;
        }

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
