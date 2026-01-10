import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics() {
    // Placeholder data - in a real app, this would come from the backend aggregation
    const data = [
      { name: 'Mon', completion: 40 },
      { name: 'Tue', completion: 70 },
      { name: 'Wed', completion: 50 },
      { name: 'Thu', completion: 90 },
      { name: 'Fri', completion: 60 },
      { name: 'Sat', completion: 80 },
      { name: 'Sun', completion: 30 },
    ];

  return (
    <div className="space-y-6">
        <div>
           <h2 className="text-2xl font-heading font-semibold text-primary">Analytics</h2>
           <p className="text-secondary">Visualize your consistency.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-soft">
                <h3 className="text-lg font-medium mb-4">Weekly Habit Completion</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                cursor={{fill: '#F1F1EF'}}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="completion" fill="#1E293B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-soft">
                <h3 className="text-lg font-medium mb-4">Summary Stats</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-surface rounded-md">
                        <span className="text-secondary">Total Habits Tracked</span>
                        <span className="font-bold text-primary">12</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-surface rounded-md">
                        <span className="text-secondary">Best Streak</span>
                        <span className="font-bold text-accent">14 Days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-surface rounded-md">
                        <span className="text-secondary">Journal Entries</span>
                        <span className="font-bold text-primary">45</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-surface rounded-md">
                        <span className="text-secondary">Goals Completed</span>
                        <span className="font-bold text-action">3</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
