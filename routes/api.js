const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const UserStats = require('../models/UserStats');

// Get all data for dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        let stats = await UserStats.findOne();
        
        if (!stats) {
            stats = await UserStats.create({});
        }

        res.json({ tasks, stats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a task
router.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.json(newTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Toggle task and update XP
router.patch('/tasks/:id/toggle', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.completed = !task.completed;
        await task.save();

        // Update stats if completed
        if (task.completed) {
            const stats = await UserStats.findOne();
            stats.xp += 10;
            // Simple level up logic
            if (stats.xp >= stats.level * 100) {
                stats.level += 1;
                stats.xp = 0; // Reset for next level or keep accumulating? Let's reset for now
            }
            await stats.save();
            res.json({ task, stats, leveledUp: stats.level > (stats.level - (stats.xp === 0 ? 1 : 0)) }); 
        } else {
             res.json({ task });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete task
router.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
