import { useEffect, useState } from 'react';
import api from '../utils/api';
import HabitCard from '../components/HabitCard';
import { Plus, Trash2, Calendar } from 'lucide-react';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: '', description: '', frequency: 'daily' });

  useEffect(() => {
    fetchHabits();
  }, []);

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

  const handleCreate = async (e) => {
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

  const handleCheck = async (id) => {
    try {
      await api.put(`/habits/${id}/check`);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;
    try {
      await api.delete(`/habits/${id}`);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  // Group habits by frequency
  const dailyHabits = habits.filter(h => h.frequency === 'daily');
  const weeklyHabits = habits.filter(h => h.frequency === 'weekly');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-primary">All Habits</h2>
          <p className="text-secondary">Build consistency, one day at a time.</p>
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
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Title</label>
              <input 
                type="text" 
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-action focus:ring-action sm:text-sm py-2 px-3 border"
                placeholder="e.g. Morning meditation"
                value={newHabit.title}
                onChange={e => setNewHabit({...newHabit, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Description (Optional)</label>
              <textarea 
                rows={2}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-action focus:ring-action sm:text-sm py-2 px-3 border resize-none"
                placeholder="Why is this important to you?"
                value={newHabit.description}
                onChange={e => setNewHabit({...newHabit, description: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Frequency</label>
              <select 
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-action focus:ring-action sm:text-sm py-2 px-3 border"
                value={newHabit.frequency}
                onChange={e => setNewHabit({...newHabit, frequency: e.target.value})}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-action text-white rounded-md text-sm font-medium">Save Habit</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-surface text-primary rounded-md text-sm font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Daily Habits */}
      {dailyHabits.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-secondary" />
            <h3 className="text-lg font-medium text-primary">Daily Habits</h3>
            <span className="text-sm text-secondary">({dailyHabits.length})</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {dailyHabits.map(habit => (
              <div key={habit._id} className="relative group">
                <HabitCard habit={habit} onCheck={handleCheck} />
                <button 
                  onClick={() => handleDelete(habit._id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-md shadow-md hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Habits */}
      {weeklyHabits.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-secondary" />
            <h3 className="text-lg font-medium text-primary">Weekly Habits</h3>
            <span className="text-sm text-secondary">({weeklyHabits.length})</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {weeklyHabits.map(habit => (
              <div key={habit._id} className="relative group">
                <HabitCard habit={habit} onCheck={handleCheck} />
                <button 
                  onClick={() => handleDelete(habit._id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-md shadow-md hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {habits.length === 0 && !loading && (
        <div className="text-center py-20 bg-surface/30 rounded-lg border border-dashed border-gray-200">
          <p className="text-secondary mb-2">No habits tracked yet.</p>
          <button onClick={() => setShowForm(true)} className="text-action font-medium hover:underline">Create your first habit</button>
        </div>
      )}
    </div>
  );
}
