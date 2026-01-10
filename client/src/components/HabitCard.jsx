import { Check } from 'lucide-react';

export default function HabitCard({ habit, onCheck }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-soft hover:shadow-md transition-shadow">
      <div className="flex-1">
        <h3 className="text-lg font-medium text-primary">{habit.title}</h3>
        {habit.description && <p className="text-sm text-secondary mt-1">{habit.description}</p>}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs font-semibold px-2 py-1 bg-surface rounded text-secondary">
            Streak: {habit.streak} days
          </span>
          <span className="text-xs px-2 py-1 bg-surface rounded text-secondary capitalize">
            {habit.frequency}
          </span>
        </div>
      </div>
      
      <button 
        onClick={() => onCheck(habit._id)}
        className="ml-4 h-10 w-10 flex items-center justify-center rounded-full border-2 border-slate-200 text-slate-300 hover:border-accent hover:text-accent transition-all focus:outline-none active:scale-95"
        title="Mark as done for today"
      >
        <Check size={20} strokeWidth={3} />
      </button>
    </div>
  );
}
