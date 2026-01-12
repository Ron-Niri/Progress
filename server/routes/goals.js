import express from 'express';
import Goal from '../models/Goal.js';
import GoalTemplate from '../models/GoalTemplate.js';
import Achievement from '../models/Achievement.js';
import Activity from '../models/Activity.js';
import auth from '../middleware/auth.js';
import { awardXP, XP_VALUES } from '../utils/gamification.js';

const router = express.Router();

// @route   GET api/goals/templates
// @desc    Get all goal templates
// @access  Private
router.get('/templates', auth, async (req, res) => {
  try {
    const templates = await GoalTemplate.find();
    res.json(templates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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
  const { title, description, targetDate, category, subGoals, milestones, dependencies } = req.body;
  try {
    const newGoal = new Goal({
      userId: req.user.id,
      title,
      description,
      targetDate,
      category,
      subGoals,
      milestones,
      dependencies
    });
    const goal = await newGoal.save();
    
    await new Activity({
      userId: req.user.id,
      type: 'goal_created',
      title: goal.title,
      description: `Committed to a new mission: ${goal.title}`,
      metadata: { referenceId: goal._id, icon: '🎯' }
    }).save();
    
    const gamification = await awardXP(req.user.id, XP_VALUES.GOAL_CREATE);
    
    res.json({ ...goal.toObject(), gamification });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/goals/:id
// @desc    Update goal status/progress
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, description, targetDate, status, progress, category, subGoals, milestones, dependencies, collaborators, attachments } = req.body;
    try {
        let goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ msg: 'Goal not found' });
        if (goal.userId.toString() !== req.user.id && !goal.collaborators.includes(req.user.id)) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (title) goal.title = title;
        if (description !== undefined) goal.description = description;
        if (targetDate) goal.targetDate = targetDate;
        if (category) goal.category = category;
        if (subGoals) goal.subGoals = subGoals;
        if (milestones) goal.milestones = milestones;
        if (dependencies) goal.dependencies = dependencies;
        if (collaborators) goal.collaborators = collaborators;
        if (attachments) goal.attachments = attachments;
        if (status) {
            if (status === 'completed' && goal.status !== 'completed') {
                await new Activity({
                    userId: req.user.id,
                    type: 'goal_completed',
                    title: goal.title,
                    description: `Mission Accomplished: ${goal.title}!`,
                    metadata: { referenceId: goal._id, icon: '🏆' }
                }).save();

                // Check for goal completion achievements
                const completedCount = await Goal.countDocuments({ userId: req.user.id, status: 'completed' }) + 1; // +1 because we are about to save this one
                
                let achievementData = null;
                if (completedCount === 1) {
                    achievementData = { type: 'first_goal', title: 'First Victory', icon: '🎯', description: 'Completed your first big goal!' };
                } else if (completedCount === 3) {
                    achievementData = { type: 'three_goals', title: 'Steady Climber', icon: '🏔️', description: 'Successfully conquered 3 major goals!' };
                } else if (completedCount === 5) {
                    achievementData = { type: 'five_goals', title: 'Summit Seeker', icon: '🧗', description: 'Reached the peak with 5 goals completed!' };
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
            }
            goal.status = status;
        }
        if (progress !== undefined) goal.progress = progress;

        await goal.save();
        
        let gamification = null;
        if (status === 'completed') {
            gamification = await awardXP(req.user.id, XP_VALUES.GOAL_COMPLETE);
        }
        
        res.json({ ...goal.toObject(), gamification });
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
