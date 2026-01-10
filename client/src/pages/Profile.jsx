import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Link as LinkIcon, Calendar, Users, Award, CheckCircle, Target, TrendingUp, X } from 'lucide-react';

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('activity');
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [activities, setActivities] = useState([]);

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    fetchProfile();
    fetchActivities();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const id = userId || 'me';
      const res = await api.get(`/profile/${id}`);
      setProfile(res.data);
      if (!isOwnProfile) {
        setIsFollowing(res.data.followers.some(f => f._id === currentUser?.id || f === currentUser?.id));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const id = userId || 'me';
      const res = await api.get(`/profile/${id}/activity`);
      setActivities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'habit_completed': return '🔥';
      case 'goal_created': return '🎯';
      case 'goal_completed': return '🏆';
      case 'achievement_unlocked': return '🥇';
      case 'level_up': return '⭐';
      default: return '📍';
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.post(`/profile/unfollow/${profile._id}`);
        setIsFollowing(false);
      } else {
        await api.post(`/profile/follow/${profile._id}`);
        setIsFollowing(true);
      }
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-action rounded-full animate-spin"></div>
      <p className="text-secondary dark:text-dark-secondary font-medium animate-pulse">Loading profile...</p>
    </div>
  );
  
  if (!profile) return (
    <div className="text-center py-20 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft">
      <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <X className="text-red-500" size={40} />
      </div>
      <h2 className="text-2xl font-heading font-bold text-primary dark:text-dark-primary mb-2">User Not Found</h2>
      <p className="text-secondary dark:text-dark-secondary mb-8">The profile you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="px-8 py-3 bg-primary dark:bg-action text-white rounded-xl font-bold shadow-lg shadow-blue-500/20">Return Home</Link>
    </div>
  );

  const Modal = ({ isOpen, onClose, title, list }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-dark-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-heading font-bold text-primary dark:text-dark-primary">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-surface dark:hover:bg-gray-800 rounded-full transition-all text-secondary">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {list.length === 0 ? (
              <p className="text-center py-8 text-secondary italic">No users found.</p>
            ) : (
              <div className="space-y-4">
                {list.map(u => (
                  <Link 
                    key={u._id} 
                    to={`/profile/${u._id}`} 
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 hover:bg-surface dark:hover:bg-gray-800 rounded-2xl transition-all"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-gray-700 flex items-center justify-center">
                      {u.profile?.avatar ? <img src={u.profile.avatar} className="w-full h-full object-cover" /> : <User size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-primary dark:text-dark-primary">{u.username}</p>
                      <p className="text-xs text-secondary">{u.profile?.bio?.substring(0, 40)}...</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-soft dark:shadow-soft-dark overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:opacity-20"></div>
        
        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl border-4 border-background dark:border-dark-background overflow-hidden bg-white dark:bg-gray-700 flex items-center justify-center text-secondary shadow-xl">
              {profile.profile?.avatar ? (
                <img src={profile.profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="opacity-20" />
              )}
            </div>
            {isOwnProfile && (
              <Link 
                to="/settings" 
                className="absolute -bottom-2 -right-2 p-2 bg-primary dark:bg-action text-white rounded-xl border-4 border-background dark:border-dark-background hover:scale-110 transition-all shadow-lg"
              >
                <LinkIcon size={14} />
              </Link>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-heading font-bold text-primary dark:text-dark-primary">{profile.username}</h2>
                <p className="text-secondary dark:text-dark-secondary mt-1 max-w-lg">{profile.profile?.bio || 'Living with intention and pursuing progress every day.'}</p>
              </div>
              
              {!isOwnProfile ? (
                <button
                  onClick={handleFollow}
                  className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                    isFollowing 
                      ? 'bg-surface dark:bg-gray-800 text-primary dark:text-dark-primary border border-gray-100 dark:border-gray-700' 
                      : 'bg-primary dark:bg-action text-white hover:scale-105 shadow-blue-500/20'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow User'}
                </button>
              ) : (
                <Link 
                  to="/settings"
                  className="px-8 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 font-bold text-primary dark:text-dark-primary hover:bg-surface dark:hover:bg-gray-800 transition-all bg-white dark:bg-dark-surface shadow-sm"
                >
                  Edit Profile
                </Link>
              )}
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-secondary dark:text-dark-secondary">
              <span className="flex items-center gap-1.5 bg-surface dark:bg-gray-800 px-3 py-1.5 rounded-full"><MapPin size={16} className="text-red-400" /> {profile.profile?.location || 'Everywhere'}</span>
              {profile.profile?.website && (
                <a href={profile.profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-surface dark:bg-gray-800 px-3 py-1.5 rounded-full text-action hover:underline">
                  <LinkIcon size={16} /> {profile.profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              <span className="flex items-center gap-1.5 bg-surface dark:bg-gray-800 px-3 py-1.5 rounded-full"><Calendar size={16} className="text-blue-400" /> Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
            </div>
            
            <div className="flex gap-10 pt-4">
              <button onClick={() => setShowFollowers(true)} className="group">
                <p className="text-2xl font-bold text-primary dark:text-dark-primary group-hover:text-action transition-all">{profile.stats.followers}</p>
                <p className="text-[10px] text-secondary dark:text-dark-secondary uppercase font-bold tracking-[2px]">Followers</p>
              </button>
              <button onClick={() => setShowFollowing(true)} className="group">
                <p className="text-2xl font-bold text-primary dark:text-dark-primary group-hover:text-action transition-all">{profile.stats.following}</p>
                <p className="text-[10px] text-secondary dark:text-dark-secondary uppercase font-bold tracking-[2px]">Following</p>
              </button>
              <div>
                <p className="text-2xl font-bold text-primary dark:text-dark-primary">{profile.stats.achievements}</p>
                <p className="text-[10px] text-secondary dark:text-dark-secondary uppercase font-bold tracking-[2px]">Badges</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Stats & Achievements */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-soft dark:shadow-soft-dark">
            <h3 className="text-lg font-heading font-bold mb-6 flex items-center gap-3 text-primary dark:text-dark-primary">
              <Award className="text-accent" size={24} /> Achievements
            </h3>
            <div className="space-y-4">
              {profile.stats.achievements === 0 ? (
                <div className="px-4 py-8 text-center bg-surface dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-secondary italic">Unlock badges by staying consistent with your habits.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(profile.stats.achievements)].map((_, i) => (
                    <div key={i} className="group relative">
                      <div className="aspect-square bg-surface dark:bg-gray-800 rounded-2xl flex items-center justify-center text-2xl shadow-sm hover:scale-110 hover:-rotate-6 transition-all cursor-help border border-gray-100 dark:border-gray-700" title="Achievement Unlocked">
                        🏆
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-soft dark:shadow-soft-dark">
            <h3 className="text-lg font-heading font-bold mb-6 text-primary dark:text-dark-primary">Consistency Matrix</h3>
            <div className="space-y-4">
              {[
                { label: 'Habit Consistency', value: profile.stats.habits, icon: CheckCircle, color: 'text-accent', bg: 'bg-green-50 dark:bg-green-900/10' },
                { label: 'Goal Velocity', value: profile.stats.goals, icon: Target, color: 'text-action', bg: 'bg-blue-50 dark:bg-blue-900/10' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-surface dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                      <stat.icon size={18} />
                    </div>
                    <span className="text-sm font-bold text-primary dark:text-dark-primary">{stat.label}</span>
                  </div>
                  <span className="text-lg font-black text-primary dark:text-dark-primary">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Feed */}
        <div className="md:col-span-2 space-y-8">
           <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-soft dark:shadow-soft-dark">
              <div className="flex items-center gap-8 border-b border-gray-100 dark:border-gray-700 mb-8">
                <button 
                  onClick={() => setActiveTab('activity')}
                  className={`pb-4 text-sm font-bold transition-all uppercase tracking-widest ${activeTab === 'activity' ? 'text-primary dark:text-dark-primary border-b-2 border-action' : 'text-secondary opacity-50 hover:opacity-100'}`}
                >
                  Activity
                </button>
                <button 
                  onClick={() => setActiveTab('habits')}
                  className={`pb-4 text-sm font-bold transition-all uppercase tracking-widest ${activeTab === 'habits' ? 'text-primary dark:text-dark-primary border-b-2 border-action' : 'text-secondary opacity-50 hover:opacity-100'}`}
                >
                  Habits
                </button>
              </div>

              {activeTab === 'activity' && (
                <div className="space-y-8">
                  {activities.map(act => (
                    <div key={act._id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800 last:before:hidden">
                      <div className="absolute left-[-4.5px] top-2 w-3 h-3 rounded-full bg-white dark:bg-dark-surface ring-2 ring-action flex items-center justify-center text-[8px]">
                        {getActivityIcon(act.type)}
                      </div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-primary dark:text-dark-primary">{act.title}</h4>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{new Date(act.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-secondary dark:text-dark-secondary">{act.description}</p>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <div className="text-center py-20 text-secondary italic opacity-50">
                      No recent activity recorded.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'habits' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* List public habits if available or show placeholder */}
                  <div className="p-6 bg-surface dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 text-center col-span-full py-12">
                     <p className="text-secondary italic">Habit sharing is coming soon to your profile feed.</p>
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>

      <Modal 
        isOpen={showFollowers} 
        onClose={() => setShowFollowers(false)} 
        title="Followers" 
        list={profile.followers || []} 
      />
      <Modal 
        isOpen={showFollowing} 
        onClose={() => setShowFollowing(false)} 
        title="Following" 
        list={profile.following || []} 
      />
    </div>
  );
}
