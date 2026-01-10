import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Trash2, Edit2, CheckCircle2, Circle, Target, Calendar, Clock, AlertCircle, X, ChevronRight } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', targetDate: '' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      setGoals(res.data);
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
        await api.put(`/goals/${editingId}`, newGoal);
      } else {
        await api.post('/goals', newGoal);
      }
      setNewGoal({ title: '', description: '', targetDate: '' });
      setShowForm(false);
      setEditingId(null);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (goal) => {
    setNewGoal({
      title: goal.title,
      description: goal.description,
      targetDate: goal.targetDate ? format(new Date(goal.targetDate), 'yyyy-MM-dd') : ''
    });
    setEditingId(goal._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
     if(!window.confirm('Are you sure you want to delete this goal? This history will be lost.')) return;
     try {
         await api.delete(`/goals/${id}`);
         fetchGoals();
     } catch (err) {
         console.error(err);
     }
  };

  const toggleStatus = async (goal) => {
      const newStatus = goal.status === 'completed' ? 'pending' : 'completed';
      const newProgress = newStatus === 'completed' ? 100 : 0;
      try {
          await api.put(`/goals/${goal._id}`, { status: newStatus, progress: newProgress });
          fetchGoals();
      } catch (err) {
          console.error(err);
      }
  };

  const getDaysLeft = (date) => {
    if (!date) return null;
    const diff = differenceInDays(new Date(date), new Date());
    return diff;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-action rounded-full animate-spin"></div>
      <p className="text-secondary dark:text-dark-secondary font-medium animate-pulse">Calculating your milestones...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl sm:text-4xl font-heading font-black text-primary dark:text-dark-primary flex items-center gap-4">
             <Target className="text-action" size={36} /> Goals & Milestones
           </h2>
           <p className="text-secondary dark:text-dark-secondary mt-1 text-sm sm:text-base font-medium opacity-70 leading-relaxed">Track your long-term ambitions and break them down.</p>
        </div>
        <button 
           onClick={() => {
             setShowForm(!showForm);
             if (showForm) setEditingId(null);
           }}
           className="w-full lg:w-auto px-8 py-4 bg-primary dark:bg-action text-white rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />} 
          {showForm ? 'Close' : 'Target New Goal'}
        </button>
      </div>

       {showForm && (
          <div className="p-8 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-xl font-heading font-bold mb-6 text-primary dark:text-dark-primary flex items-center gap-2">
              {editingId ? <Edit2 size={20} className="text-action" /> : <Target size={20} className="text-action" />}
              {editingId ? 'Refine your ambition' : 'Set a new horizon'}
            </h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest">Goal Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-5 py-4 text-primary dark:text-dark-primary focus:ring-2 focus:ring-action transition-all outline-none shadow-sm"
                    placeholder="e.g. Run a Half Marathon"
                    value={newGoal.title}
                    onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest">Target Deadline</label>
                  <input 
                    type="date" 
                    className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-5 py-4 text-primary dark:text-dark-primary focus:ring-2 focus:ring-action transition-all outline-none shadow-sm"
                    value={newGoal.targetDate}
                    onChange={e => setNewGoal({...newGoal, targetDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest">Description & Strategy</label>
                 <textarea 
                    rows={3}
                    className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-5 py-4 text-primary dark:text-dark-primary focus:ring-2 focus:ring-action transition-all outline-none resize-none shadow-sm"
                    placeholder="Break down your approach..."
                    value={newGoal.description}
                    onChange={e => setNewGoal({...newGoal, description: e.target.value})}
                 />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="submit" className="px-10 py-3 bg-action text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg">
                  {editingId ? 'Update Goal' : 'Initialize Goal'}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const daysLeft = getDaysLeft(goal.targetDate);
          const isOverdue = daysLeft !== null && daysLeft < 0 && goal.status !== 'completed';
          
          return (
            <div key={goal._id} className={`p-8 rounded-3xl border shadow-soft flex flex-col justify-between transition-all hover:shadow-xl group overflow-hidden relative ${goal.status === 'completed' ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-500/20' : 'bg-white dark:bg-dark-surface border-gray-100 dark:border-gray-700'}`}>
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                 <Target size={120} />
               </div>

               <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                        <Target className={goal.status === 'completed' ? 'text-accent' : 'text-action'} size={24} />
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => handleEdit(goal)} className="p-2 text-secondary hover:text-action hover:bg-surface dark:hover:bg-gray-800 rounded-xl transition-all"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(goal._id)} className="p-2 text-secondary hover:text-red-500 hover:bg-surface dark:hover:bg-gray-800 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                  </div>
                  
                  <h3 className={`font-bold text-xl mb-2 line-clamp-1 ${goal.status === 'completed' ? 'text-accent line-through opacity-50' : 'text-primary dark:text-dark-primary'}`}>{goal.title}</h3>
                  {goal.description && <p className="text-secondary dark:text-dark-secondary text-sm mb-6 line-clamp-2 min-h-[2.5rem]">{goal.description}</p>}
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                     {goal.targetDate && (
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${isOverdue ? 'bg-red-100 text-red-600 dark:bg-red-900/20' : 'bg-surface dark:bg-gray-800 text-secondary'}`}>
                         <Calendar size={12} /> {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                       </span>
                     )}
                     {daysLeft !== null && goal.status !== 'completed' && (
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${isOverdue ? 'bg-red-100 text-red-600 dark:bg-red-900/20' : 'bg-blue-50 text-action dark:bg-blue-900/20'}`}>
                          <Clock size={12} /> {isOverdue ? 'Overdue' : `${daysLeft} Days Left`}
                        </span>
                     )}
                  </div>
               </div>
               
               <div className="relative z-10 mt-auto">
                  <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-widest">
                    <span className="text-secondary">Progress</span>
                    <span className={goal.status === 'completed' ? 'text-accent' : 'text-action'}>{goal.progress}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${goal.status === 'completed' ? 'bg-accent' : 'bg-action'}`} 
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                    </div>
                    <button onClick={() => toggleStatus(goal)} className="p-1 hover:scale-110 transition-all">
                        {goal.status === 'completed' ? <CheckCircle2 size={32} className="text-accent" /> : <Circle size={32} className="text-slate-200 dark:text-gray-700 hover:text-action" />}
                    </button>
                  </div>
               </div>
            </div>
          );
        })}
        
        {goals.length === 0 && !loading && (
            <div className="col-span-full text-center py-32 bg-surface/30 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 bg-white dark:bg-dark-surface rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <Target className="text-secondary opacity-20" size={40} />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary dark:text-dark-primary mb-2">No active goals</h3>
                <p className="text-secondary dark:text-dark-secondary max-w-sm mx-auto mb-8">Success starts with intent. What is the one thing you want to achieve this year?</p>
                <button 
                  onClick={() => setShowForm(true)}
                  className="px-8 py-3 bg-primary dark:bg-action text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
                >
                  Set Your First Goal
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
