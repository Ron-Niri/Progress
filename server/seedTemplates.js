import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HabitTemplate from './models/HabitTemplate.js';
import GoalTemplate from './models/GoalTemplate.js';

dotenv.config();

const templates = [
  // Health & Fitness
  { title: 'Morning Exercise', description: '30 minutes of physical activity', category: 'health', icon: '💪', color: '#EF4444', frequency: 'daily', tags: ['fitness', 'health'] },
  { title: 'Drink 8 Glasses of Water', description: 'Stay hydrated throughout the day', category: 'health', icon: '💧', color: '#3B82F6', frequency: 'daily', tags: ['health', 'wellness'] },
  { title: 'Meditation', description: '10 minutes of mindfulness', category: 'wellness', icon: '🧘', color: '#8B5CF6', frequency: 'daily', tags: ['mindfulness', 'mental-health'] },
  { title: 'Healthy Breakfast', description: 'Start the day with nutritious food', category: 'health', icon: '🥗', color: '#10B981', frequency: 'daily', tags: ['nutrition', 'health'] },
  { title: 'Evening Walk', description: '20-minute walk before bed', category: 'health', icon: '🚶', color: '#F59E0B', frequency: 'daily', tags: ['fitness', 'wellness'] },
  
  // Productivity
  { title: 'Read for 30 Minutes', description: 'Daily reading habit', category: 'learning', icon: '📚', color: '#6366F1', frequency: 'daily', tags: ['learning', 'growth'] },
  { title: 'Learn Something New', description: 'Dedicate time to learning', category: 'learning', icon: '🎓', color: '#8B5CF6', frequency: 'daily', tags: ['education', 'growth'] },
  { title: 'Practice Coding', description: '1 hour of programming practice', category: 'skill', icon: '💻', color: '#06B6D4', frequency: 'daily', tags: ['coding', 'skill-building'] },
  { title: 'Write in Journal', description: 'Reflect on your day', category: 'reflection', icon: '📝', color: '#F59E0B', frequency: 'daily', tags: ['journaling', 'reflection'] },
  { title: 'Plan Tomorrow', description: 'Set goals for the next day', category: 'productivity', icon: '📋', color: '#10B981', frequency: 'daily', tags: ['planning', 'organization'] },
  
  // Personal Development
  { title: 'Practice Gratitude', description: 'Write 3 things you\'re grateful for', category: 'mindfulness', icon: '🙏', color: '#EC4899', frequency: 'daily', tags: ['gratitude', 'mindfulness'] },
  { title: 'No Social Media', description: 'Avoid social media for the day', category: 'digital-detox', icon: '📵', color: '#EF4444', frequency: 'daily', tags: ['focus', 'wellness'] },
  { title: 'Call a Friend/Family', description: 'Stay connected with loved ones', category: 'social', icon: '📞', color: '#3B82F6', frequency: 'weekly', tags: ['relationships', 'social'] },
  { title: 'Practice a Language', description: '20 minutes of language learning', category: 'learning', icon: '🗣️', color: '#8B5CF6', frequency: 'daily', tags: ['language', 'learning'] },
  { title: 'Creative Work', description: 'Spend time on creative projects', category: 'creativity', icon: '🎨', color: '#EC4899', frequency: 'daily', tags: ['creativity', 'hobbies'] },
  
  // Lifestyle
  { title: 'Make Your Bed', description: 'Start the day with a small win', category: 'routine', icon: '🛏️', color: '#6366F1', frequency: 'daily', tags: ['routine', 'discipline'] },
  { title: 'Clean for 15 Minutes', description: 'Maintain a tidy space', category: 'routine', icon: '🧹', color: '#10B981', frequency: 'daily', tags: ['organization', 'routine'] },
  { title: 'No Caffeine After 2 PM', description: 'Better sleep hygiene', category: 'health', icon: '☕', color: '#F59E0B', frequency: 'daily', tags: ['sleep', 'health'] },
  { title: 'Stretch', description: '10 minutes of stretching', category: 'health', icon: '🤸', color: '#EF4444', frequency: 'daily', tags: ['flexibility', 'health'] },
  { title: 'Track Expenses', description: 'Log daily spending', category: 'finance', icon: '💰', color: '#10B981', frequency: 'daily', tags: ['finance', 'budgeting'] },
  
  // New Templates
  { title: 'Deep Work Session', description: '90 minutes of focused, uninterrupted work', category: 'productivity', icon: '🧠', color: '#EF4444', frequency: 'daily', tags: ['focus', 'productivity'] },
  { title: 'Intermittent Fasting', description: 'Maintain your fasting window', category: 'health', icon: '⏱️', color: '#F59E0B', frequency: 'daily', tags: ['health', 'diet'] },
  { title: 'Save $10 Today', description: 'Put aside money for your future', category: 'finance', icon: '🐖', color: '#10B981', frequency: 'daily', tags: ['finance', 'savings'] },
  { title: 'Spanish Vocab', description: 'Learn 10 new Spanish words', category: 'learning', icon: '🇪🇸', color: '#EF4444', frequency: 'daily', tags: ['language', 'learning'] },
  { title: 'Digital Detox 1h', description: 'Disconnect from all screens for 1 hour', category: 'wellness', icon: '🔌', color: '#3B82F6', frequency: 'daily', tags: ['wellness', 'focus'] },
  { title: 'Network on LinkedIn', description: 'Make 3 professional connections', category: 'social', icon: '🤝', color: '#06B6D4', frequency: 'daily', tags: ['career', 'social'] },
  { title: 'Skincare Protocol', description: 'Morning/Evening routine', category: 'routine', icon: '🧴', color: '#EC4899', frequency: 'daily', tags: ['self-care', 'routine'] },
  { title: 'Push-up Set', description: '3 sets of maximum push-ups', category: 'health', icon: '🏋️', color: '#EF4444', frequency: 'daily', tags: ['fitness', 'strength'] },
  { title: 'Night Reflection', description: 'Write down 3 wins and 3 goals', category: 'reflection', icon: '🌙', color: '#8B5CF6', frequency: 'daily', tags: ['reflection', 'growth'] },
];

