import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  User, 
  Save, 
  Check, 
  Lock, 
  AlertCircle,
  Globe,
  MapPin,
  Camera,
  Info,
  ChevronRight,
  Zap
} from 'lucide-react';

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState({
    bio: '',
    location: '',
    website: '',
    avatar: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    habitReminders: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get('/profile/me');
      setProfile({
        bio: res.data.profile?.bio || '',
        location: res.data.profile?.location || '',
        website: res.data.profile?.website || '',
        avatar: res.data.profile?.avatar || ''
      });
      setPreferences({
        emailNotifications: res.data.preferences?.emailNotifications ?? true,
        habitReminders: res.data.preferences?.habitReminders ?? true
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
    setError('');
    try {
      await api.put('/profile/me', profile);
      showSuccess();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePreferences = async (updates) => {
    setSaving(true);
    try {
      const newPrefs = { ...preferences, ...updates };
      await api.put('/profile/preferences', newPrefs);
      setPreferences(newPrefs);
      showSuccess();
    } catch (err) {
      setError('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setSaving(true);
    setError('');
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSuccess();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const showSuccess = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-action rounded-full animate-spin"></div>
      <p className="text-secondary dark:text-dark-secondary font-medium animate-pulse">Loading your configurations...</p>
    </div>
  );

  const tabs = [
    { id: 'profile', name: 'Profile', desc: 'Public identity & bio', icon: User, color: 'text-action' },
    { id: 'preferences', name: 'Preferences', desc: 'Theme & notifications', icon: SettingsIcon, color: 'text-purple-500' },
    { id: 'security', name: 'Security', desc: 'Password & protection', icon: Shield, color: 'text-red-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-heading font-black text-primary dark:text-dark-primary flex items-center gap-4">
            <SettingsIcon size={40} className="text-action" /> Command Center
          </h2>
          <p className="text-secondary dark:text-dark-secondary mt-1 text-lg font-medium opacity-70">Customize your Progress environment.</p>
        </div>
        
        {saved && (
           <div className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl font-bold shadow-lg animate-in zoom-in slide-in-from-right-10 duration-500">
             <Check size={20} /> Preferences Synced
           </div>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Navigation Tabs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft dark:shadow-soft-dark space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full group flex items-center gap-4 px-6 py-5 rounded-[1.5rem] font-bold transition-all relative overflow-hidden ${
                  activeTab === tab.id 
                    ? 'bg-primary dark:bg-action text-white shadow-xl scale-[1.02]' 
                    : 'text-secondary dark:text-dark-secondary hover:bg-surface dark:hover:bg-gray-800'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${activeTab === tab.id ? 'bg-white/20' : 'bg-surface dark:bg-gray-700'} ${tab.color}`}>
                  <tab.icon size={22} />
                </div>
                <div className="text-left">
                  <p className="text-sm leading-tight">{tab.name}</p>
                  <p className={`text-[10px] font-medium opacity-50 ${activeTab === tab.id ? 'text-white' : 'text-secondary'}`}>{tab.desc}</p>
                </div>
                <ChevronRight size={18} className={`ml-auto transition-transform ${activeTab === tab.id ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </button>
            ))}
          </div>

          <div className="p-8 bg-gradient-to-br from-action to-blue-700 rounded-3xl text-white shadow-xl relative overflow-hidden group">
             <Zap className="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-125 transition-transform" size={140} />
             <h4 className="font-heading font-black text-xl mb-4 relative z-10">Peak Performance</h4>
             <p className="text-sm text-blue-100 relative z-10 leading-relaxed font-medium">Fine-tune your notifications to stay in the zone without getting distracted.</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {error && (
            <div className="flex items-center gap-3 p-6 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-3xl border border-red-100 dark:border-red-900/20 animate-in zoom-in duration-300 shadow-sm">
              <AlertCircle size={24} />
              <p className="font-bold">{error}</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <section className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-10 shadow-soft dark:shadow-soft-dark animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 bg-action/10 rounded-2xl flex items-center justify-center text-action">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-black text-primary dark:text-dark-primary">Personal Identity</h3>
                  <p className="text-secondary dark:text-dark-secondary text-sm font-medium">This information is visible to other members.</p>
                </div>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] ml-1">Avatar Appearance</label>
                    <div className="relative group">
                      <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-40 group-focus-within:text-action transition-all" size={20} />
                      <input 
                        type="text" 
                        value={profile.avatar}
                        onChange={e => setProfile({...profile, avatar: e.target.value})}
                        placeholder="https://images.com/profile.jpg"
                        className="w-full rounded-2xl border border-gray-100 dark:border-gray-700 bg-surface/50 dark:bg-dark-background pl-12 pr-6 py-4 text-sm font-medium focus:ring-4 focus:ring-action/10 focus:border-action transition-all outline-none text-primary dark:text-dark-primary shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] ml-1">Base Location</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-40 group-focus-within:text-action transition-all" size={20} />
                      <input 
                        type="text" 
                        value={profile.location}
                        onChange={e => setProfile({...profile, location: e.target.value})}
                        placeholder="Earth, Milky Way"
                        className="w-full rounded-2xl border border-gray-100 dark:border-gray-700 bg-surface/50 dark:bg-dark-background pl-12 pr-6 py-4 text-sm font-medium focus:ring-4 focus:ring-action/10 focus:border-action transition-all outline-none text-primary dark:text-dark-primary shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] ml-1">Digital Presence (URL)</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-40 group-focus-within:text-action transition-all" size={20} />
                    <input 
                      type="url" 
                      value={profile.website}
                      onChange={e => setProfile({...profile, website: e.target.value})}
                      placeholder="https://yourjourney.com"
                      className="w-full rounded-2xl border border-gray-100 dark:border-gray-700 bg-surface/50 dark:bg-dark-background pl-12 pr-6 py-4 text-sm font-medium focus:ring-4 focus:ring-action/10 focus:border-action transition-all outline-none text-primary dark:text-dark-primary shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] ml-1">The Narrative (Bio)</label>
                  <textarea 
                    rows={4}
                    value={profile.bio}
                    onChange={e => setProfile({...profile, bio: e.target.value})}
                    placeholder="Shared your vision, mission, and focus..."
                    className="w-full rounded-[2rem] border border-gray-100 dark:border-gray-700 bg-surface/50 dark:bg-dark-background px-6 py-5 text-sm font-medium focus:ring-4 focus:ring-action/10 focus:border-action transition-all outline-none text-primary dark:text-dark-primary resize-none shadow-sm"
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full md:w-auto px-12 py-4 bg-primary dark:bg-action text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                  >
                    {saving ? 'Synchronizing...' : (saved ? <><Check size={18} /> Profile Updated</> : <><Save size={18} /> Update Identity</>)}
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <section className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-10 shadow-soft dark:shadow-soft-dark">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                    <Sun size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-black text-primary dark:text-dark-primary">Aesthetics</h3>
                    <p className="text-secondary dark:text-dark-secondary text-sm font-medium">Control the visual mode of your command center.</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-8 bg-surface dark:bg-gray-800/30 rounded-[2rem] border border-gray-50 dark:border-gray-800">
                  <div>
                    <p className="font-black text-primary dark:text-dark-primary uppercase tracking-widest text-xs mb-1">Illumination Mode</p>
                    <p className="text-sm text-secondary dark:text-dark-secondary font-medium">Toggle between Solar (Light) and Astral (Dark) themes.</p>
                  </div>
                  <button 
                    onClick={toggleDarkMode}
                    className={`relative w-20 h-10 rounded-full transition-all duration-500 flex items-center ${darkMode ? 'bg-indigo-600' : 'bg-orange-400'} shadow-inner`}
                  >
                    <div className={`absolute w-8 h-8 rounded-2xl bg-white shadow-2xl transition-all duration-500 flex items-center justify-center ${darkMode ? 'translate-x-[2.75rem]' : 'translate-x-1'} rotate-${darkMode ? '0' : '45'}`}>
                      {darkMode ? <Moon size={18} className="text-indigo-600" /> : <Sun size={18} className="text-orange-400" />}
                    </div>
                  </button>
                </div>
              </section>

              <section className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-10 shadow-soft dark:shadow-soft-dark">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
                    <Bell size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-black text-primary dark:text-dark-primary">Alert Protocol</h3>
                    <p className="text-secondary dark:text-dark-secondary text-sm font-medium">Configure how and when you want to be notified.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { key: 'emailNotifications', label: 'Email Intelligence', desc: 'Detailed digest of your weekly evolutionary metrics.' },
                    { key: 'habitReminders', label: 'In-App Alerts', desc: 'Real-time nudges for your high-priority daily rituals.' }
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between p-6 hover:bg-surface dark:hover:bg-gray-800/30 rounded-2xl transition-all group">
                      <div>
                        <p className="font-black text-primary dark:text-dark-primary uppercase tracking-widest text-xs mb-1">{pref.label}</p>
                        <p className="text-sm text-secondary dark:text-dark-secondary font-medium">{pref.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={preferences[pref.key]}
                          onChange={e => handleUpdatePreferences({ [pref.key]: e.target.checked })}
                          className="sr-only peer" 
                        />
                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-action shadow-inner"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'security' && (
            <section className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-10 shadow-soft dark:shadow-soft-dark animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                  <Shield size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-black text-primary dark:text-dark-primary">Defense Systems</h3>
                  <p className="text-secondary dark:text-dark-secondary text-sm font-medium">Secure your progress with encrypted access.</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] ml-1">Current Authorization</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-40 group-focus-within:text-red-500 transition-all" size={20} />
                    <input 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                      className="w-full rounded-2xl border border-gray-100 dark:border-gray-700 bg-surface/50 dark:bg-dark-background pl-12 pr-6 py-4 text-sm font-medium focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all outline-none text-primary dark:text-dark-primary shadow-sm"
                      placeholder="Enter current password"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] ml-1">New Shield</label>
                    <input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                      minLength={6}
                      className="w-full rounded-2xl border border-gray-100 dark:border-gray-700 bg-surface/50 dark:bg-dark-background px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-action/10 focus:border-action transition-all outline-none text-primary dark:text-dark-primary shadow-sm"
                      placeholder="New password (6+ chars)"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-secondary dark:text-dark-secondary uppercase tracking-[2px] ml-1">Confirm Shield</label>
                    <input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                      className="w-full rounded-2xl border border-gray-100 dark:border-gray-700 bg-surface/50 dark:bg-dark-background px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-action/10 focus:border-action transition-all outline-none text-primary dark:text-dark-primary shadow-sm"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full md:w-auto px-12 py-4 bg-red-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-red-700 hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                  >
                    {saving ? 'Encrypting...' : (saved ? <><Check size={18} /> Credentials Updated</> : 'Update Defense Codes')}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
