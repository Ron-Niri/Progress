import { useState, useEffect } from 'react';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Target, CheckCircle, BookOpen } from 'lucide-react';

export default function Analytics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/stats');
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading analytics...</div>;
    if (!stats) return <div>No data available</div>;

    const statCards = [
        {
            title: 'Total Habits',
            value: stats.habits.total,
            icon: CheckCircle,
            color: 'text-action',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Active Streaks',
            value: stats.habits.activeStreaks,
            icon: TrendingUp,
            color: 'text-accent',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Goals Completed',
            value: stats.goals.completed,
            icon: Target,
            color: 'text-primary',
            bgColor: 'bg-slate-50'
        },
        {
            title: 'Journal Entries',
            value: stats.journal.totalEntries,
            icon: BookOpen,
            color: 'text-secondary',
            bgColor: 'bg-gray-50'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-heading font-semibold text-primary">Analytics</h2>
                <p className="text-secondary">Visualize your consistency and growth.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="p-6 bg-white rounded-lg border border-gray-100 shadow-soft">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-secondary mb-1">{stat.title}</p>
                                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-soft">
                    <h3 className="text-lg font-medium mb-4">Weekly Habit Completion</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.weeklyData}>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#94A3B8" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#94A3B8" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    domain={[0, 100]}
                                />
                                <Tooltip 
                                    cursor={{fill: '#F1F1EF'}}
                                    contentStyle={{ 
                                        borderRadius: '8px', 
                                        border: 'none', 
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                                    }}
                                    formatter={(value) => [`${value}%`, 'Completion']}
                                />
                                <Bar dataKey="completion" fill="#1E293B" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-soft">
                    <h3 className="text-lg font-medium mb-4">Completion Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.weeklyData}>
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#94A3B8" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#94A3B8" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    domain={[0, 100]}
                                />
                                <Tooltip 
                                    cursor={{stroke: '#E5E7EB'}}
                                    contentStyle={{ 
                                        borderRadius: '8px', 
                                        border: 'none', 
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                                    }}
                                    formatter={(value) => [`${value}%`, 'Completion']}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="completion" 
                                    stroke="#3B82F6" 
                                    strokeWidth={2}
                                    dot={{ fill: '#3B82F6', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-soft">
                    <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-surface rounded-md">
                            <span className="text-secondary">Overall Completion Rate</span>
                            <span className="font-bold text-primary">{stats.habits.completionRate}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-surface rounded-md">
                            <span className="text-secondary">Longest Streak</span>
                            <span className="font-bold text-accent">{stats.habits.longestStreak} Days</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-surface rounded-md">
                            <span className="text-secondary">Goals In Progress</span>
                            <span className="font-bold text-action">{stats.goals.inProgress}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-primary to-slate-900 rounded-lg shadow-soft text-white">
                    <h3 className="text-lg font-semibold mb-3">Insights</h3>
                    <div className="space-y-3 text-sm">
                        {stats.habits.completionRate >= 80 && (
                            <p className="flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Excellent consistency! You're maintaining an {stats.habits.completionRate}% completion rate.</span>
                            </p>
                        )}
                        {stats.habits.longestStreak >= 7 && (
                            <p className="flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                <span>You've built a {stats.habits.longestStreak}-day streak. Keep the momentum!</span>
                            </p>
                        )}
                        {stats.goals.inProgress > 0 && (
                            <p className="flex items-start gap-2">
                                <span className="text-blue-400">→</span>
                                <span>You have {stats.goals.inProgress} goal{stats.goals.inProgress > 1 ? 's' : ''} in progress. Stay focused!</span>
                            </p>
                        )}
                        {stats.journal.totalEntries === 0 && (
                            <p className="flex items-start gap-2">
                                <span className="text-yellow-400">!</span>
                                <span>Start journaling to enhance self-awareness and track your thoughts.</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
