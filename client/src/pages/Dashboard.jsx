import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  Circle, 
  Flame, 
  Trophy, 
  Target, 
  Quote, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  Calendar,
  Sparkles,
  ChevronRight,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import Skeleton from '../components/Skeleton';
import motivationData from '../data/motivation.json';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      if (!data) setLoading(true);
      
      const [statsRes, habitsRes, goalsRes, achievementsRes] = await Promise.all([
        api.get('/stats'),
        api.get('/habits'),
        api.get('/goals'),
        api.get('/achievements')
      ]);
      
      const today = new Date().toDateString();
      const habitsData = Array.isArray(habitsRes.data) ? habitsRes.data : [];
      const statsData = statsRes.data || { habits: { completionRate: 0, activeStreaks: 0, longestStreak: 0 } };
      const goalsData = Array.isArray(goalsRes.data) ? goalsRes.data : [];
      const achievementsData = Array.isArray(achievementsRes.data) ? achievementsRes.data : [];

      const habitsToday = habitsData.map(habit => ({
        ...habit,
        isCompletedToday: Array.isArray(habit.completedDates) && habit.completedDates.some(date => new Date(date).toDateString() === today)
      }));

      setData({
        stats: statsData,
        habits: habitsToday,
        goals: goalsData.filter(g => g.status === 'pending'),
        achievements: achievementsData.slice(0, 3)
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  };

  const [dailyQuote, setDailyQuote] = useState({ text: "Discipline equals freedom.", author: "Jocko Willink" });

  useEffect(() => {
    if (motivationData?.quotes?.length > 0) {
      const quotes = motivationData.quotes;
      const random = quotes[Math.floor(Math.random() * quotes.length)];
      setDailyQuote(random);
    }
  }, []);

  const handleCheckHabit = async (id) => {
    try {
      await api.put(`/habits/${id}/check`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const statsList = [
    { label: 'Today\'s Score', value: data?.stats?.habits?.completionRate != null ? `${data.stats.habits.completionRate}%` : '0%', icon: Zap, color: 'text-action', bg: 'bg-blue-50 dark:bg-blue-900/10' },
    { label: 'Current Streak', value: data?.stats?.habits?.activeStreaks != null ? `${data.stats.habits.activeStreaks} Days` : '0 Days', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10' },
    { label: 'Best Streak', value: data?.stats?.habits?.longestStreak != null ? `${data.stats.habits.longestStreak} Days` : '0 Days', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
    { label: 'Active Goals', value: data?.goals?.length || 0, icon: Target, color: 'text-accent', bg: 'bg-green-50 dark:bg-green-900/10' },
  ];

  return (
    <div className="space-y-6 sm:space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Quote */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 bg-action/10 text-action text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full">Evolution</span>
            <span className="text-secondary dark:text-dark-secondary text-[10px] sm:text-xs font-bold">{format(new Date(), 'EEEE, MMMM do')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black text-primary dark:text-dark-primary leading-tight">
            {getGreeting()}, <span className="text-action">{user?.username}</span>
          </h1>
        </div>
        
        <div className="max-w-md p-4 sm:p-6 bg-white dark:bg-dark-surface rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft dark:shadow-soft-dark relative overflow-hidden group">
          <Quote className="absolute -top-1 -left-1 text-action/5 group-hover:scale-110 transition-transform sm:w-20 sm:h-20" size={50} />
          <p className="text-xs sm:text-base text-primary dark:text-dark-primary font-medium italic relative z-10 leading-relaxed">
            "The secret of your future is hidden in your daily routine."
          </p>
          <p className="text-[9px] sm:text-xs font-bold text-secondary dark:text-dark-secondary mt-2 sm:mt-4 uppercase tracking-widest">— Mike Murdock</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {loading && !data ? (
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 sm:h-40 rounded-2xl sm:rounded-[2rem]" />
          ))
        ) : (
          statsList.map((stat, i) => (
            <div key={i} className="p-4 sm:p-8 bg-white dark:bg-dark-surface rounded-2xl sm:rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-soft dark:shadow-soft-dark hover:scale-[1.02] transition-all group">
              <div className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl ${stat.bg} ${stat.color} w-fit mb-3 sm:mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon size={18} className="sm:w-6 sm:h-6" />
              </div>
              <p className="text-[9px] sm:text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-xl sm:text-3xl font-black text-primary dark:text-dark-primary">{stat.value}</p>
            </div>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Content: Habits */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold text-primary dark:text-dark-primary flex items-center gap-3">
              <Calendar className="text-action" size={28} /> Today's Rituals
            </h2>
            <Link to="/habits" className="text-xs font-bold text-action uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
              Manage Habits <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {loading && !data ? (
              [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-3xl" />
              ))
            ) : (
              (data?.habits || []).slice(0, 6).map((habit) => (
                <div 
                  key={habit._id} 
                  className={`p-6 rounded-3xl border transition-all flex items-center justify-between group ${
                    habit.isCompletedToday 
                      ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-500/20' 
                      : 'bg-white dark:bg-dark-surface border-gray-100 dark:border-gray-700 shadow-soft hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl w-12 h-12 bg-surface dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm" style={{ color: habit.color }}>
                      {habit.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold transition-all ${habit.isCompletedToday ? 'text-accent line-through opacity-50' : 'text-primary dark:text-dark-primary'}`}>
                        {habit.title}
                      </h3>
                      <p className="text-[10px] font-black text-secondary uppercase tracking-widest">{habit.streak} day streak</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCheckHabit(habit._id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      habit.isCompletedToday 
                        ? 'bg-accent text-white shadow-lg shadow-green-500/20' 
                        : 'bg-surface dark:bg-gray-800 text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {habit.isCompletedToday ? <CheckCircle2 size={24} /> : <Circle size={24} className="opacity-30 group-hover:opacity-100" />}
                  </button>
                </div>
              ))
            )}
            {data?.habits?.length === 0 && !loading && (
              <div className="col-span-full p-12 bg-surface/30 dark:bg-gray-800/30 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-700 text-center">
                 <p className="text-secondary dark:text-dark-secondary font-medium mb-6">Your daily routine is the blueprint of your success.</p>
                 <Link to="/habits" className="inline-flex items-center gap-2 px-6 py-3 bg-primary dark:bg-action text-white rounded-2xl font-bold hover:scale-105 transition-all">
                   <Plus size={18} /> Initialize Your First Habit
                 </Link>
              </div>
            )}
          </div>

          {/* Active Goals Preview */}
          {(!loading || data) && data?.goals?.length > 0 && (
            <div className="pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-bold text-primary dark:text-dark-primary flex items-center gap-3">
                    <Target className="text-accent" size={28} /> Active Missions
                  </h2>
                  <Link to="/goals" className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                    All Goals <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid gap-4">
                  {loading && !data ? (
                    [...Array(2)].map((_, i) => <Skeleton key={i} className="h-24 rounded-3xl" />)
                  ) : (
                    data?.goals?.slice(0, 2).map((goal) => (
                      <div key={goal._id} className="p-6 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft">
                          <div className="flex items-center justify-between mb-4">
                             <h3 className="font-bold text-primary dark:text-dark-primary">{goal.title}</h3>
                             <span className="text-[10px] font-black text-secondary bg-surface dark:bg-gray-800 px-3 py-1 rounded-full uppercase tracking-widest">{goal.progress}% Complete</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                             <div className="bg-accent h-full rounded-full transition-all duration-1000" style={{ width: `${goal.progress}%` }}></div>
                          </div>
                      </div>
                    ))
                  )}
                </div>
            </div>
          )}
        </div>

        {/* Sidebar: Social & Motivation */}
        <div className="space-y-6 sm:space-y-10">
          <div className="p-6 sm:p-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <Zap className="absolute -top-4 -right-4 p-8 text-white/10 group-hover:scale-125 transition-transform duration-700" size={120} />
              <div className="relative z-10">
                <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                  <Flame size={20} className="text-orange-200" /> Daily Fuel
                </h3>
                <p className="text-sm sm:text-lg font-black leading-tight mb-6">
                  "{dailyQuote?.text || "Discipline equals freedom."}"
                </p>
                <Link to="/motivation" className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Get Fueled <ArrowRight size={14} />
                </Link>
              </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-primary via-slate-900 to-black rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <Zap className="absolute top-0 right-0 p-12 text-white/5 group-hover:scale-125 transition-transform duration-700" size={160} />
              <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2 relative z-10">
                <Sparkles size={20} className="text-orange-400" /> Recent Trophies
              </h3>
              <div className="space-y-6 relative z-10">
                 {loading && !data ? (
                   [...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl bg-white/5" />)
                 ) : (
                   data?.achievements?.map((ach) => (
                     <div key={ach._id} className="flex gap-4 group/item">
                        <div className="text-3xl p-3 bg-white/10 rounded-2xl group-hover/item:scale-110 transition-transform">{ach.icon}</div>
                        <div>
                          <p className="font-bold text-sm">{ach.title}</p>
                          <p className="text-xs text-slate-400 mt-1">{ach.description}</p>
                        </div>
                     </div>
                   ))
                 )}
                 {data?.achievements?.length === 0 && !loading && (
                   <div className="py-4">
                     <p className="text-sm text-slate-400 italic">No trophies unlocked yet. Keep pushing your limits!</p>
                   </div>
                 )}
              </div>
          </div>

          <div className="p-8 bg-white dark:bg-dark-surface rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-soft dark:shadow-soft-dark">
              <h3 className="text-xl font-heading font-bold mb-6 text-primary dark:text-dark-primary flex items-center gap-2">
                <TrendingUp size={20} className="text-action" /> Your Trajectory
              </h3>
              <div className="space-y-6">
                  {loading && !data ? (
                    <Skeleton className="h-24 rounded-2xl" />
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-secondary">Consistency Rate</span>
                        <span className="text-sm font-black text-action">{data?.stats?.habits?.completionRate}%</span>
                      </div>
                      <div className="w-full bg-slate-50 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div className="bg-action h-full rounded-full" style={{ width: `${data?.stats?.habits?.completionRate}%` }}></div>
                      </div>
                    </>
                  )}
                  <p className="text-xs text-secondary leading-relaxed">
                    You're maintaining an elite consistency. Keep this pace to reach your next milestone.
                  </p>
                  <Link to="/analytics" className="flex items-center justify-center gap-2 w-full py-3 bg-surface dark:bg-gray-800 text-primary dark:text-dark-primary rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                    Deep Insights <ChevronRight size={14} />
                  </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
