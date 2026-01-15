import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Sparkles, X, Plus, Search, Layers, Zap, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 lg:p-10 backdrop-blur-2xl bg-white/40 dark:bg-black/60 animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-dark-surface w-full max-w-3xl rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-500"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center shadow-inner text-accent">
              <Sparkles size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-black text-primary dark:text-dark-primary">
                Expert Blueprints
              </h2>
              <p className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest opacity-60">
                Kickstart your momentum with proven rituals
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl text-secondary hover:text-primary transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="px-8 py-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search rituals or categories..."
              className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-accent focus:bg-white dark:focus:bg-dark-surface rounded-[1.5rem] outline-none transition-all text-primary dark:text-dark-primary font-bold text-sm shadow-inner"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-4 grid sm:grid-cols-2 gap-4">
          {loading ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
                <p className="text-xs font-black uppercase tracking-widest text-secondary animate-pulse">Syncing Library...</p>
             </div>
          ) : filteredTemplates.length === 0 ? (
             <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-secondary/30">
                  <Search size={32} />
                </div>
                <p className="text-sm font-bold text-secondary italic">No blueprints found for "{search}"</p>
             </div>
          ) : (
            filteredTemplates.map((template, i) => (
              <button
                key={template._id}
                onClick={() => onSelect(template._id)}
                className="flex items-start gap-4 p-5 text-left bg-white dark:bg-dark-surface border border-gray-100 dark:border-gray-800 rounded-[2rem] hover:ring-2 hover:ring-accent hover:shadow-2xl hover:shadow-accent/5 transition-all group animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${template.color}15`, color: template.color }}
                >
                  {template.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-secondary opacity-60 mb-1 block">{template.category}</span>
                  <h4 className="font-heading font-black text-primary dark:text-dark-primary truncate group-hover:text-accent transition-colors">{template.title}</h4>
                  <p className="text-xs text-secondary dark:text-dark-secondary line-clamp-2 mt-1 font-medium leading-tight">{template.description}</p>
                </div>
                <div className="self-center bg-gray-50 dark:bg-gray-800 p-2 rounded-xl text-secondary group-hover:bg-accent group-hover:text-white transition-all">
                  <Plus size={16} />
                </div>
              </button>
            ))
          )}
        </div>
        
        <div className="p-8 bg-gray-50 dark:bg-dark-background/50 border-t border-gray-100 dark:border-gray-800 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-accent" />
            <p className="text-xs font-bold text-secondary uppercase tracking-widest">Architect of your own path?</p>
          </div>
          <button 
            onClick={() => onSelect(null)}
            className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 text-primary dark:text-dark-primary rounded-xl font-black uppercase tracking-widest text-[10px] border border-gray-200 dark:border-gray-700 hover:border-accent hover:text-accent transition-all shadow-sm"
          >
            Create from Scratch <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
