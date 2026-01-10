import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import HabitCard from '../components/HabitCard';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
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
    fetchHabits();
  }, [user]);

  const fetchHabits = async () => {
    try {
      const res = await api.get('/habits');
      setHabits(res.data);
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
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckHabit = async (id) => {
    try {
      await api.put(`/habits/${id}/check`);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-heading font-semibold text-primary">Dashboard</h2>
           <p className="text-secondary">Overview of your progress today.</p>
        </div>
        <button 
           onClick={() => setShowForm(!showForm)}
           className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium flex items-center gap-2"
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
              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 bg-action text-white rounded-md text-sm font-medium">Save Habit</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-surface text-primary rounded-md text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        )}

      <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Habits Section */}
          <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">Today's Habits</h3>
              {habits.length === 0 ? (
                <div className="text-center py-10 bg-surface/30 rounded-lg border border-dashed border-gray-200">
                    <p className="text-secondary">No habits yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                    {habits.map(habit => (
                    <HabitCard key={habit._id} habit={habit} onCheck={handleCheckHabit} />
                    ))}
                </div>
              )}
          </div>

          {/* Quick Summary Widget */}
          <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">At a Glance</h3>
              <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-soft">
                  <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                          <div className="text-3xl font-bold text-primary">{habits.filter(h => h.streak > 0).length}</div>
                          <div className="text-xs text-secondary uppercase tracking-wider mt-1">Active Streaks</div>
                      </div>
                      <div>
                          <div className="text-3xl font-bold text-accent">85%</div>
                          <div className="text-xs text-secondary uppercase tracking-wider mt-1">Completion Rate</div>
                      </div>
                  </div>
              </div>

               <div className="p-6 bg-gradient-to-br from-primary to-slate-900 rounded-lg shadow-soft text-white">
                  <h4 className="font-heading font-semibold text-lg mb-2">Daily Quote</h4>
                  <p className="text-gray-300 italic">"Success is the sum of small efforts, repeated day in and day out."</p>
                  <p className="text-right text-sm text-gray-400 mt-2">- Robert Collier</p>
              </div>
          </div>
      </div>
    </div>
  );
}
