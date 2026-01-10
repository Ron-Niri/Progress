const mongoose = require('mongoose');

const UserStatsSchema = new mongoose.Schema({
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserStats', UserStatsSchema);
