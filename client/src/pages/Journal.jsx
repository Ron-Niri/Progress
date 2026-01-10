import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ content: '', mood: 'neutral', tags: '' });

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
      const tagsArray = newEntry.tags.split(',').map(tag => tag.trim()).filter(t => t);
      await api.post('/journal', { ...newEntry, tags: tagsArray });
      setNewEntry({ content: '', mood: 'neutral', tags: '' });
      setShowForm(false);
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-heading font-semibold text-primary">Daily Reflection</h2>
           <p className="text-secondary">Clear your mind. Document the journey.</p>
        </div>
        <button 
           onClick={() => setShowForm(!showForm)}
           className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> New Entry
        </button>
      </div>

      {showForm && (
          <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-soft">
            <h3 className="text-lg font-medium mb-4">Write an entry</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <textarea 
                  required
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-action focus:ring-action sm:text-sm py-2 px-3 border resize-none"
                  placeholder="What's on your mind today?"
                  value={newEntry.content}
                  onChange={e => setNewEntry({...newEntry, content: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-primary mb-1">Mood</label>
                    <select 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-action focus:ring-action sm:text-sm py-2 px-3 border"
                        value={newEntry.mood}
                        onChange={e => setNewEntry({...newEntry, mood: e.target.value})}
                    >
                        <option value="great">Great 🤩</option>
                        <option value="good">Good 😊</option>
                        <option value="neutral">Neutral 😐</option>
                        <option value="bad">Bad 😔</option>
                        <option value="terrible">Terrible 😫</option>
                    </select>
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-primary mb-1">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-action focus:ring-action sm:text-sm py-2 px-3 border"
                      placeholder="work, idea, family"
                      value={newEntry.tags}
                      onChange={e => setNewEntry({...newEntry, tags: e.target.value})}
                    />
                 </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 bg-action text-white rounded-md text-sm font-medium">Save Entry</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-surface text-primary rounded-md text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        )}

      <div className="space-y-4">
          {entries.map(entry => (
              <div key={entry._id} className="p-6 bg-white rounded-lg border border-gray-100 shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                          <span className="text-2xl" title={entry.mood}>{getMoodEmoji(entry.mood)}</span>
                          <span className="text-sm font-semibold text-secondary">{format(new Date(entry.createdAt), 'MMMM d, yyyy h:mm a')}</span>
                      </div>
                      <div className="flex gap-2">
                          {entry.tags.map(tag => (
                              <span key={tag} className="text-xs bg-surface px-2 py-1 rounded text-secondary">#{tag}</span>
                          ))}
                      </div>
                  </div>
                  <p className="text-primary whitespace-pre-line">{entry.content}</p>
              </div>
          ))}
          {entries.length === 0 && !loading && (
            <div className="text-center py-10 text-secondary">
                Your journal is empty. What are you thinking about?
            </div>
        )}
      </div>

    </div>
  );
}
