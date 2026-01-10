import express from 'express';
import Journal from '../models/Journal.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/journal
// @desc    Get all journal entries
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/journal
// @desc    Create an entry
// @access  Private
router.post('/', auth, async (req, res) => {
  const { content, mood, tags } = req.body;
  try {
    const newEntry = new Journal({
      userId: req.user.id,
      content,
      mood,
      tags
    });
    const entry = await newEntry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
