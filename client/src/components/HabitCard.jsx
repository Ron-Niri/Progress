import { Check, Flame, MessageSquare, MoreVertical, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function HabitCard({ habit, onCheck, onDelete, onAddNote }) {
  const isCompletedToday = habit.completedDates?.some(date => {
    const today = new Date();
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
  });

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-gray-700 shadow-soft dark:shadow-soft-dark transition-all hover:scale-[1.01] flex items-center justify-between group`}>
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm"
          style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
        >
          {habit.icon || '✓'}
        </div>
        
        <div className="space-y-0.5">
          <h4 className="font-heading font-semibold text-primary dark:text-dark-primary">{habit.title}</h4>
          <div className="flex items-center gap-3 text-xs text-secondary dark:text-dark-secondary">
             <span className="flex items-center gap-1 font-medium">
               <Flame size={14} className={habit.streak > 0 ? 'text-accent fill-accent' : ''} />
               {habit.streak} day streak
             </span>
             {habit.notes?.length > 0 && (
               <span className="flex items-center gap-1">
                 <MessageSquare size={12} /> {habit.notes.length} notes
               </span>
             )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onCheck(habit._id)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isCompletedToday 
              ? 'bg-accent text-white shadow-lg' 
              : 'bg-surface dark:bg-gray-700 text-secondary dark:text-dark-secondary hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Check size={20} strokeWidth={3} />
        </button>
        
        {onDelete && (
          <button 
            onClick={() => onDelete(habit._id)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-secondary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
