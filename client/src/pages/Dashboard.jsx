import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import HabitCard from '../components/HabitCard';
import { Plus, TrendingUp, Target as TargetIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: '', description: '', frequency: 'daily' });
  
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
      const [habitsRes, goalsRes, statsRes] = await Promise.all([
        api.get('/habits'),
        api.get('/goals'),
        api.get('/stats')
      ]);
      setHabits(habitsRes.data);
      setGoals(goalsRes.data.filter(g => g.status !== 'completed').slice(0, 3));
      setStats(statsRes.data);
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
      setNewHabit({ title: '', description: '', frequency: 'daily' });
      setShowForm(false);
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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-secondary">Loading your progress...</div></div>;

  const quotes = [
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "Progress, not perfection.", author: "Unknown" }
  ];
  
  const todayQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-heading font-semibold text-primary">Dashboard</h2>
           <p className="text-secondary">Welcome back! Here's your progress today.</p>
        </div>
        <button 
           onClick={() => setShowForm(!showForm)}
           className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <Plus size={16} /> New Habit
        </button>
      </div>

       {showForm && (
          <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-soft">
            <h3 className="text-lg font-medium mb-4">Create a new habit</h3>
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-action focus:ring-action sm:text-sm py-2 px-3 border"
                  placeholder="e.g. Read 10 pages"
                  value={newHabit.title}
                  onChange={e => setNewHabit({...newHabit, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Description (Optional)</label>
                <input 
                  type="text" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-action focus:ring-action sm:text-sm py-2 px-3 border"
                  placeholder="Why is this important?"
                  value={newHabit.description}
                  onChange={e => setNewHabit({...newHabit, description: e.target.value})}
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 bg-action text-white rounded-md text-sm font-medium hover:bg-blue-600">Save Habit</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-surface text-primary rounded-md text-sm font-medium hover:bg-gray-200">Cancel</button>
              </div>
            </form>
          </div>
        )}

      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider">Completion Rate</p>
                <p className="text-2xl font-bold text-primary mt-1">{stats.habits.completionRate}%</p>
              </div>
              <TrendingUp className="text-accent" size={24} />
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider">Active Streaks</p>
                <p className="text-2xl font-bold text-primary mt-1">{stats.habits.activeStreaks}</p>
              </div>
              <div className="text-action text-2xl">🔥</div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider">Longest Streak</p>
                <p className="text-2xl font-bold text-primary mt-1">{stats.habits.longestStreak}</p>
              </div>
              <div className="text-accent text-2xl">⭐</div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider">Goals Active</p>
                <p className="text-2xl font-bold text-primary mt-1">{stats.goals.inProgress}</p>
              </div>
              <TargetIcon className="text-action" size={24} />
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
          {/* Today's Habits Section */}
          <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-primary">Today's Habits</h3>
                  <span className="text-sm text-secondary">{habits.length} total</span>
              </div>
              {habits.length === 0 ? (
                <div className="text-center py-10 bg-surface/30 rounded-lg border border-dashed border-gray-200">
                    <p className="text-secondary mb-2">No habits yet.</p>
                    <button onClick={() => setShowForm(true)} className="text-action font-medium hover:underline">Create your first habit</button>
                </div>
              ) : (
                <div className="space-y-3">
                    {habits.slice(0, 5).map(habit => (
                      <HabitCard key={habit._id} habit={habit} onCheck={handleCheckHabit} />
                    ))}
                    {habits.length > 5 && (
                      <button 
                        onClick={() => navigate('/habits')}
                        className="w-full py-2 text-sm text-action hover:text-blue-600 font-medium"
                      >
                        View all {habits.length} habits →
                      </button>
                    )}
                </div>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
              {/* Daily Quote */}
              <div className="p-6 bg-gradient-to-br from-primary to-slate-900 rounded-lg shadow-soft text-white">
                  <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-3 opacity-80">Daily Inspiration</h4>
                  <p className="text-gray-100 italic leading-relaxed mb-3">"{todayQuote.text}"</p>
                  <p className="text-right text-sm text-gray-400">— {todayQuote.author}</p>
              </div>

              {/* Upcoming Goals */}
              <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-soft">
                  <h4 className="font-medium text-primary mb-3">Active Goals</h4>
                  {goals.length === 0 ? (
                    <p className="text-sm text-secondary">No active goals. <button onClick={() => navigate('/goals')} className="text-action hover:underline">Set one now</button></p>
                  ) : (
                    <div className="space-y-3">
                      {goals.map(goal => (
                        <div key={goal._id} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                          <p className="text-sm font-medium text-primary mb-1">{goal.title}</p>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-action h-1.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => navigate('/goals')}
                        className="text-sm text-action hover:text-blue-600 font-medium"
                      >
                        View all goals →
                      </button>
                    </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}
