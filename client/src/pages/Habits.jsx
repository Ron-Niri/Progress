import { useEffect, useState } from 'react';
import api from '../utils/api';
import HabitCard from '../components/HabitCard';
import HabitTemplatePicker from '../components/HabitTemplatePicker';
import { Plus, Trash2, Calendar, Sparkles, Filter, Search, X, Check, Activity } from 'lucide-react';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
      if (editingId) {
        await api.put(`/habits/${editingId}`, newHabit);
      } else {
        await api.post('/habits', newHabit);
      }
      setNewHabit({ title: '', description: '', frequency: 'daily', icon: '✓', color: '#10B981', category: 'general' });
      setShowForm(false);
      setEditingId(null);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (habit) => {
    setNewHabit({
      title: habit.title,
      description: habit.description || '',
      frequency: habit.frequency,
      icon: habit.icon,
      color: habit.color,
      category: habit.category
    });
    setEditingId(habit._id);
    setShowForm(true);
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
    if (!window.confirm('Are you sure you want to delete this habit? This will remove all progress history.')) return;
    try {
      await api.delete(`/habits/${id}`);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-action rounded-full animate-spin"></div>
      <p className="text-secondary dark:text-dark-secondary font-medium animate-pulse">Syncing your rituals...</p>
    </div>
  );

  const filteredHabits = habits.filter(h => 
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dailyHabits = filteredHabits.filter(h => h.frequency === 'daily');
  const weeklyHabits = filteredHabits.filter(h => h.frequency === 'weekly');

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary dark:text-dark-primary flex items-center gap-3">
             <Activity className="text-action" size={32} /> Your Rituals
          </h2>
          <p className="text-secondary dark:text-dark-secondary mt-1">Consistency is the bridge between goals and accomplishment.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowTemplatePicker(true)}
            className="px-5 py-3 bg-white dark:bg-dark-surface text-primary dark:text-dark-primary rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-surface dark:hover:bg-gray-800 transition-all border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <Sparkles size={16} className="text-accent" /> Explore Templates
          </button>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) setEditingId(null);
            }}
            className="px-5 py-3 bg-primary dark:bg-action text-white rounded-2xl text-sm font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />} 
            {showForm ? 'Close Editor' : 'Custom Habit'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="p-8 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-heading font-bold mb-6 text-primary dark:text-dark-primary flex items-center gap-2">
            {editingId ? <Edit2 size={20} className="text-action" /> : <Plus size={20} className="text-action" />}
            {editingId ? 'Refine your ritual' : 'Design a new habit'}
          </h3>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest">Habit Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-5 py-4 text-primary dark:text-dark-primary focus:ring-2 focus:ring-action transition-all outline-none shadow-sm"
                  placeholder="e.g. Morning Meditation"
                  value={newHabit.title}
                  onChange={e => setNewHabit({...newHabit, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest">Frequency</label>
                <select 
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-5 py-4 text-primary dark:text-dark-primary focus:ring-2 focus:ring-action transition-all outline-none shadow-sm"
                  value={newHabit.frequency}
                  onChange={e => setNewHabit({...newHabit, frequency: e.target.value})}
                >
                  <option value="daily">Every Day</option>
                  <option value="weekly">Once a Week</option>
                </select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest">Category</label>
                <select 
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-5 py-4 text-primary dark:text-dark-primary focus:ring-2 focus:ring-action transition-all outline-none shadow-sm"
                  value={newHabit.category}
                  onChange={e => setNewHabit({...newHabit, category: e.target.value})}
                >
                  <option value="general">General</option>
                  <option value="health">Health & Fitness</option>
                  <option value="productivity">Work & Productivity</option>
                  <option value="learning">Mind & Learning</option>
                  <option value="wellness">Spirit & Wellness</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest">Color Theme</label>
                <div className="flex gap-2 p-2 bg-surface dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewHabit({...newHabit, color: c})}
                      className={`w-10 h-10 rounded-xl transition-all ${newHabit.color === c ? 'scale-110 shadow-lg ring-2 ring-white dark:ring-gray-600' : 'opacity-40 hover:opacity-100'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest">Icon</label>
                <input 
                  type="text" 
                  maxLength={2}
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-5 py-4 text-primary dark:text-dark-primary focus:ring-2 focus:ring-action transition-all outline-none shadow-sm text-center text-xl"
                  placeholder="✓"
                  value={newHabit.icon}
                  onChange={e => setNewHabit({...newHabit, icon: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest">Why is this important?</label>
              <textarea 
                rows={2}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-5 py-4 text-primary dark:text-dark-primary focus:ring-2 focus:ring-action transition-all outline-none shadow-sm resize-none"
                placeholder="Describe your motivation..."
                value={newHabit.description}
                onChange={e => setNewHabit({...newHabit, description: e.target.value})}
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button type="submit" className="px-10 py-3 bg-action text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2">
                <Check size={18} /> {editingId ? 'Update Habit' : 'Confirm Habit'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }} 
                className="px-10 py-3 bg-surface dark:bg-gray-800 text-primary dark:text-dark-primary rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-30" size={20} />
        <input 
          type="text"
          placeholder="Filter your habits by title or category..."
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 text-primary dark:text-dark-primary focus:ring-2 focus:ring-action outline-none transition-all shadow-soft"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Habit Groups */}
      <div className="space-y-12">
        {dailyHabits.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
              <h3 className="font-heading font-bold text-xl text-primary dark:text-dark-primary flex items-center gap-3">
                <Calendar size={24} className="text-action opacity-50" /> Daily Rituals
              </h3>
              <span className="text-[10px] font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] bg-surface dark:bg-gray-800 px-3 py-1.5 rounded-lg">{dailyHabits.length} Active</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {dailyHabits.map(habit => (
                <HabitCard key={habit._id} habit={habit} onCheck={handleCheck} onDelete={handleDelete} onEdit={handleEdit} />
              ))}
            </div>
          </div>
        )}

        {weeklyHabits.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
              <h3 className="font-heading font-bold text-xl text-primary dark:text-dark-primary flex items-center gap-3">
                <Filter size={24} className="text-accent opacity-50" /> Weekly Objectives
              </h3>
              <span className="text-[10px] font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] bg-surface dark:bg-gray-800 px-3 py-1.5 rounded-lg">{weeklyHabits.length} Active</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {weeklyHabits.map(habit => (
                <HabitCard key={habit._id} habit={habit} onCheck={handleCheck} onDelete={handleDelete} onEdit={handleEdit} />
              ))}
            </div>
          </div>
        )}

        {habits.length === 0 && !loading && (
          <div className="text-center py-40 bg-surface/30 dark:bg-gray-800/20 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
            <div className="w-24 h-24 bg-white dark:bg-dark-surface rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-soft">
              <Plus className="text-secondary opacity-20" size={48} />
            </div>
            <h3 className="text-2xl font-heading font-bold text-primary dark:text-dark-primary mb-3">Build Your First Habit</h3>
            <p className="text-secondary dark:text-dark-secondary max-w-sm mx-auto mb-10 leading-relaxed">Start small, stay consistent, and watch yourself grow into your peak potential. What's the one thing you'll do today?</p>
            <button 
              onClick={() => setShowTemplatePicker(true)}
              className="px-12 py-4 bg-primary dark:bg-action text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              Explore Expert Templates
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
