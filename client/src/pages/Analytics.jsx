import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { TrendingUp, Target, CheckCircle, BookOpen, Activity, Zap, Award, Calendar } from 'lucide-react';

export default function Analytics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { darkMode } = useTheme();

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

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-action rounded-full animate-spin"></div>
            <div className="text-secondary dark:text-dark-secondary font-medium animate-pulse">Analyzing your progress...</div>
        </div>
    );

    if (!stats) return (
        <div className="text-center py-20 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft">
            <Activity className="mx-auto text-secondary mb-4 opacity-20" size={64} />
            <p className="text-secondary dark:text-dark-secondary font-medium">No analytics data found yet. Start tracking to see your growth!</p>
        </div>
    );

    const statCards = [
        {
            title: 'Total Habits',
            value: stats.habits.total,
            icon: CheckCircle,
            color: 'text-action',
            bgColor: 'bg-blue-50 dark:bg-blue-900/10'
        },
        {
            title: 'Active Streaks',
            value: stats.habits.activeStreaks,
            icon: Zap,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-900/10'
        },
        {
            title: 'Goals Completed',
            value: stats.goals.completed,
            icon: Target,
            color: 'text-accent',
            bgColor: 'bg-green-50 dark:bg-green-900/10'
        },
        {
            title: 'Journal Entries',
            value: stats.journal.totalEntries,
            icon: BookOpen,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/10'
        }
    ];

    const chartAxisColor = darkMode ? '#94A3B8' : '#64748B';
    const tooltipBg = darkMode ? '#1E293B' : '#FFFFFF';
    const tooltipBorder = darkMode ? '#334155' : '#E2E8F0';

    return (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-heading font-bold text-primary dark:text-dark-primary flex items-center gap-3">
                    <Activity size={32} className="text-action" /> Performance Insights
                </h2>
                <p className="text-secondary dark:text-dark-secondary mt-1">Visualize your consistency and personal evolution.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="p-8 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft dark:shadow-soft-dark hover:scale-[1.02] transition-all group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-widest mb-2 group-hover:text-primary dark:group-hover:text-dark-primary transition-all">{stat.title}</p>
                                <p className="text-4xl font-black text-primary dark:text-dark-primary">{stat.value}</p>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color} shadow-sm`}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-8 md:grid-cols-2">
                <div className="p-8 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft dark:shadow-soft-dark">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-heading font-bold text-primary dark:text-dark-primary flex items-center gap-2">
                            <Calendar size={20} className="text-action" /> Weekly Habit Completion
                        </h3>
                        <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-surface dark:bg-gray-800 px-3 py-1 rounded-full">Last 7 Days</span>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#F1F5F9'} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke={chartAxisColor} 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis 
                                    stroke={chartAxisColor} 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    domain={[0, 100]}
                                    tickFormatter={(val) => `${val}%`}
                                />
                                <Tooltip 
                                    cursor={{fill: darkMode ? '#334155' : '#F8FAFC', radius: 8}}
                                    contentStyle={{ 
                                        backgroundColor: tooltipBg,
                                        borderRadius: '16px', 
                                        border: `1px solid ${tooltipBorder}`, 
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        color: darkMode ? '#F1F5F9' : '#1E293B'
                                    }}
                                    itemStyle={{ color: '#3B82F6', fontWeight: 'bold' }}
                                    formatter={(value) => [`${value}%`, 'Completion Rate']}
                                />
                                <Bar dataKey="completion" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-8 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft dark:shadow-soft-dark">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-heading font-bold text-primary dark:text-dark-primary flex items-center gap-2">
                            <TrendingUp size={20} className="text-accent" /> Completion Trend
                        </h3>
                        <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-surface dark:bg-gray-800 px-3 py-1 rounded-full">Evolution</span>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#F1F5F9'} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke={chartAxisColor} 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    dy={10}
                                />
                                <YAxis 
                                    stroke={chartAxisColor} 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    domain={[0, 100]}
                                    tickFormatter={(val) => `${val}%`}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: tooltipBg,
                                        borderRadius: '16px', 
                                        border: `1px solid ${tooltipBorder}`, 
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        color: darkMode ? '#F1F5F9' : '#1E293B'
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="completion" 
                                    stroke="#10B981" 
                                    strokeWidth={4}
                                    dot={{ fill: '#10B981', r: 6, strokeWidth: 2, stroke: darkMode ? '#1E293B' : '#FFFFFF' }}
                                    activeDot={{ r: 8, strokeWidth: 4, stroke: '#10B981', fill: '#FFFFFF' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-8 md:grid-cols-2 shadow-soft">
                <div className="p-8 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-heading font-bold mb-6 text-primary dark:text-dark-primary flex items-center gap-2 underline decoration-action decoration-4 underline-offset-8">
                        <Award size={20} className="text-accent" /> Achievement Progress
                    </h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Overall Consistency', value: `${stats.habits.completionRate}%`, color: 'text-action', bg: 'bg-blue-500' },
                            { label: 'Current Best Streak', value: `${stats.habits.longestStreak} Days`, color: 'text-orange-500', bg: 'bg-orange-500' },
                            { label: 'Pending Goals', value: stats.goals.inProgress, color: 'text-accent', bg: 'bg-green-500' }
                        ].map((metric, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-secondary dark:text-dark-secondary">{metric.label}</span>
                                    <span className={`text-sm font-black ${metric.color}`}>{metric.value}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className={`${metric.bg} h-full rounded-full transition-all duration-1000`}
                                        style={{ width: typeof metric.value === 'string' && metric.value.includes('%') ? metric.value : '70%' }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-primary via-slate-900 to-black rounded-3xl shadow-2xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:rotate-45 transition-all duration-700">
                      <Zap size={140} />
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2 relative z-10">
                        <Zap size={24} className="text-orange-400" /> Smart Insights
                    </h3>
                    <div className="space-y-6 relative z-10 text-slate-300">
                        {stats.habits.completionRate >= 80 ? (
                            <p className="flex items-start gap-4">
                                <span className="bg-green-500/20 text-green-400 p-1 rounded-lg font-black mt-1 text-xs">A+</span>
                                <span>Elite consistency! You're in the top 5% of productive users with an {stats.habits.completionRate}% completion rate.</span>
                            </p>
                        ) : (
                            <p className="flex items-start gap-4">
                                <span className="bg-orange-500/20 text-orange-400 p-1 rounded-lg font-black mt-1 text-xs">TIP</span>
                                <span>Consistency over intensity. Try to hit an 80% completion rate for significant momentum.</span>
                            </p>
                        )}
                        {stats.habits.longestStreak >= 7 && (
                            <p className="flex items-start gap-4">
                                <span className="bg-blue-500/20 text-blue-400 p-1 rounded-lg font-black mt-1 text-xs">WIN</span>
                                <span>Momentum built! Your {stats.habits.longestStreak}-day streak has rewire your brain's reward system.</span>
                            </p>
                        )}
                        {stats.goals.inProgress > 0 ? (
                            <p className="flex items-start gap-4">
                                <span className="bg-purple-500/20 text-purple-400 p-1 rounded-lg font-black mt-1 text-xs">GOAL</span>
                                <span>You have {stats.goals.inProgress} active mission{stats.goals.inProgress > 1 ? 's' : ''}. Prioritize your deep work blocks today.</span>
                            </p>
                        ) : (
                            <p className="flex items-start gap-4">
                                <span className="bg-slate-500/20 text-slate-400 p-1 rounded-lg font-black mt-1 text-xs">NEW</span>
                                <span>Clear horizons. This is the perfect time to set a new 90-day ambitious goal.</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
