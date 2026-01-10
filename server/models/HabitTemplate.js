import mongoose from 'mongoose';

const HabitTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  icon: { type: String, default: '✓' },
  color: { type: String, default: '#10B981' },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  tags: [{ type: String }],
  popularity: { type: Number, default: 0 }
});

export default mongoose.model('HabitTemplate', HabitTemplateSchema);
