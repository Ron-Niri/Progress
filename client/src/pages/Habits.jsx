import { useEffect, useState } from 'react';
import api from '../utils/api';
import HabitCard from '../components/HabitCard';
import HabitTemplatePicker from '../components/HabitTemplatePicker';
import { Plus, Trash2, Calendar, Sparkles, Filter } from 'lucide-react';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [newHabit, setNewHabit] = useState({ 
    title: '', 
    description: '', 
    frequency: 'daily',
    icon: '✓',
    color: '#10B981',
    category: 'general'
  });

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
      setNewHabit({ title: '', description: '', frequency: 'daily', icon: '✓', color: '#10B981', category: 'general' });
      setShowForm(false);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTemplateSelect = async (templateId) => {
    if (!templateId) {
      setShowTemplatePicker(false);
      setShowForm(true);
      return;
    }

    try {
      await api.post(`/habits/from-template/${templateId}`);
      setShowTemplatePicker(false);
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

  if (loading) return <div className="flex items-center justify-center h-64 text-secondary">Loading your habits...</div>;

  const dailyHabits = habits.filter(h => h.frequency === 'daily');
  const weeklyHabits = habits.filter(h => h.frequency === 'weekly');

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary dark:text-dark-primary">Your Habits</h2>
          <p className="text-secondary dark:text-dark-secondary">Discipline is the bridge between goals and accomplishment.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowTemplatePicker(true)}
            className="px-5 py-2.5 bg-surface dark:bg-gray-800 text-primary dark:text-dark-primary rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-700"
          >
            <Sparkles size={16} className="text-accent" /> Use Template
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-primary dark:bg-dark-primary text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-md"
          >
            <Plus size={16} /> Custom Habit
          </button>
        </div>
      </div>

      {showForm && (
        <div className="p-8 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <h3 className="text-xl font-heading font-bold mb-6 text-primary dark:text-dark-primary">Create habit from scratch</h3>
          <form onSubmit={handleCreate} className="space-y-6">
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
                <label className="text-sm font-medium text-primary dark:text-dark-primary">Frequency</label>
                <select 
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-4 py-3 text-sm focus:ring-2 focus:ring-action transition-all outline-none text-primary dark:text-dark-primary"
                  value={newHabit.frequency}
                  onChange={e => setNewHabit({...newHabit, frequency: e.target.value})}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary dark:text-dark-primary">Description (Optional)</label>
              <textarea 
                rows={2}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-4 py-3 text-sm focus:ring-2 focus:ring-action transition-all outline-none text-primary dark:text-dark-primary resize-none"
                placeholder="Why is this important?"
                value={newHabit.description}
                onChange={e => setNewHabit({...newHabit, description: e.target.value})}
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="px-8 py-3 bg-action text-white rounded-xl font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all">Create Habit</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 bg-surface dark:bg-gray-800 text-primary dark:text-dark-primary rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Habit Groups */}
      <div className="space-y-12">
        {dailyHabits.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <h3 className="font-heading font-bold text-lg text-primary dark:text-dark-primary flex items-center gap-2">
                <Calendar size={20} className="text-action text-opacity-70" /> Daily Rituals
              </h3>
              <span className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest">{dailyHabits.length} Habits</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {dailyHabits.map(habit => (
                <HabitCard key={habit._id} habit={habit} onCheck={handleCheck} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}

        {weeklyHabits.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <h3 className="font-heading font-bold text-lg text-primary dark:text-dark-primary flex items-center gap-2">
                <Filter size={20} className="text-accent text-opacity-70" /> Weekly Objectives
              </h3>
              <span className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest">{weeklyHabits.length} Habits</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {weeklyHabits.map(habit => (
                <HabitCard key={habit._id} habit={habit} onCheck={handleCheck} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}

        {habits.length === 0 && (
          <div className="text-center py-32 bg-surface/30 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 bg-white dark:bg-dark-surface rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft">
              <Plus className="text-secondary" size={40} />
            </div>
            <h3 className="text-xl font-heading font-bold text-primary dark:text-dark-primary mb-2">Build Your First Habit</h3>
            <p className="text-secondary dark:text-dark-secondary max-w-sm mx-auto mb-8">Start small, stay consistent, and watch yourself grow into your peak potential.</p>
            <button 
              onClick={() => setShowTemplatePicker(true)}
              className="px-10 py-4 bg-primary dark:bg-action text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              Explore Templates
            </button>
          </div>
        )}
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