const goalTemplates = [
  { 
    title: '90-Day Body Transformation', 
    description: 'Complete overhaul of physical health', 
    category: 'Health', 
    icon: '🏋️',
    milestones: [
      { title: 'First 5kg lost / gained', relativeDays: 30 },
      { title: 'New personal best in main lift', relativeDays: 60 },
      { title: 'Final physique check', relativeDays: 90 }
    ]
  },
  { 
    title: 'Launch a Side Project', 
    description: 'Go from idea to first customer', 
    category: 'Productivity', 
    icon: '🚀',
    milestones: [
      { title: 'MVP Completed', relativeDays: 14 },
      { title: 'Beta Testing Started', relativeDays: 30 },
      { title: 'Public Launch', relativeDays: 45 }
    ]
  },
  { 
    title: 'Master a New Language (B1)', 
    description: 'Achieve intermediate conversational fluency', 
    category: 'Learning', 
    icon: '🗣️',
    milestones: [
      { title: 'First 500 words learned', relativeDays: 20 },
      { title: 'Can hold 5-min conversation', relativeDays: 50 },
      { title: 'Passed practice B1 exam', relativeDays: 80 }
    ]
  }
];

const seedTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing templates
    await HabitTemplate.deleteMany({});
    await GoalTemplate.deleteMany({});
    console.log('Cleared existing templates');

    // Insert new templates
    await HabitTemplate.insertMany(templates);
    await GoalTemplate.insertMany(goalTemplates);
    console.log(`Inserted ${templates.length} habit templates`);
    console.log(`Inserted ${goalTemplates.length} goal templates`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding templates:', err);
    process.exit(1);
  }
};

seedTemplates();
