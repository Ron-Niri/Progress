import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  streak: { type: Number, default: 0 },
  completedDates: [{ type: Date }],
  icon: { type: String, default: '✓' },
  color: { type: String, default: '#10B981' },
  category: { type: String, default: 'general' },
  tags: [{ type: String }],
  reminder: {
    enabled: { type: Boolean, default: false },
    time: { type: String }
  },
  notes: [{
    date: { type: Date, default: Date.now },
    content: { type: String }
  }],
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Habit', HabitSchema);
