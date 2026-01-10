import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
      await api.post('/goals', newGoal);
      setNewGoal({ title: '', description: '', targetDate: '' });
      setShowForm(false);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
     if(!window.confirm('Are you sure you want to delete this goal?')) return;
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-heading font-semibold text-primary">Goals & Milestones</h2>
           <p className="text-secondary">Track your long-term ambitions.</p>
        </div>
        <button 
           onClick={() => setShowForm(!showForm)}
           className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium flex items-center gap-2"
        >
          <Plus size={16} /> New Goal
        </button>
      </div>

       {showForm && (
          <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-soft">
            <h3 className="text-lg font-medium mb-4">Set a new goal</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-action focus:ring-action sm:text-sm py-2 px-3 border"
                  value={newGoal.title}
                  onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-primary mb-1">Target Date</label>
                    <input 
                      type="date" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-action focus:ring-action sm:text-sm py-2 px-3 border"
                      value={newGoal.targetDate}
                      onChange={e => setNewGoal({...newGoal, targetDate: e.target.value})}
                    />
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-primary mb-1">Description</label>
                    <input 
                      type="text" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-action focus:ring-action sm:text-sm py-2 px-3 border"
                      value={newGoal.description}
                      onChange={e => setNewGoal({...newGoal, description: e.target.value})}
                    />
                 </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 bg-action text-white rounded-md text-sm font-medium">Save Goal</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-surface text-primary rounded-md text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map(goal => (
          <div key={goal._id} className={`p-6 bg-white rounded-lg border shadow-soft flex flex-col justify-between ${goal.status === 'completed' ? 'border-accent/30 bg-accent/5' : 'border-gray-100'}`}>
             <div>
                <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-medium text-lg ${goal.status === 'completed' ? 'text-accent line-through' : 'text-primary'}`}>{goal.title}</h3>
                    <button onClick={() => handleDelete(goal._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
                {goal.description && <p className="text-secondary text-sm mb-4">{goal.description}</p>}
                {goal.targetDate && <p className="text-xs text-secondary bg-surface inline-block px-2 py-1 rounded">Target: {new Date(goal.targetDate).toLocaleDateString()}</p>}
             </div>
             
             <div className="mt-6 flex items-center justify-between">
                <div className="w-full mr-4 bg-gray-100 rounded-full h-2">
                    <div className="bg-action h-2 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                </div>
                <button onClick={() => toggleStatus(goal)} className={goal.status === 'completed' ? 'text-accent' : 'text-secondary hover:text-action'}>
                    {goal.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
             </div>
          </div>
        ))}
        {goals.length === 0 && !loading && (
            <div className="col-span-full text-center py-10 text-secondary">
                No goals set yet. Start aiming high!
            </div>
        )}
      </div>
    </div>
  );
}
