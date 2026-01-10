import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Link as LinkIcon, Calendar, Users, Award, CheckCircle, Target } from 'lucide-react';

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const id = userId || 'me';
      const res = await api.get(`/profile/${id}`);
      setProfile(res.data);
      if (!isOwnProfile) {
        setIsFollowing(res.data.followers.some(f => f._id === currentUser?.id));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.post(`/profile/unfollow/${userId}`);
        setIsFollowing(false);
      } else {
        await api.post(`/profile/follow/${userId}`);
        setIsFollowing(true);
      }
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-secondary dark:text-dark-secondary">Loading profile...</div>;
  if (!profile) return <div className="text-center py-12">User not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-soft dark:shadow-soft-dark">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-background dark:border-dark-background overflow-hidden bg-surface dark:bg-gray-700 flex items-center justify-center text-secondary">
              {profile.profile?.avatar ? (
                <img src={profile.profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <User size={64} />
              )}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-heading font-bold text-primary dark:text-dark-primary">{profile.username}</h2>
                <p className="text-secondary dark:text-dark-secondary mt-1">{profile.profile?.bio || 'No bio yet'}</p>
              </div>
              
              {!isOwnProfile ? (
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    isFollowing 
                      ? 'bg-surface dark:bg-gray-700 text-primary dark:text-dark-primary border border-gray-200 dark:border-gray-600' 
                      : 'bg-primary dark:bg-action text-white hover:opacity-90'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              ) : (
                <button className="px-6 py-2 rounded-full border border-gray-200 dark:border-gray-600 font-semibold text-primary dark:text-dark-primary hover:bg-surface dark:hover:bg-gray-700 transition-all">
                  Edit Profile
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm text-secondary dark:text-dark-secondary">
              {profile.profile?.location && (
                <span className="flex items-center gap-1.5"><MapPin size={16} /> {profile.profile.location}</span>
              )}
              {profile.profile?.website && (
                <a href={profile.profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-action hover:underline">
                  <LinkIcon size={16} /> Website
                </a>
              )}
              <span className="flex items-center gap-1.5"><Calendar size={16} /> Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex gap-8 border-t border-gray-100 dark:border-gray-700 pt-4">
              <div className="text-center">
                <p className="text-xl font-bold text-primary dark:text-dark-primary">{profile.stats.followers}</p>
                <p className="text-xs text-secondary dark:text-dark-secondary uppercase tracking-wider">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-primary dark:text-dark-primary">{profile.stats.following}</p>
                <p className="text-xs text-secondary dark:text-dark-secondary uppercase tracking-wider">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Stats & Achievements */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-soft dark:shadow-soft-dark">
            <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
              <Award className="text-accent" size={20} /> Achievements
            </h3>
            <div className="space-y-4">
              {profile.stats.achievements === 0 ? (
                <p className="text-sm text-secondary italic">No achievements unlocked yet.</p>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {/* Placeholder for achievement badges */}
                  {[...Array(profile.stats.achievements)].map((_, i) => (
                    <div key={i} className="aspect-square bg-surface dark:bg-gray-700 rounded-lg flex items-center justify-center text-xl" title="Achievement Unlocked">
                      🏆
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-soft dark:shadow-soft-dark">
            <h3 className="text-lg font-heading font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-accent" />
                  <span className="text-sm">Active Habits</span>
                </div>
                <span className="font-bold">{profile.stats.habits}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <Target size={18} className="text-action" />
                  <span className="text-sm">Active Goals</span>
                </div>
                <span className="font-bold">{profile.stats.goals}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Feed / Activity (Placeholder) */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-soft dark:shadow-soft-dark text-center py-16">
            <p className="text-secondary dark:text-dark-secondary">Recent activity will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
