import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import HabitCard from '../components/HabitCard';
import HabitTemplatePicker from '../components/HabitTemplatePicker';
import { Plus, TrendingUp, Target as TargetIcon, Award, ArrowUpRight, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ 
    title: '', 
    description: '', 
    frequency: 'daily',
    icon: '✓',
    color: '#10B981',
    category: 'general'
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(!user) {
        navigate('/login');
        return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [habitsRes, goalsRes, statsRes, achievementsRes] = await Promise.all([
        api.get('/habits'),
        api.get('/goals'),
        api.get('/stats'),
        api.get('/achievements')
      ]);
      setHabits(habitsRes.data);
      setGoals(goalsRes.data.filter(g => g.status !== 'completed').slice(0, 3));
      setStats(statsRes.data);
      setAchievements(achievementsRes.data.slice(0, 3));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/habits', newHabit);
      setNewHabit({ title: '', description: '', frequency: 'daily', icon: '✓', color: '#10B981', category: 'general' });
      setShowHabitForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTemplateSelect = async (templateId) => {
    if (!templateId) {
      setShowTemplatePicker(false);
      setShowHabitForm(true);
      return;
    }

    try {
      await api.post(`/habits/from-template/${templateId}`);
      setShowTemplatePicker(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckHabit = async (id) => {
    try {
      await api.put(`/habits/${id}/check`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-action rounded-full animate-spin"></div>
      <div className="text-secondary dark:text-dark-secondary font-medium animate-pulse">Syncing your progress...</div>
    </div>
  );

  const quotes = [
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Progress, not perfection.", author: "Unknown" },
    { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" }
  ];
  
  const todayQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-heading font-bold text-primary dark:text-dark-primary">Welcome back, {user?.username}</h2>
           <p className="text-secondary dark:text-dark-secondary mt-1">Consistency is the key to your growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowTemplatePicker(true)}
            className="px-5 py-2.5 bg-surface dark:bg-gray-800 text-primary dark:text-dark-primary rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-700"
          >
            <Sparkles size={16} className="text-accent" /> Explore Templates
          </button>
          <button 
            onClick={() => setShowHabitForm(true)}
            className="px-5 py-2.5 bg-primary dark:bg-dark-primary text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-md"
          >
            <Plus size={16} /> New Habit
          </button>
        </div>
      </div>

       {showHabitForm && (
          <div className="p-8 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft dark:shadow-soft-dark animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-heading font-bold mb-6 text-primary dark:text-dark-primary">Create a new habit</h3>
            <form onSubmit={handleCreateHabit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary dark:text-dark-primary">Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-4 py-3 text-sm focus:ring-2 focus:ring-action transition-all outline-none text-primary dark:text-dark-primary"
                    placeholder="e.g. Read 10 pages"
                    value={newHabit.title}
                    onChange={e => setNewHabit({...newHabit, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary dark:text-dark-primary">Category</label>
                  <select 
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-4 py-3 text-sm focus:ring-2 focus:ring-action transition-all outline-none text-primary dark:text-dark-primary"
                    value={newHabit.category}
                    onChange={e => setNewHabit({...newHabit, category: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="health">Health</option>
                    <option value="productivity">Productivity</option>
                    <option value="learning">Learning</option>
                    <option value="wellness">Wellness</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary dark:text-dark-primary">Description (Optional)</label>
                <input 
                  type="text" 
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-4 py-3 text-sm focus:ring-2 focus:ring-action transition-all outline-none text-primary dark:text-dark-primary"
                  placeholder="Why is this important?"
                  value={newHabit.description}
                  onChange={e => setNewHabit({...newHabit, description: e.target.value})}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <button type="submit" className="px-8 py-3 bg-action text-white rounded-xl font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all">Save Habit</button>
                <button type="button" onClick={() => setShowHabitForm(false)} className="px-8 py-3 bg-surface dark:bg-gray-800 text-primary dark:text-dark-primary rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Completion', value: `${stats.habits.completionRate}%`, icon: TrendingUp, color: 'text-accent', bg: 'bg-green-50 dark:bg-green-900/10' },
            { label: 'Active Streaks', value: stats.habits.activeStreaks, icon: ArrowUpRight, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10' },
            { label: 'Longest Streak', value: stats.habits.longestStreak, icon: Award, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' },
            { label: 'Goals Active', value: stats.goals.inProgress, icon: TargetIcon, color: 'text-action', bg: 'bg-blue-50 dark:bg-blue-900/10' }
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft dark:shadow-soft-dark">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-wider">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon size={16} />
                </div>
              </div>
              <p className="text-2xl font-bold text-primary dark:text-dark-primary">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Habits Stream */}
          <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                  <h3 className="text-xl font-heading font-bold text-primary dark:text-dark-primary">Today's Habits</h3>
                  <Link to="/habits" className="text-xs font-bold text-action hover:underline uppercase tracking-widest flex items-center gap-1">
                    Manage All <ArrowUpRight size={14} />
                  </Link>
              </div>
              
              {habits.length === 0 ? (
                <div className="text-center py-20 bg-surface/30 dark:bg-gray-900/30 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                    <div className="w-16 h-16 bg-white dark:bg-dark-surface rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                      <Sparkles className="text-action" size={32} />
                    </div>
                    <p className="text-secondary dark:text-dark-secondary mb-6 max-w-xs mx-auto text-sm">You haven't added any habits yet. Take the first step to a better you.</p>
                    <button 
                      onClick={() => setShowTemplatePicker(true)} 
                      className="px-6 py-2.5 bg-primary dark:bg-action text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                    >
                      Start Your Journey
                    </button>
                </div>
              ) : (
                <div className="grid gap-4">
                    {habits.slice(0, 6).map(habit => (
                      <HabitCard key={habit._id} habit={habit} onCheck={handleCheckHabit} />
                    ))}
                    {habits.length > 6 && (
                      <button onClick={() => navigate('/habits')} className="w-full py-4 text-sm font-bold text-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-dark-primary transition-all bg-surface/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                        + {habits.length - 6} more habits
                      </button>
                    )}
                </div>
              )}
          </div>

          {/* Activity & Goals Sidebar */}
          <div className="space-y-8">
              {/* Daily Quote / Inspiration */}
              <div className="relative p-8 bg-primary dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden text-white group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 transition-transform group-hover:rotate-45 group-hover:scale-150 duration-700">
                    <Sparkles size={120} />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Daily Insight</h4>
                    <p className="text-lg font-medium leading-relaxed italic mb-6">"{todayQuote.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-px bg-slate-600"></div>
                      <span className="text-xs text-slate-400 font-medium">{todayQuote.author}</span>
                    </div>
                  </div>
              </div>

              {/* Achievements Mini-Feed */}
              {achievements.length > 0 && (
                <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-soft dark:shadow-soft-dark">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-heading font-bold text-primary dark:text-dark-primary">Recent Wins</h4>
                    <Award size={18} className="text-accent" />
                  </div>
                  <div className="space-y-4">
                    {achievements.map(ach => (
                      <div key={ach._id} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface dark:bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                          {ach.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary dark:text-dark-primary">{ach.title}</p>
                          <p className="text-[10px] text-secondary dark:text-dark-secondary">{new Date(ach.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    <button className="w-full mt-2 text-xs font-bold text-action hover:underline">View All achievements</button>
                  </div>
                </div>
              )}

              {/* Goal Progress Preview */}
              <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-soft dark:shadow-soft-dark">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-heading font-bold text-primary dark:text-dark-primary">Long-term Focus</h4>
                    <TargetIcon size={18} className="text-action" />
                  </div>
                  {goals.length === 0 ? (
                    <p className="text-sm text-secondary px-2">No active goals. Focusing on the daily grind.</p>
                  ) : (
                    <div className="space-y-5">
                      {goals.map(goal => (
                        <div key={goal._id} className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                             <span className="font-bold text-primary dark:text-dark-primary truncate pr-4">{goal.title}</span>
                             <span className="text-secondary font-medium">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-action h-full rounded-full transition-all duration-1000" 
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      <Link to="/goals" className="block text-center mt-4 text-xs font-bold text-action hover:underline">Manage All Goals</Link>
                    </div>
                  )}
              </div>
          </div>
      </div>

      {showTemplatePicker && (
        <HabitTemplatePicker 
          onSelect={handleTemplateSelect} 
          onClose={() => setShowTemplatePicker(false)} 
        />
      )}
    </div>
  );
}
