import express from 'express';
import Goal from '../models/Goal.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/goals
// @desc    Get all goals for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ targetDate: 1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/goals
// @desc    Create a goal
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, targetDate } = req.body;
  try {
    const newGoal = new Goal({
      userId: req.user.id,
      title,
      description,
      targetDate
    });
    const goal = await newGoal.save();
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/goals/:id
// @desc    Update goal status/progress
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { status, progress } = req.body;
    try {
        let goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ msg: 'Goal not found' });
        if (goal.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        if (status) goal.status = status;
        if (progress !== undefined) goal.progress = progress;

        await goal.save();
        res.json(goal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ msg: 'Goal not found' });
        if (goal.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await Goal.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Goal removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
