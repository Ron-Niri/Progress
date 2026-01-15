import { Check, Flame, MessageSquare, Edit2, Trash2, ArrowRight } from 'lucide-react';

export default function HabitCard({ habit, onCheck, onDelete, onEdit }) {
  const isCompletedToday = habit.completedDates?.some(date => {
    const today = new Date();
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
  });

  return (
    <div className={`group relative p-6 rounded-[2rem] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden
      ${isCompletedToday 
        ? 'bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-dark-surface border-green-100 dark:border-green-500/20 shadow-green-500/5' 
        : 'bg-white dark:bg-dark-surface border-gray-100 dark:border-gray-800 shadow-soft'}`}
    >
      {/* Decorative Blur */}
      <div 
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.05] group-hover:scale-150 transition-transform duration-1000 blur-2xl"
        style={{ backgroundColor: habit.color }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl shadow-lg transition-transform duration-500 group-hover:rotate-6"
            style={{ 
              backgroundColor: `${habit.color}15`, 
              color: habit.color,
              boxShadow: `0 8px 20px -10px ${habit.color}40`
            }}
          >
            {habit.icon || '✓'}
          </div>
          
          <div className="space-y-1">
            <h4 className={`text-lg font-heading font-black tracking-tight transition-all duration-300 ${isCompletedToday ? 'text-accent opacity-50 line-through' : 'text-primary dark:text-dark-primary'}`}>
              {habit.title}
            </h4>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                 <div className={`w-1.5 h-1.5 rounded-full ${habit.streak > 0 ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-70">
                   {habit.streak} day streak
                 </span>
               </div>
               {habit.frequency === 'weekly' && (
                 <span className="text-[10px] font-black text-action uppercase tracking-widest bg-action/5 px-2 py-0.5 rounded-lg border border-action/10">Weekly</span>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            {onEdit && (
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(habit); }}
                className="p-2.5 text-secondary hover:text-action hover:bg-white dark:hover:bg-gray-800 rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all"
              >
                <Edit2 size={16} />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(habit._id); }}
                className="p-2.5 text-secondary hover:text-red-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => onCheck(habit._id)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 active:scale-90
              ${isCompletedToday 
                ? 'bg-accent text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)]' 
                : 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 hover:text-action hover:bg-action/5 hover:border-action/20 border border-transparent'}`}
          >
            <Check size={28} strokeWidth={3} className={isCompletedToday ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
          </button>
        </div>
      </div>

      {habit.description && (
        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800/50 flex items-center justify-between">
          <p className="text-[10px] font-medium text-secondary truncate max-w-[200px] italic">
            "{habit.description}"
          </p>
          <div className="flex -space-x-1">
             {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full border border-white dark:border-dark-surface ${i < (habit.streak % 5) ? 'bg-orange-400' : 'bg-gray-100 dark:bg-gray-800'}`} />
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
