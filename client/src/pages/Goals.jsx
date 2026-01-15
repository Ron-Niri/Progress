import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Plus, Trash2, Edit2, CheckCircle2, Circle, Target, Calendar, Clock, 
  AlertCircle, X, Hash, Link as LinkIcon, Users, 
  Layers, Lightbulb, ArrowRight, Save, Trash, Loader2
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useAuth } from '../context/AuthContext';

import { useProgressData } from '../context/ProgressContext';

export default function Goals() {
  const { goals: globalGoals, loading: globalLoading, refreshSilent } = useProgressData();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [userInvitations, setUserInvitations] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [inviting, setInviting] = useState(false);
  
  const initialGoalState = { 
    title: '', 
    description: '', 
    targetDate: '', 
    category: 'General',
    subGoals: [],
    milestones: [],
    dependencies: [],
    collaboratorsText: '',
    attachmentsText: ''
  };

  const [newGoal, setNewGoal] = useState(initialGoalState);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [showModal]);

  useEffect(() => {
    if (!globalLoading && globalGoals) {
      setGoals(globalGoals);
      setLoading(false);
    }
  }, [globalGoals, globalLoading]);

  // For manual or background refreshes that might happen specifically here
  const fetchGoals = async () => {
    await refreshSilent();
    fetchUserInvitations();
  };

  const fetchUserInvitations = async () => {
    try {
      const res = await api.get('/goals/invitations');
      setUserInvitations(res.data);
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
    }
  };

  useEffect(() => {
    fetchUserInvitations();
  }, []);

  useEffect(() => {
    if (userSearch.length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        setSearching(true);
        try {
          const res = await api.get(`/profile/search/users?q=${userSearch}`);
          setSearchResults(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setSearching(false);
        }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [userSearch]);

  const handleInvite = async (username) => {
    if (!editingId) return;
    setInviting(true);
    try {
      await api.post(`/goals/${editingId}/invite`, { username });
      alert(`Invitation sent to ${username}`);
      setUserSearch('');
      setSearchResults([]);
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleAcceptInvitation = async (token) => {
    try {
      await api.post(`/goals/accept/${token}`);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditingId(goal._id);
      setNewGoal({
        title: goal.title,
        description: goal.description || '',
        targetDate: goal.targetDate ? format(new Date(goal.targetDate), 'yyyy-MM-dd') : '',
        category: goal.category || 'General',
        subGoals: goal.subGoals || [],
        milestones: goal.milestones || [],
        dependencies: goal.dependencies || [],
        collaboratorsText: (goal.collaborators || []).join(', '),
        attachmentsText: (goal.attachments || []).map(a => a.url).join(', ')
      });
    } else {
      setEditingId(null);
      setNewGoal(initialGoalState);
    }
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    
    // Construct payload
    const attachments = (newGoal.attachmentsText || '')
      .split(',')
      .filter(l => l.trim())
      .map(l => ({ url: l.trim(), name: l.trim().split('/').pop() || 'Link' }));

    const payload = {
      ...newGoal,
      attachments,
      collaborators: [] 
    };

    try {
      if (editingId) {
        await api.put(`/goals/${editingId}`, payload);
      } else {
        const res = await api.post('/goals', payload);
        if (res.data.gamification) refreshUser();
      }
      setShowModal(false);
      setNewGoal(initialGoalState);
      setEditingId(null);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
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
          const res = await api.put(`/goals/${goal._id}`, { status: newStatus, progress: newProgress });
          if (res.data.gamification) refreshUser();
          fetchGoals();
      } catch (err) {
          console.error(err);
      }
  };

  const toggleSubGoal = async (goal, subGoalIdx) => {
    const updatedSubGoals = [...goal.subGoals];
    updatedSubGoals[subGoalIdx].completed = !updatedSubGoals[subGoalIdx].completed;
    
    // Recalculate progress based on subgoals
    const completedCount = updatedSubGoals.filter(sg => sg.completed).length;
    const progress = Math.round((completedCount / updatedSubGoals.length) * 100);
    const status = progress === 100 ? 'completed' : 'in-progress';

    try {
      await api.put(`/goals/${goal._id}`, { subGoals: updatedSubGoals, progress, status });
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-action rounded-full animate-spin"></div>
        <Target className="absolute inset-0 m-auto text-action animate-pulse" size={24} />
      </div>
      <p className="text-secondary dark:text-dark-secondary font-heading font-bold text-lg animate-pulse">Charting your course...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-action/10 rounded-lg">
              <Target className="text-action" size={24} />
            </div>
            <span className="text-action font-black uppercase tracking-[0.2em] text-[10px]">Strategic Planning</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-primary dark:text-dark-primary tracking-tight">
            Goals & <span className="text-transparent bg-clip-text bg-gradient-to-r from-action to-accent">Milestones</span>
          </h1>
          <p className="text-secondary dark:text-dark-secondary max-w-xl font-medium">
            Turn your long-term visions into reality by breaking them down into actionable achievements.
          </p>
        </div>
        
        <button 
           onClick={() => handleOpenModal()}
           className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-primary dark:bg-action text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:translate-y-0"
        >
          <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Set New Goal
        </button>
      </div>

      {/* Pending Invitations Banner */}
      {userInvitations.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-2 px-1">
             <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
               <Users size={16} />
             </div>
             <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Incoming Missions ({userInvitations.length})</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userInvitations.map(invite => (
                <div key={invite._id} className="p-6 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-[2rem] flex items-center justify-between gap-4 backdrop-blur-sm">
                   <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 italic">Invited by @{invite.invitedBy?.username}</p>
                      <h4 className="text-sm font-black text-primary dark:text-dark-primary truncate">{invite.title}</h4>
                   </div>
                   <button 
                    onClick={() => handleAcceptInvitation(invite.token)} 
                    className="px-5 py-2.5 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all shrink-0"
                   >
                     Accept
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active', value: goals.filter(g => g.status !== 'completed').length, color: 'text-action', bg: 'bg-action/5 border-action/10' },
          { label: 'Completed', value: goals.filter(g => g.status === 'completed').length, color: 'text-accent', bg: 'bg-accent/5 border-accent/10' },
          { label: 'Success Rate', value: goals.length ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) + '%' : '0%', color: 'text-purple-500', bg: 'bg-purple-500/5 border-purple-500/10' },
          { label: 'Steps Taken', value: goals.reduce((acc, g) => acc + (g.subGoals?.filter(s => s.completed).length || 0), 0), color: 'text-orange-500', bg: 'bg-orange-500/5 border-orange-500/10' }
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-[1.5rem] border backdrop-blur-sm ${stat.bg}`}>
            <p className="text-[10px] uppercase tracking-widest font-black text-secondary mb-1 opacity-70">{stat.label}</p>
            <p className={`text-2xl font-heading font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {goals.map(goal => {
          const daysLeft = getDaysLeft(goal.targetDate);
          const isOverdue = daysLeft !== null && daysLeft < 0 && goal.status !== 'completed';
          
          return (
            <div 
              key={goal._id} 
              className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden
                ${goal.status === 'completed' 
                  ? 'bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-dark-surface border-green-100 dark:border-green-500/20' 
                  : 'bg-white dark:bg-dark-surface border-gray-100 dark:border-gray-800'}`}
            >
               <Target size={160} className="absolute -right-10 -bottom-10 text-primary dark:text-white opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000" />

               <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-60">
                          {goal.category || 'General'}
                        </span>
                        <div className={`w-12 h-1 rounded-full ${goal.status === 'completed' ? 'bg-accent' : 'bg-action'}`} />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenModal(goal)} className="p-2.5 text-secondary hover:text-action hover:bg-action/10 rounded-xl transition-all"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(goal._id)} className="p-2.5 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                  </div>
                  
                  <div className="mb-6 flex-1">
                    <h3 className={`font-heading font-black text-2xl mb-3 leading-tight ${goal.status === 'completed' ? 'text-accent/60 line-through' : 'text-primary dark:text-dark-primary'}`}>
                      {goal.title}
                    </h3>
                    {goal.description && <p className="text-secondary dark:text-dark-secondary text-sm line-clamp-2 font-medium leading-relaxed">{goal.description}</p>}
                  </div>

                  {goal.subGoals && goal.subGoals.length > 0 && (
                    <div className="mb-6 space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
                         <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Next Steps</span>
                         <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
                      </div>
                      <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                        {goal.subGoals.map((sg, idx) => (
                          <div key={idx} onClick={() => toggleSubGoal(goal, idx)} className="flex items-center gap-3 cursor-pointer group/sg py-1">
                            <div className={`shrink-0 w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-300 ${sg.completed ? 'bg-accent border-accent text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                              {sg.completed && <CheckCircle2 size={12} />}
                            </div>
                            <span className={`text-xs font-bold transition-all line-clamp-1 ${sg.completed ? 'text-secondary line-through' : 'text-primary dark:text-dark-primary group-hover/sg:text-action'}`}>
                              {sg.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800/50">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Velocity</span>
                        <span className={`text-xs font-black ${goal.status === 'completed' ? 'text-accent' : 'text-action'}`}>{goal.progress}%</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_-3px] ${goal.status === 'completed' ? 'bg-accent shadow-accent' : 'bg-action shadow-action'}`} style={{ width: `${goal.progress}%` }}></div>
                        </div>
                        <button onClick={() => toggleStatus(goal)} className={`shrink-0 p-1.5 rounded-xl transition-all hover:scale-110 active:scale-90 ${goal.status === 'completed' ? 'bg-accent/10 text-accent' : 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 hover:text-action'}`}>
                            {goal.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                       {goal.targetDate && (
                         <div className={`px-3 py-2 rounded-xl flex items-center gap-2 border ${isOverdue ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:border-red-500/20' : 'bg-surface dark:bg-gray-800 border-transparent text-secondary'}`}>
                           <Calendar size={14} />
                           <span className="text-[10px] font-bold">{format(new Date(goal.targetDate), 'MMM d, yyyy')}</span>
                         </div>
                       )}
                       {isOverdue && (
                          <div className="px-3 py-2 rounded-xl bg-red-500 text-white flex items-center gap-2 animate-pulse shadow-lg shadow-red-500/20">
                            <AlertCircle size={14} />
                            <span className="text-[10px] font-black uppercase tracking-wider">Overdue</span>
                          </div>
                       )}
                       {!isOverdue && daysLeft !== null && goal.status !== 'completed' && (
                          <div className="px-3 py-2 rounded-xl bg-action/5 border border-action/10 text-action flex items-center gap-2">
                            <Clock size={14} />
                            <span className="text-[10px] font-black uppercase">{daysLeft} Days Left</span>
                          </div>
                       )}
                    </div>
                  </div>
               </div>
            </div>
          );
        })}
        
        {goals.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white dark:bg-dark-surface rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-action/5 via-transparent to-transparent" />
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 bg-action/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Target className="text-action" size={48} />
                  </div>
                  <h3 className="text-3xl font-heading font-black text-primary dark:text-dark-primary mb-3">Your Journey Awaits</h3>
                  <p className="text-secondary dark:text-dark-secondary max-w-sm mx-auto mb-10 font-medium font-bold opacity-80">Every great achievement began as a simple goal. What's your first destination?</p>
                  <button onClick={() => handleOpenModal()} className="px-12 py-5 bg-action text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] shadow-action/30">
                    Set Your First Goal
                  </button>
                </div>
            </div>
        )}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 backdrop-blur-xl bg-white/40 dark:bg-black/60 animate-in fade-in duration-300">
          <div 
            className="bg-white dark:bg-dark-surface w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-action/10 rounded-2xl flex items-center justify-center shadow-inner">
                  {editingId ? <Edit2 className="text-action" size={28} /> : <Target className="text-action" size={28} />}
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-black text-primary dark:text-dark-primary">
                    {editingId ? 'Refine your Vision' : 'Chart New Territory'}
                  </h2>
                  <p className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest opacity-60">
                    {editingId ? 'Optimization Phase' : 'Set a new strategic horizon'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl text-secondary hover:text-primary dark:hover:text-dark-primary transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex-1 overflow-y-auto custom-scrollbar modal-scroll p-8 pt-4 space-y-10 safe-bottom">
              {!editingId && (
                <div className="bg-surface dark:bg-dark-background/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={16} className="text-orange-400" />
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Quick Launch Templates</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { title: 'Run a 5K', cat: 'Health', sub: ['Buy running shoes', 'Week 1: 1km runs', 'Race day registration'] },
                      { title: 'Read 12 Books', cat: 'Personal', sub: ['Select book list', 'Read 20 mins/day', 'Join a book club'] },
                      { title: 'Learn React', cat: 'Career', sub: ['JS Fundamentals', 'React Hooks', 'Build a project'] },
                      { title: 'Emergency Fund', cat: 'Finance', sub: ['Open savings', 'Reach $1000 goal', 'Maintain habit'] }
                    ].map(template => (
                      <button 
                        key={template.title}
                        type="button"
                        onClick={() => setNewGoal({
                          ...newGoal,
                          title: template.title,
                          category: template.cat,
                          subGoals: template.sub.map(s => ({ title: s, completed: false }))
                        })}
                        className="p-3 text-left bg-white dark:bg-gray-800 hover:border-action hover:shadow-lg rounded-2xl transition-all border border-transparent group/t"
                      >
                        <p className="text-[10px] font-black text-secondary mb-1 group-hover/t:text-action">{template.cat}</p>
                        <p className="text-xs font-black text-primary dark:text-dark-primary">{template.title}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Goal Designation</label>
                    <div className="relative group">
                      <Target className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-action transition-colors" size={20} />
                      <input 
                        type="text" 
                        required
                        className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pl-14 pr-6 py-5 text-primary dark:text-dark-primary font-bold focus:ring-0 focus:border-action focus:bg-white dark:focus:bg-dark-surface transition-all outline-none"
                        placeholder="e.g. Master Full-Stack Development"
                        value={newGoal.title}
                        onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Category</label>
                    <div className="relative group">
                      <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-action transition-colors" size={20} />
                      <select 
                        className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pl-14 pr-6 py-5 text-primary dark:text-dark-primary font-bold focus:ring-0 focus:border-action focus:bg-white dark:focus:bg-dark-surface transition-all outline-none appearance-none"
                        value={newGoal.category}
                        onChange={e => setNewGoal({...newGoal, category: e.target.value})}
                      >
                        <option value="General">General</option>
                        <option value="Health">Health & Fitness</option>
                        <option value="Career">Career & Skill</option>
                        <option value="Finance">Finance</option>
                        <option value="Personal">Personal Growth</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Target Deadline</label>
                    <div className="relative group">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-action transition-colors" size={20} />
                      <input 
                        type="date" 
                        className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pl-14 pr-6 py-5 text-primary dark:text-dark-primary font-bold focus:ring-0 focus:border-action focus:bg-white dark:focus:bg-dark-surface transition-all outline-none"
                        value={newGoal.targetDate}
                        onChange={e => setNewGoal({...newGoal, targetDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Strategy & Vision</label>
                    <textarea 
                      rows={1}
                      className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 py-5 text-primary dark:text-dark-primary font-medium focus:ring-0 focus:border-action focus:bg-white dark:focus:bg-dark-surface transition-all outline-none resize-none"
                      placeholder="High-level plan or motivation..."
                      value={newGoal.description}
                      onChange={e => setNewGoal({...newGoal, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-secondary" />
                    <label className="text-sm font-black text-primary dark:text-white uppercase tracking-widest">Tactical Steps (Milestones)</label>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setNewGoal({...newGoal, subGoals: [...newGoal.subGoals, { title: '', completed: false }]})}
                    className="flex items-center gap-2 px-4 py-2 bg-action/10 text-action rounded-xl text-xs font-black uppercase tracking-widest hover:bg-action hover:text-white transition-all shadow-sm"
                  >
                    <Plus size={14} /> Add Step
                  </button>
                </div>
                
                <div className="space-y-3">
                  {newGoal.subGoals.map((sg, idx) => (
                    <div key={idx} className="flex gap-3 animate-in slide-in-from-left-4 duration-300">
                      <div className="flex-1 relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-[10px] font-black text-secondary group-focus-within:border-action group-focus-within:text-action transition-all">
                          {idx + 1}
                        </div>
                        <input 
                          type="text"
                          className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pl-14 pr-6 py-4 text-sm font-bold text-primary dark:text-dark-primary placeholder:font-medium focus:ring-0 focus:border-action focus:bg-white dark:focus:bg-dark-surface transition-all outline-none"
                          placeholder="Actionable move..."
                          value={sg.title}
                          onChange={e => {
                            const updated = [...newGoal.subGoals];
                            updated[idx].title = e.target.value;
                            setNewGoal({...newGoal, subGoals: updated});
                          }}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const updated = newGoal.subGoals.filter((_, i) => i !== idx);
                          setNewGoal({...newGoal, subGoals: updated});
                        }}
                        className="p-4 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 dark:border-gray-800/50 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 px-1">
                       <Users size={16} className="text-secondary" />
                       <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Collaborators</label>
                     </div>
                     
                     {/* Existing Collaborators List */}
                     {(newGoal.collaboratorsText || '').length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(newGoal.collaboratorsText || '').split(', ').map((c, i) => (
                             <div key={i} className="px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                               <Users size={12} />
                               {c}
                             </div>
                          ))}
                        </div>
                     )}

                     {/* Invite Interface - Only for existing goals */}
                     {editingId ? (
                       <div className="relative z-50">
                          <div className="relative">
                            <input 
                              type="text"
                              className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 text-xs font-bold text-primary dark:text-dark-primary focus:ring-0 focus:border-action transition-all outline-none"
                              placeholder="Search username to invite..."
                              value={userSearch}
                              onChange={e => setUserSearch(e.target.value)}
                            />
                            {searching && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Loader2 className="animate-spin text-secondary" size={16} />
                              </div>
                            )}
                          </div>

                          {/* Search Results Dropdown */}
                          {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                               {searchResults.map(user => (
                                 <button
                                   key={user._id}
                                   type="button"
                                   onClick={() => handleInvite(user.username)}
                                   disabled={inviting}
                                   className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all text-left group"
                                 >
                                    <div className="w-8 h-8 rounded-full bg-surface dark:bg-gray-700 overflow-hidden">
                                       <img src={user.profile?.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`} alt={user.username} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-xs font-black text-primary dark:text-dark-primary group-hover:text-action transition-colors">@{user.username}</p>
                                      {user.profile?.bio && <p className="text-[10px] text-secondary truncate max-w-[180px]">{user.profile.bio}</p>}
                                    </div>
                                    <div className="px-3 py-1 bg-action/10 text-action rounded-lg text-[10px] font-bold uppercase">Invite</div>
                                 </button>
                               ))}
                            </div>
                          )}
                       </div>
                     ) : (
                       <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                          <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Create goal to enable collaboration</p>
                       </div>
                     )}
                  </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <LinkIcon size={16} className="text-secondary" />
                      <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Resource Links</label>
                    </div>
                    <input 
                      type="text"
                      className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 text-xs font-bold text-primary dark:text-dark-primary focus:ring-0 focus:border-action transition-all outline-none"
                      placeholder="URLs..."
                      value={newGoal.attachmentsText || ''}
                      onChange={e => setNewGoal({...newGoal, attachmentsText: e.target.value})}
                    />
                 </div>
              </div>

               <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <ArrowRight size={16} className="text-secondary" />
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Prerequisites</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {goals.filter(g => g._id !== editingId).map(g => (
                    <button
                      key={g._id}
                      type="button"
                      onClick={() => {
                        const deps = newGoal.dependencies || [];
                        if (deps.includes(g._id)) {
                          setNewGoal({...newGoal, dependencies: deps.filter(id => id !== g._id)});
                        } else {
                          setNewGoal({...newGoal, dependencies: [...deps, g._id]});
                        }
                      }}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                        (newGoal.dependencies || []).includes(g._id)
                          ? 'bg-action text-white border-action shadow-lg'
                          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-secondary'
                      }`}
                    >
                      {g.title}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-gray-50 dark:border-gray-800/50 flex flex-col sm:flex-row gap-4">
              <button 
                type="button" 
                onClick={handleCreate}
                className="flex-1 flex items-center justify-center gap-3 py-5 bg-action text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all hover:shadow-xl shadow-action/30 active:scale-95"
              >
                <Save size={18} />
                {editingId ? 'Update Strategy' : 'Initialize Mission'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="px-10 py-5 bg-gray-50 dark:bg-gray-800 text-primary dark:text-dark-primary rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-100 transition-all border border-gray-200 dark:border-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
