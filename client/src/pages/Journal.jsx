import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Plus, Trash2, Edit2, X, Check, BookOpen, Search, 
  Info, Save, Hash, Calendar, Layers, Smile, Heart, 
  Frown, Sliders, ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { refreshUser, user } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [newEntry, setNewEntry] = useState({ content: '', mood: 'neutral', tags: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      if (entries.length === 0) setLoading(true);
      const res = await api.get('/journal');
      setEntries(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenModal = (entry = null) => {
    if (entry) {
      setEditingId(entry._id);
      setNewEntry({
        content: entry.content,
        mood: entry.mood,
        tags: (entry.tags || []).join(', ')
      });
    } else {
      setEditingId(null);
      setNewEntry({ content: '', mood: 'neutral', tags: '' });
    }
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    try {
      const tagsArray = typeof newEntry.tags === 'string' 
        ? newEntry.tags.split(',').map(tag => tag.trim()).filter(t => t)
        : newEntry.tags;

      if (editingId) {
        await api.put(`/journal/${editingId}`, { ...newEntry, tags: tagsArray });
      } else {
        const res = await api.post('/journal', { ...newEntry, tags: tagsArray });
        if (res.data.gamification) refreshUser();
      }
      
      setShowModal(false);
      setEditingId(null);
      setNewEntry({ content: '', mood: 'neutral', tags: '' });
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this memory? This action cannot be undone.')) return;
    try {
      await api.delete(`/journal/${id}`);
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  const moods = [
    { id: 'terrible', label: 'Tough', emoji: '😫', color: 'text-red-500', bg: 'bg-red-500/10' },
    { id: 'bad', label: 'Down', emoji: '😔', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'neutral', label: 'Okay', emoji: '😐', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'good', label: 'Fine', emoji: '😊', color: 'text-green-500', bg: 'bg-green-500/10' },
    { id: 'great', label: 'Peak', emoji: '🤩', color: 'text-purple-500', bg: 'bg-purple-500/10' }
  ];

  const getMoodEmoji = (moodId) => moods.find(m => m.id === moodId)?.emoji || '😐';
  const getMoodColorClass = (moodId) => {
    const map = {
      'great': 'bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 border-purple-100 dark:border-purple-500/20 shadow-purple-500/5',
      'good': 'bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 border-green-100 dark:border-green-500/20 shadow-green-500/5',
      'neutral': 'bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 border-blue-100 dark:border-blue-500/20 shadow-blue-500/5',
      'bad': 'bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/10 border-orange-100 dark:border-orange-500/20 shadow-orange-500/5',
      'terrible': 'bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 border-red-100 dark:border-red-500/20 shadow-red-500/5'
    };
    return map[moodId] || 'bg-white dark:bg-dark-surface border-gray-100 dark:border-gray-800 shadow-soft';
  };

  const filteredEntries = entries.filter(entry => 
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (entry.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading && entries.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-purple-500 rounded-full animate-spin"></div>
        <BookOpen className="absolute inset-0 m-auto text-purple-500 animate-pulse" size={24} />
      </div>
      <p className="text-secondary dark:text-dark-secondary font-heading font-bold text-lg animate-pulse">Recalling your reflections...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BookOpen className="text-purple-500" size={24} />
            </div>
            <span className="text-purple-500 font-black uppercase tracking-[0.2em] text-[10px]">Cognitive Archive</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-primary dark:text-dark-primary tracking-tight">
            Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Reflections</span>
          </h1>
          <p className="text-secondary dark:text-dark-secondary max-w-xl font-medium">
            Clear your mind, document the evolution, and maintain clarity through the storm of achievement.
          </p>
        </div>
        
        <button 
           onClick={() => handleOpenModal()}
           className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-primary dark:bg-action text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.3)] hover:-translate-y-0.5"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          Capture Thought
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Entries', value: entries.length, color: 'text-purple-500', bg: 'bg-purple-500/5 border-purple-500/10' },
          { label: 'Current Mood', value: entries.length > 0 ? getMoodEmoji(entries[0].mood) : '—', color: 'text-action', bg: 'bg-action/5 border-action/10' },
          { label: 'Mindful Tags', value: [...new Set(entries.flatMap(e => e.tags || []))].length, color: 'text-accent', bg: 'bg-accent/5 border-accent/10' },
          { label: 'Reflective Days', value: [...new Set(entries.map(e => new Date(e.createdAt).toDateString()))].length, color: 'text-orange-500', bg: 'bg-orange-500/5 border-orange-500/10' }
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-[1.5rem] border backdrop-blur-sm ${stat.bg}`}>
            <p className="text-[10px] uppercase tracking-widest font-black text-secondary mb-1 opacity-70">{stat.label}</p>
            <p className={`text-2xl font-heading font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-purple-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search your memories or tags..."
            className="w-full pl-16 pr-8 py-5 bg-white dark:bg-dark-surface rounded-[1.5rem] border border-gray-100 dark:border-gray-800 text-primary dark:text-dark-primary font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none shadow-soft"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Entries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEntries.map(entry => (
          <div 
            key={entry._id} 
            className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden flex flex-col ${getMoodColorClass(entry.mood)}`}
          >
             <BookOpen size={160} className="absolute -right-10 -bottom-10 text-primary dark:text-white opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000" />

             <div className="relative z-10 space-y-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {getMoodEmoji(entry.mood)}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-secondary dark:text-dark-secondary uppercase tracking-widest">{format(new Date(entry.createdAt), 'EEEE')}</p>
                        <p className="text-xs font-black text-primary dark:text-dark-primary">{format(new Date(entry.createdAt), 'MMM d, yyyy')}</p>
                      </div>
                   </div>
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => handleOpenModal(entry)} className="p-2.5 text-secondary hover:text-purple-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(entry._id)} className="p-2.5 text-secondary hover:text-red-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100"><Trash2 size={16} /></button>
                   </div>
                </div>

                <p className="text-primary dark:text-dark-primary text-base font-medium leading-relaxed flex-1 line-clamp-6">
                   {entry.content}
                </p>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100/50 dark:border-gray-800/50">
                    {(entry.tags || []).map(tag => (
                        <span key={tag} className="text-[9px] font-black uppercase tracking-wider bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg text-secondary border border-gray-100/30">
                          #{tag}
                        </span>
                    ))}
                    {(entry.tags || []).length === 0 && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-secondary/30 italic">No Tags</span>
                    )}
                </div>
             </div>
          </div>
        ))}

        {filteredEntries.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white dark:bg-dark-surface rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent" />
            <div className="relative z-10 text-center px-4">
              <div className="w-24 h-24 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <BookOpen className="text-purple-500" size={48} />
              </div>
              <h3 className="text-3xl font-heading font-black text-primary dark:text-dark-primary mb-3">Silent Reflection</h3>
              <p className="text-secondary dark:text-dark-secondary max-w-sm mx-auto mb-10 font-bold opacity-80">
                The mind is a vessel. If you don't empty it on paper, it will overflow into your performance.
              </p>
              <button 
                onClick={() => handleOpenModal()} 
                className="px-12 py-5 bg-primary dark:bg-purple-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-105 shadow-xl shadow-purple-500/20"
              >
                Begin Your Journal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Journal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 backdrop-blur-xl bg-white/40 dark:bg-black/60 animate-in fade-in duration-300">
          <div 
            className="bg-white dark:bg-dark-surface w-full max-w-3xl rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
             <div className="p-8 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center shadow-inner text-purple-500">
                  {editingId ? <Edit2 size={28} /> : <BookOpen size={28} />}
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-black text-primary dark:text-dark-primary">
                    {editingId ? 'Refine Memory' : 'Secure Reflection'}
                  </h2>
                  <p className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest opacity-60">
                    {editingId ? 'Deepening the analysis' : 'Capture the raw signal'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl text-secondary hover:text-primary transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-8 pt-4 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Stream of Consciousness</label>
                     <textarea 
                        required
                        rows={8}
                        className="w-full rounded-[2rem] border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-8 py-7 text-primary dark:text-dark-primary font-medium focus:ring-0 focus:border-purple-500 focus:bg-white dark:focus:bg-dark-surface transition-all outline-none resize-none leading-relaxed"
                        placeholder="What's moving through your mind right now?"
                        value={newEntry.content}
                        onChange={e => setNewEntry({...newEntry, content: e.target.value})}
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Vibration Signature</label>
                        <div className="grid grid-cols-5 gap-2">
                           {moods.map(m => (
                              <button
                                 key={m.id}
                                 type="button"
                                 onClick={() => setNewEntry({...newEntry, mood: m.id})}
                                 className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${newEntry.mood === m.id ? 'border-purple-500 bg-purple-500/5 scale-105 shadow-lg' : 'border-transparent bg-gray-50 dark:bg-gray-800/50 opacity-40 hover:opacity-100'}`}
                              >
                                 <span className="text-2xl">{m.emoji}</span>
                                 <span className="text-[8px] font-black uppercase tracking-wider">{m.label}</span>
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-secondary uppercase tracking-widest ml-1">Associative Tags</label>
                        <div className="relative group">
                           <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-purple-500 transition-colors" size={20} />
                           <input 
                              type="text"
                              className="w-full rounded-2xl border-2 border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pl-14 pr-6 py-5 text-xs font-black text-primary dark:text-dark-primary focus:ring-0 focus:border-purple-500 focus:bg-white dark:focus:bg-dark-surface transition-all outline-none"
                              placeholder="mindfulness, success, growth..."
                              value={newEntry.tags}
                              onChange={e => setNewEntry({...newEntry, tags: e.target.value})}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </form>

            <div className="p-8 border-t border-gray-50 dark:border-gray-800/50 flex flex-col sm:flex-row gap-4">
              <button 
                type="button" 
                onClick={handleCreate}
                className="flex-1 flex items-center justify-center gap-3 py-5 bg-primary dark:bg-purple-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:shadow-xl shadow-purple-500/30 active:scale-95"
              >
                <Save size={18} />
                {editingId ? 'Archive Revision' : 'Secure Entry'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="px-10 py-5 bg-gray-50 dark:bg-gray-800 text-primary dark:text-dark-primary rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-100 transition-all border border-gray-200 dark:border-gray-700"
              >
                Discard
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
