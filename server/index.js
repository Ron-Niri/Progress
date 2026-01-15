import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habits.js';
import goalRoutes from './routes/goals.js';
import journalRoutes from './routes/journal.js';
import statsRoutes from './routes/stats.js';
import profileRoutes from './routes/profile.js';
import achievementsRoutes from './routes/achievements.js';
import adminRoutes from './routes/admin.js';
import scheduleGoalReminders from './services/goalReminders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.NODE_ENV === 'production' 
  ? (process.env.PORT || 5000) 
  : (process.env.SERVER_PORT || 5001);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'http://localhost:5001'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (process.env.NODE_ENV !== 'production') {
      // In development, allow any local network origin
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Progress API is running', status: 'OK' });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    // Only serve index.html if it's not an API route
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    }
  });
}

// Database Connection
const connectDB = async () => {
    console.log('🔌 Attempting to connect to MongoDB...');
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI is not defined in .env file');
        return;
    }
    console.log('📝 Using URI:', uri.split('@').pop()); // Log only the host part for security
    try {
        await mongoose.connect(uri);
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
    }
};

connectDB();

// Initialize cron jobs after DB connection
scheduleGoalReminders();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
