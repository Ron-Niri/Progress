import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Trash2, Edit2, X, Check, BookOpen, Search, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newEntry, setNewEntry] = useState({ content: '', mood: 'neutral', tags: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await api.get('/journal');
      setEntries(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = typeof newEntry.tags === 'string' 
        ? newEntry.tags.split(',').map(tag => tag.trim()).filter(t => t)
        : newEntry.tags;

      if (editingId) {
        await api.put(`/journal/${editingId}`, { ...newEntry, tags: tagsArray });
      } else {
        await api.post('/journal', { ...newEntry, tags: tagsArray });
      }
      
      setNewEntry({ content: '', mood: 'neutral', tags: '' });
      setShowForm(false);
      setEditingId(null);
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (entry) => {
    setNewEntry({
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags.join(', ')
    });
    setEditingId(entry._id);
    setShowForm(true);
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

  const getMoodEmoji = (mood) => {
      const map = {
          'great': '🤩',
          'good': '😊',
          'neutral': '😐',
          'bad': '😔',
          'terrible': '😫'
      };
      return map[mood] || '😐';
  };

  const getMoodColor = (mood) => {
      const map = {
          'great': 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-500/20',
          'good': 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-500/20',
          'neutral': 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-500/20',
          'bad': 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-500/20',
          'terrible': 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-500/20'
      };
      return map[mood] || 'bg-white dark:bg-dark-surface border-gray-100 dark:border-gray-700';
  };

  const filteredEntries = entries.filter(entry => 
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-action rounded-full animate-spin"></div>
      <p className="text-secondary dark:text-dark-secondary font-medium animate-pulse">Reading your thoughts...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl sm:text-4xl font-heading font-black text-primary dark:text-dark-primary flex items-center gap-4">
             <BookOpen className="text-purple-500" size={36} /> Daily Reflection
           </h2>
           <p className="text-secondary dark:text-dark-secondary mt-1 text-sm sm:text-base font-medium opacity-70 leading-relaxed">Clear your mind. Document the journey.</p>
        </div>
        <button 
           onClick={() => {
             setShowForm(!showForm);
             if (showForm) setEditingId(null);
           }}
           className="w-full lg:w-auto px-8 py-4 bg-primary dark:bg-action text-white rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />} 
          {showForm ? 'Close' : 'New Entry'}
        </button>
      </div>

      {showForm && (
          <div className="p-8 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-xl font-heading font-bold mb-6 text-primary dark:text-dark-primary flex items-center gap-2">
              {editingId ? <Edit2 size={20} className="text-action" /> : <Plus size={20} className="text-action" />}
              {editingId ? 'Edit your reflection' : 'What\'s on your mind?'}
            </h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <textarea 
                  required
                  rows={4}
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-5 py-4 text-primary dark:text-dark-primary focus:ring-2 focus:ring-action transition-all outline-none resize-none shadow-sm placeholder:opacity-30"
                  placeholder="Capture your thoughts, ideas, or feelings..."
                  value={newEntry.content}
                  onChange={e => setNewEntry({...newEntry, content: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <label className="block text-[10px] font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] mb-4">Current Vibrations</label>
                    <div className="grid grid-cols-5 gap-3">
                      {['terrible', 'bad', 'neutral', 'good', 'great'].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setNewEntry({...newEntry, mood: m})}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${newEntry.mood === m ? 'border-action bg-action/5 bg-white dark:bg-gray-800 scale-110 shadow-lg' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 opacity-50 hover:opacity-100'}`}
                        >
                          <span className="text-2xl">{getMoodEmoji(m)}</span>
                        </button>
                      ))}
                    </div>
                 </div>
                 <div>
                     <label className="block text-[10px] font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] mb-4">Categorize</label>
                    <input 
                      type="text" 
                      className="w-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-surface/50 dark:bg-dark-background px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-action/10 focus:border-action transition-all outline-none text-primary dark:text-dark-primary shadow-sm"
                      placeholder="e.g. mindfulness, growth"
                      value={newEntry.tags}
                      onChange={e => setNewEntry({...newEntry, tags: e.target.value})}
                    />
                 </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="submit" className="px-10 py-3 bg-action text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2">
                  <Check size={18} /> {editingId ? 'Update Entry' : 'Save Entry'}
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

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-30" size={20} />
        <input 
          type="text"
          placeholder="Search your memories..."
          className="w-full pl-12 pr-6 py-4 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 text-primary dark:text-dark-primary focus:ring-2 focus:ring-action outline-none transition-all shadow-soft"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-6">
          {filteredEntries.map(entry => (
              <div key={entry._id} className={`p-8 rounded-3xl border shadow-soft transition-all hover:shadow-lg relative group overflow-hidden ${getMoodColor(entry.mood)}`}>
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <BookOpen size={100} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 xs:w-14 xs:h-14 bg-white dark:bg-gray-900 rounded-2xl shadow-sm flex items-center justify-center text-2xl xs:text-3xl">
                              {getMoodEmoji(entry.mood)}
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-secondary uppercase tracking-[2px]">{format(new Date(entry.createdAt), 'EEEE')}</p>
                              <p className="text-xs xs:text-sm font-bold text-primary dark:text-dark-primary">{format(new Date(entry.createdAt), 'MMMM d, yyyy')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => handleEdit(entry)} className="p-3 bg-white/50 dark:bg-gray-800 text-secondary hover:text-action rounded-xl shadow-sm transition-all active:scale-90">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(entry._id)} className="p-3 bg-white/50 dark:bg-gray-800 text-secondary hover:text-red-500 rounded-xl shadow-sm transition-all active:scale-90">
                              <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-primary dark:text-dark-primary text-lg leading-relaxed whitespace-pre-line mb-6 font-medium">
                      {entry.content}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {entry.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-black uppercase tracking-widest bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg text-secondary dark:text-dark-secondary">
                              #{tag}
                            </span>
                        ))}
                    </div>
                  </div>
              </div>
          ))}
          
          {filteredEntries.length === 0 && !loading && (
            <div className="text-center py-32 bg-surface/30 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 bg-white dark:bg-dark-surface rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                  <BookOpen className="text-secondary opacity-20" size={40} />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary dark:text-dark-primary mb-2">No entries found</h3>
                <p className="text-secondary dark:text-dark-secondary max-w-sm mx-auto">
                   {searchQuery ? "We couldn't find any entries matching that search." : "Your journal is a blank canvas. Capture your first thought today."}
                </p>
            </div>
        )}
      </div>

    </div>
  );
}
