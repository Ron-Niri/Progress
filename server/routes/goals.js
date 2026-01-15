import express from 'express';
import Goal from '../models/Goal.js';
import GoalTemplate from '../models/GoalTemplate.js';
import Achievement from '../models/Achievement.js';
import Activity from '../models/Activity.js';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/emailService.js';
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
    const goals = await Goal.find({ 
      $or: [
        { userId: req.user.id },
        { collaborators: req.user.id }
      ]
    })
    .sort({ targetDate: 1 })
    .populate('userId', 'username profile.avatar')
    .populate('collaborators', 'username profile.avatar');
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

// @route   GET api/goals/invitations
// @desc    Get pending goal invitations for user
// @access  Private
router.get('/invitations', auth, async (req, res) => {
  try {
    const invitations = await Goal.find({
      'invitations.user': req.user.id,
      'invitations.status': 'pending'
    })
    .populate('userId', 'username profile.avatar')
    .select('title description category targetDate userId invitations');
    
    // Filter out only relevant invitation for this user
    const formatted = invitations.map(goal => {
      const invite = goal.invitations.find(i => i.user.toString() === req.user.id);
      return {
        _id: goal._id,
        title: goal.title,
        description: goal.description,
        invitedBy: goal.userId,
        inviteId: invite._id,
        token: invite.token,
        status: invite.status
      };
    });
    
    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/goals/:id/invite
// @desc    Invite a collaborator by username
// @access  Private
router.post('/:id/invite', auth, async (req, res) => {
  const { username } = req.body;
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    if (goal.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    const invitee = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (!invitee) return res.status(404).json({ msg: 'User not found' });

    if (invitee._id.toString() === req.user.id) {
       return res.status(400).json({ msg: 'Cannot invite yourself' });
    }

    if (goal.collaborators.includes(invitee._id)) {
      return res.status(400).json({ msg: 'User is already a collaborator' });
    }

    // Check if pending invitation exists
    const existingInvite = goal.invitations.find(i => i.user.toString() === invitee._id.toString() && i.status === 'pending');
    if (existingInvite) return res.status(400).json({ msg: 'Invitation already pending' });

    const token = crypto.randomBytes(20).toString('hex');
    goal.invitations.push({
      user: invitee._id,
      token,
      invitedBy: req.user.id
    });

    await goal.save();

    // Send Email
    const inviter = await User.findById(req.user.id);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    await sendEmail(invitee.email, 'collaborationInvite', {
      recipientName: invitee.username,
      inviterName: inviter.username,
      goalTitle: goal.title,
      goalDescription: goal.description,
      acceptUrl: `${clientUrl}/goals/accept/${token}`
    });

    res.json({ msg: 'Invitation sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/goals/accept/:token
// @desc    Accept collaboration invitation
// @access  Private
router.post('/accept/:token', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ 'invitations.token': req.params.token });
    if (!goal) return res.status(404).json({ msg: 'Invitation not found or invalid' });

    const inviteIdx = goal.invitations.findIndex(i => i.token === req.params.token);
    const invite = goal.invitations[inviteIdx];

    if (invite.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'This invitation belongs to another user' });
    }

    if (invite.status !== 'pending') {
      return res.status(400).json({ msg: 'Invitation already processed' });
    }

    // Update invitation status
    invite.status = 'accepted';
    
    // Add to collaborators
    if (!goal.collaborators.includes(req.user.id)) {
      goal.collaborators.push(req.user.id);
    }

    await goal.save();

    // Log Activity
    await new Activity({
      userId: req.user.id,
      type: 'collaboration_joined',
      title: goal.title,
      description: `Joined forces on: ${goal.title}`,
      metadata: { referenceId: goal._id, icon: '🤝' }
    }).save();

    res.json({ msg: 'Collaboration accepted', goalId: goal._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
