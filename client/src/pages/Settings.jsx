import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Moon, Sun, Bell, Shield, User, Save, Check } from 'lucide-react';

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    bio: '',
    location: '',
    website: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile/me');
      setProfile({
        bio: res.data.profile?.bio || '',
        location: res.data.profile?.location || '',
        website: res.data.profile?.website || '',
        avatar: res.data.profile?.avatar || ''
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.put('/profile/me', profile);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-secondary dark:text-dark-secondary">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-heading font-bold text-primary dark:text-dark-primary flex items-center gap-3">
          <SettingsIcon size={32} /> Settings
        </h2>
        <p className="text-secondary dark:text-dark-secondary mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Navigation - could be tabs */}
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2 rounded-lg bg-surface dark:bg-gray-700 text-primary dark:text-dark-primary font-medium">Profile</button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-secondary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium">Preferences</button>
          <button className="w-full text-left px-4 py-2 rounded-lg text-secondary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium">Security</button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-8">
          {/* Profile Section */}
          <section className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-soft dark:shadow-soft-dark">
            <h3 className="text-xl font-heading font-semibold mb-6 flex items-center gap-2">
              <User size={20} className="text-action" /> Public Profile
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary dark:text-dark-primary">Avatar URL</label>
                  <input 
                    type="text" 
                    value={profile.avatar}
                    onChange={e => setProfile({...profile, avatar: e.target.value})}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-4 py-3 text-sm focus:ring-2 focus:ring-action transition-all outline-none text-primary dark:text-dark-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary dark:text-dark-primary">Location</label>
                  <input 
                    type="text" 
                    value={profile.location}
                    onChange={e => setProfile({...profile, location: e.target.value})}
                    placeholder="New York, NY"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-4 py-3 text-sm focus:ring-2 focus:ring-action transition-all outline-none text-primary dark:text-dark-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary dark:text-dark-primary">Website</label>
                <input 
                  type="url" 
                  value={profile.website}
                  onChange={e => setProfile({...profile, website: e.target.value})}
                  placeholder="https://yourwebsite.com"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-4 py-3 text-sm focus:ring-2 focus:ring-action transition-all outline-none text-primary dark:text-dark-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary dark:text-dark-primary">Bio</label>
                <textarea 
                  rows={4}
                  value={profile.bio}
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-background px-4 py-3 text-sm focus:ring-2 focus:ring-action transition-all outline-none text-primary dark:text-dark-primary resize-none"
                />
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-8 py-3 bg-primary dark:bg-action text-white rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (saved ? <><Check size={18} /> Saved</> : <><Save size={18} /> Save Profile</>)}
                </button>
              </div>
            </form>
          </section>

          {/* Theme Section */}
          <section className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-soft dark:shadow-soft-dark">
            <h3 className="text-xl font-heading font-semibold mb-6 flex items-center gap-2">
              <Sun size={20} className="text-orange-400" /> Interface Preference
            </h3>
            <div className="flex items-center justify-between p-4 bg-surface dark:bg-gray-700 rounded-xl">
              <div>
                <p className="font-semibold text-primary dark:text-dark-primary">Dark Mode</p>
                <p className="text-sm text-secondary dark:text-dark-secondary">Switch between light and dark interface.</p>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 flex items-center ${darkMode ? 'bg-action' : 'bg-gray-300'}`}
              >
                <div className={`absolute w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${darkMode ? 'translate-x-7' : 'translate-x-1'}`}>
                  {darkMode ? <Moon size={14} className="m-auto mt-1 text-action" /> : <Sun size={14} className="m-auto mt-1 text-orange-400" />}
                </div>
              </button>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 p-8 shadow-soft dark:shadow-soft-dark">
            <h3 className="text-xl font-heading font-semibold mb-6 flex items-center gap-2">
              <Bell size={20} className="text-accent" /> Notifications
            </h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                <p className="text-sm text-secondary dark:text-dark-secondary font-medium">Email Daily Digest</p>
                <input type="checkbox" defaultChecked className="rounded text-action focus:ring-action" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-secondary dark:text-dark-secondary font-medium">Habit Reminders</p>
                <input type="checkbox" defaultChecked className="rounded text-action focus:ring-action" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
