import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Sparkles, X, Plus, Search } from 'lucide-react';

export default function HabitTemplatePicker({ onSelect, onClose }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await api.get('/habits/templates');
      setTemplates(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-dark-surface w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-action">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-heading font-bold text-primary dark:text-dark-primary">Habit Templates</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface dark:hover:bg-gray-700 rounded-full transition-all">
            <X size={20} className="text-secondary" />
          </button>
        </div>

        <div className="p-4 bg-surface/30 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text"
              placeholder="Search templates or categories..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-action transition-all text-primary dark:text-dark-primary text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 grid sm:grid-cols-2 gap-4">
          {loading ? (
             <div className="col-span-full py-12 text-center text-secondary">Loading templates...</div>
          ) : filteredTemplates.length === 0 ? (
             <div className="col-span-full py-12 text-center text-secondary">No templates found for "{search}"</div>
          ) : (
            filteredTemplates.map(template => (
              <button
                key={template._id}
                onClick={() => onSelect(template._id)}
                className="flex items-start gap-4 p-4 text-left border border-gray-100 dark:border-gray-700 rounded-2xl hover:bg-surface dark:hover:bg-gray-700 hover:border-action transition-all group"
              >
                <div 
                  className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xl shadow-sm"
                  style={{ backgroundColor: `${template.color}15`, color: template.color }}
                >
                  {template.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-primary dark:text-dark-primary truncate">{template.title}</h4>
                  <p className="text-xs text-secondary dark:text-dark-secondary line-clamp-1 mt-0.5">{template.description}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] uppercase tracking-wider font-bold text-secondary dark:text-dark-secondary">{template.category}</span>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={16} className="text-action" />
                </div>
              </button>
            ))
          )}
        </div>
        
        <div className="p-6 bg-surface/30 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-sm text-secondary">Can't find what you're looking for?</p>
          <button 
            onClick={() => onSelect(null)}
            className="mt-2 text-action font-semibold hover:underline"
          >
            Create from scratch instead
          </button>
        </div>
      </div>
    </div>
  );
}
