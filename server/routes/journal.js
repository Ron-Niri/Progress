import express from 'express';
import Journal from '../models/Journal.js';
import Achievement from '../models/Achievement.js';
import Activity from '../models/Activity.js';
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

    // Log Activity
    await new Activity({
      userId: req.user.id,
      type: 'habit_completed', // Using generic type or we could add 'journal_entry'
      title: 'Mindful Reflection',
      description: 'Documented thoughts and feelings in the journal.',
      metadata: { referenceId: entry._id, icon: '📝' }
    }).save();

    // Check for Achievements
    const entryCount = await Journal.countDocuments({ userId: req.user.id });
    let achievementData = null;
    if (entryCount === 1) {
      achievementData = { type: 'first_journal', title: 'First Reflection', icon: '📝', description: 'Started your journaling journey!' };
    } else if (entryCount === 5) {
      achievementData = { type: 'five_journals', title: 'Introspective Mind', icon: '🧠', description: 'Deepened self-awareness with 5 entries!' };
    } else if (entryCount === 10) {
      achievementData = { type: 'ten_journals', title: 'Journaling Sensei', icon: '📜', description: 'Mastered the art of reflection with 10 entries!' };
    }

    if (achievementData) {
      const achievement = new Achievement({
        userId: req.user.id,
        ...achievementData
      });
      await achievement.save();

      await new Activity({
        userId: req.user.id,
        type: 'achievement_unlocked',
        title: achievement.title,
        description: `Unlocked: ${achievement.title} - ${achievement.description}`,
        metadata: { referenceId: achievement._id, icon: achievement.icon }
      }).save();
    }

    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/journal/:id
// @desc    Update an entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { content, mood, tags } = req.body;
  try {
    let entry = await Journal.findById(req.params.id);
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    if (entry.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    if (content) entry.content = content;
    if (mood) entry.mood = mood;
    if (tags) entry.tags = tags;

    await entry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/journal/:id
// @desc    Delete an entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let entry = await Journal.findById(req.params.id);
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    if (entry.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Journal.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
