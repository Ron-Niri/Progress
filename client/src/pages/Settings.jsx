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
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState({
    bio: '',
    location: '',
    website: '',
    avatar: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    habitReminders: true,
    goalReminders: true,
    gamificationEnabled: true,
    reminderDaysBefore: 3
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
        habitReminders: res.data.preferences?.habitReminders ?? true,
        goalReminders: res.data.preferences?.goalReminders ?? true,
        gamificationEnabled: res.data.preferences?.gamificationEnabled ?? true,
        reminderDaysBefore: res.data.preferences?.reminderDaysBefore ?? 3
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
      await refreshUser(); // Sync with global state
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-primary dark:text-dark-primary flex items-center gap-4">
            <SettingsIcon size={36} className="text-action shrink-0" /> Command Center
          </h2>
          <p className="text-secondary dark:text-dark-secondary mt-1 text-sm sm:text-lg font-medium opacity-70 leading-relaxed">Customize your Progress environment.</p>
        </div>
        
        {saved && (
           <div className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg animate-in zoom-in slide-in-from-right-10 duration-500">
             <Check size={18} /> Credentials Synchronized
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
            <section className="bg-white dark:bg-dark-surface rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-6 sm:p-10 shadow-soft dark:shadow-soft-dark animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-8 sm:mb-10 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-action/10 rounded-2xl flex items-center justify-center text-action shrink-0">
                  <User size={24} className="sm:size-32" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-primary dark:text-dark-primary leading-tight">Personal Identity</h3>
                  <p className="text-secondary dark:text-dark-secondary text-xs sm:text-sm font-medium opacity-70">This information is visible to other members.</p>
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

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 sm:p-8 bg-surface/50 dark:bg-gray-800/30 rounded-[2rem] border border-gray-50 dark:border-gray-800 transition-all hover:bg-white dark:hover:bg-dark-surface hover:shadow-soft group">
                  <div>
                    <p className="font-black text-primary dark:text-dark-primary uppercase tracking-[2px] text-[10px] mb-1 group-hover:text-action transition-all leading-tight">Illumination Mode</p>
                    <p className="text-sm text-secondary dark:text-dark-secondary font-medium opacity-70">Toggle between Solar and Astral themes.</p>
                  </div>
                  <button 
                    onClick={toggleDarkMode}
                    className={`relative w-20 h-10 rounded-full transition-all duration-500 flex items-center ${darkMode ? 'bg-indigo-600' : 'bg-orange-400'} shadow-inner active:scale-95`}
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
                    { key: 'habitReminders', label: 'In-App Alerts', desc: 'Real-time nudges for your high-priority daily rituals.' },
                    { key: 'goalReminders', label: 'Goal Deadline Alerts', desc: 'Email notifications when your goals are approaching their deadline.' }
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
                  
                  {/* Reminder Days Configuration */}
                  {preferences.goalReminders && (
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-black text-primary dark:text-dark-primary uppercase tracking-widest text-xs mb-1">Reminder Window</p>
                          <p className="text-sm text-secondary dark:text-dark-secondary font-medium">How many days before the deadline should we notify you?</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleUpdatePreferences({ reminderDaysBefore: Math.max(1, preferences.reminderDaysBefore - 1) })}
                            className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center font-black text-action hover:bg-action hover:text-white transition-all shadow-sm"
                          >
                            −
                          </button>
                          <div className="w-16 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center font-black text-xl text-action shadow-sm">
                            {preferences.reminderDaysBefore}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUpdatePreferences({ reminderDaysBefore: preferences.reminderDaysBefore + 1 })}
                            className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center font-black text-action hover:bg-action hover:text-white transition-all shadow-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Gamification Core - Made Bolder */}
              <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 dark:border-gray-700 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                  <Zap size={200} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-action/10 rounded-2xl flex items-center justify-center text-action">
                      <Zap size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-heading font-black text-primary dark:text-dark-primary uppercase tracking-tight text-left">Experience Protocol</h3>
                      <p className="text-secondary dark:text-dark-secondary text-sm font-medium text-left">The psychological engine of your evolution.</p>
                    </div>
                  </div>

                  <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${preferences.gamificationEnabled ? 'bg-gradient-to-br from-action/5 to-transparent border-action/20 shadow-lg shadow-action/5' : 'bg-slate-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                      <div className="max-w-md text-left">
                        <p className="font-black text-primary dark:text-dark-primary uppercase tracking-[2px] text-xs mb-3">Gamification Engine</p>
                        <h4 className="text-lg font-bold text-primary dark:text-dark-primary mb-2">Enable Meta-Progression</h4>
                        <p className="text-sm text-secondary dark:text-dark-secondary font-medium leading-relaxed">
                          Activating this protocol enables XP points, Leveling, Status Titles, Heatmaps, and Achievement Trophies. 
                          Disabling it will <span className="text-primary dark:text-dark-primary font-bold">hide all traces</span> of the experience system from your Dashboard and Analytics.
                        </p>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => handleUpdatePreferences({ gamificationEnabled: !preferences.gamificationEnabled })}
                        className={`relative w-24 h-12 rounded-full transition-all duration-500 flex items-center p-1.5 shrink-0 ${preferences.gamificationEnabled ? 'bg-action shadow-lg shadow-action/30' : 'bg-gray-300 dark:bg-gray-700'}`}
                      >
                        <div className={`w-9 h-9 bg-white rounded-full shadow-md transition-all duration-500 transform ${preferences.gamificationEnabled ? 'translate-x-[3.25rem]' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
