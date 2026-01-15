import { useEffect, useState } from 'react';
import api from '../utils/api';
import HabitCard from '../components/HabitCard';
import HabitTemplatePicker from '../components/HabitTemplatePicker';
import { 
  Plus, X, Check, Activity, Edit2, Search, 
  Filter, Sparkles, LayoutGrid, List, Target, 
  Flame, Calendar, Save, Trash
} from 'lucide-react';
import Skeleton from '../components/Skeleton';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const initialHabitState = { 
    title: '', 
    description: '', 
    frequency: 'daily',
    icon: '✓',
    color: '#3B82F6',
    category: 'general'
  };

  const [newHabit, setNewHabit] = useState(initialHabitState);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      if (habits.length === 0) setLoading(true);
      const res = await api.get('/habits');
      setHabits(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenModal = (habit = null) => {
    if (habit) {
      setEditingId(habit._id);
      setNewHabit({
        title: habit.title,
        description: habit.description || '',
        frequency: habit.frequency,
        icon: habit.icon,
        color: habit.color,
        category: habit.category
      });
    } else {
      setEditingId(null);
      setNewHabit(initialHabitState);
    }
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/habits/${editingId}`, newHabit);
      } else {
        await api.post('/habits', newHabit);
      }
      setShowModal(false);
      setEditingId(null);
      setNewHabit(initialHabitState);
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTemplateSelect = async (templateId) => {
    if (!templateId) {
      setShowTemplatePicker(false);
      handleOpenModal();
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

  const filteredHabits = habits.filter(h => 
    h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dailyHabits = filteredHabits.filter(h => h.frequency === 'daily');
  const weeklyHabits = filteredHabits.filter(h => h.frequency === 'weekly');

  if (loading && habits.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-action rounded-full animate-spin"></div>
        <Activity className="absolute inset-0 m-auto text-action animate-pulse" size={24} />
      </div>
      <p className="text-secondary dark:text-dark-secondary font-heading font-bold text-lg animate-pulse">Syncing your rituals...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-action/10 rounded-lg">
              <Activity className="text-action" size={24} />
            </div>
            <span className="text-action font-black uppercase tracking-[0.2em] text-[10px]">Daily Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-primary dark:text-dark-primary tracking-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-action to-accent">Rituals</span>
          </h1>
          <p className="text-secondary dark:text-dark-secondary max-w-xl font-medium">
            Consistency is the bridge between goals and accomplishment. Build the routine of an elite performer.
          </p>
        </div>
        
        <div className="flex items-stretch gap-3">
          <button 
            onClick={() => setShowTemplatePicker(true)}
            className="px-6 py-4 bg-white dark:bg-dark-surface text-primary dark:text-dark-primary border border-gray-100 dark:border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-surface dark:hover:bg-gray-800 transition-all shadow-soft"
          >
            <Sparkles size={16} className="text-accent" />
            Templates
          </button>
          <button 
             onClick={() => handleOpenModal()}
             className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-primary dark:bg-action text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] hover:-translate-y-0.5"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            Add Ritual
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Consistency', value: habits.length ? Math.round((habits.filter(h => h.streak > 0).length / habits.length) * 100) + '%' : '0%', color: 'text-action', bg: 'bg-action/5 border-action/10' },
          { label: 'Longest Streak', value: Math.max(0, ...habits.map(h => h.streak || 0)), color: 'text-orange-500', bg: 'bg-orange-500/5 border-orange-500/10' },
          { label: 'Total Rituals', value: habits.length, color: 'text-purple-500', bg: 'bg-purple-500/5 border-purple-500/10' },
          { label: 'Today\'s Finish', value: habits.filter(h => h.completedDates?.some(d => new Date(d).toDateString() === new Date().toDateString())).length, color: 'text-accent', bg: 'bg-accent/5 border-accent/10' }
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-[1.5rem] border backdrop-blur-sm ${stat.bg}`}>
            <p className="text-[10px] uppercase tracking-widest font-black text-secondary mb-1 opacity-70">{stat.label}</p>
            <p className={`text-2xl font-heading font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-action transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Filter your rituals by title or category..."
          className="w-full pl-16 pr-8 py-5 bg-white dark:bg-dark-surface rounded-[1.5rem] border border-gray-100 dark:border-gray-800 text-primary dark:text-dark-primary font-bold focus:ring-4 focus:ring-action/10 focus:border-action transition-all outline-none shadow-soft"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Habit Groups */}
      <div className="space-y-16">
        {dailyHabits.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="font-heading font-black text-2xl text-primary dark:text-dark-primary flex items-center gap-4">
                <Calendar size={28} className="text-action/40" /> Daily Rituals
              </h3>
              <span className="text-[10px] font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] bg-surface dark:bg-gray-800/50 px-3 py-1.5 rounded-xl">{dailyHabits.length} Active</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dailyHabits.map(habit => (
                <HabitCard key={habit._id} habit={habit} onCheck={handleCheck} onDelete={handleDelete} onEdit={handleOpenModal} />
              ))}
            </div>
          </div>
        )}

        {weeklyHabits.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="font-heading font-black text-2xl text-primary dark:text-dark-primary flex items-center gap-4">
                <Filter size={28} className="text-accent/40" /> Weekly Objectives
              </h3>
              <span className="text-[10px] font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] bg-surface dark:bg-gray-800/50 px-3 py-1.5 rounded-xl">{weeklyHabits.length} Active</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {weeklyHabits.map(habit => (
                <HabitCard key={habit._id} habit={habit} onCheck={handleCheck} onDelete={handleDelete} onEdit={handleOpenModal} />
              ))}
            </div>
          </div>
        )}

        {habits.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-40 bg-white dark:bg-dark-surface rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-action/5 via-transparent to-transparent" />
            <div className="relative z-10 text-center px-4">
              <div className="w-24 h-24 bg-action/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Activity className="text-action" size={48} />
              </div>
              <h3 className="text-3xl font-heading font-black text-primary dark:text-dark-primary mb-3">Architect Your Progress</h3>
              <p className="text-secondary dark:text-dark-secondary max-w-sm mx-auto mb-10 font-bold opacity-80 leading-relaxed">
                Consistency isn't about intensity; it's about direction. Start with a single habit today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setShowTemplatePicker(true)}
                  className="px-10 py-5 bg-primary dark:bg-action text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  Browse Expert Blueprints
                </button>
                <button 
                  onClick={() => handleOpenModal()}
                  className="px-10 py-5 bg-surface dark:bg-gray-800 text-primary dark:text-dark-primary rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] border border-gray-100 dark:border-gray-700 transition-all"
                >
                  Custom Build
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Habit Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 backdrop-blur-xl bg-white/40 dark:bg-black/60 animate-in fade-in duration-300">
          <div 
            className="bg-white dark:bg-dark-surface w-full max-w-2xl rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center shadow-inner">
                  {editingId ? <Edit2 className="text-accent" size={28} /> : <Activity className="text-accent" size={28} />}
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-black text-primary dark:text-dark-primary">
                    {editingId ? 'Refine Ritual' : 'Blueprint Ritual'}
                  </h2>
                  <p className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest opacity-60">
                    {editingId ? 'Iterative Growth' : 'Define your trajectory'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl text-secondary hover:text-primary transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-8 pt-4 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Ritual Designation</label>
                    <input 
                      type="text" 
                      required
                      className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 py-5 text-primary dark:text-dark-primary font-bold focus:ring-0 focus:border-action focus:bg-white dark:focus:bg-dark-surface transition-all outline-none"
                      placeholder="e.g. Deep Work Session"
                      value={newHabit.title}
                      onChange={e => setNewHabit({...newHabit, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Frequency Cycle</label>
                    <select 
                      className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 py-5 text-primary dark:text-dark-primary font-bold focus:ring-0 focus:border-action focus:bg-white dark:focus:bg-dark-surface transition-all outline-none appearance-none"
                      value={newHabit.frequency}
                      onChange={e => setNewHabit({...newHabit, frequency: e.target.value})}
                    >
                      <option value="daily">Every Day (Standard)</option>
                      <option value="weekly">Once Weekly (Strategic)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Vector Category</label>
                    <select 
                      className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 py-5 text-primary dark:text-dark-primary font-bold focus:ring-0 focus:border-action transition-all outline-none appearance-none"
                      value={newHabit.category}
                      onChange={e => setNewHabit({...newHabit, category: e.target.value})}
                    >
                      <option value="general">General</option>
                      <option value="health">Physiology</option>
                      <option value="productivity">Systems</option>
                      <option value="learning">Knowledge</option>
                      <option value="wellness">Psychology</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Icon Representation</label>
                    <input 
                      type="text" 
                      maxLength={2}
                      className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 py-5 text-primary dark:text-dark-primary font-bold focus:ring-0 focus:border-action text-center text-2xl transition-all outline-none"
                      placeholder="✓"
                      value={newHabit.icon}
                      onChange={e => setNewHabit({...newHabit, icon: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Color Anchor</label>
                    <div className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-gray-50 dark:border-gray-800 h-[68px] items-center">
                      {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setNewHabit({...newHabit, color: c})}
                          className={`flex-1 h-8 rounded-lg transition-all ${newHabit.color === c ? 'scale-110 shadow-lg ring-2 ring-white' : 'opacity-40'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Strategic Rationale</label>
                  <textarea 
                    rows={3}
                    className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 py-5 text-primary dark:text-dark-primary font-medium focus:ring-0 focus:border-action transition-all outline-none resize-none"
                    placeholder="Why must this be done? What's the cost of failure?"
                    value={newHabit.description}
                    onChange={e => setNewHabit({...newHabit, description: e.target.value})}
                  />
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-gray-50 dark:border-gray-800/50 flex flex-col sm:flex-row gap-4">
              <button 
                type="button" 
                onClick={handleCreate}
                className="flex-1 flex items-center justify-center gap-3 py-5 bg-action text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:shadow-xl shadow-action/30 active:scale-95"
              >
                <Save size={18} />
                {editingId ? 'Optimize Ritual' : 'Deploy Ritual'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="px-10 py-5 bg-gray-50 dark:bg-gray-800 text-primary dark:text-dark-primary rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-100 transition-all border border-gray-200 dark:border-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showTemplatePicker && (
        <HabitTemplatePicker 
          onSelect={handleTemplateSelect} 
          onClose={() => setShowTemplatePicker(false)} 
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
