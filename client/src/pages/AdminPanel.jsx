import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Mail, 
  Zap, 
  Users, 
  Target, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Database,
  Activity,
  Plus,
  Sparkles
} from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentGoals, setRecentGoals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testEmailResult, setTestEmailResult] = useState(null);
  const [reminderResult, setReminderResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    description: '',
    category: 'health',
    icon: '✓',
    color: '#10B981',
    frequency: 'daily',
    tags: ''
  });

  useEffect(() => {
    fetchAdminData();
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await api.get('/habits/templates');
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const templateData = {
        ...newTemplate,
        tags: newTemplate.tags.split(',').map(t => t.trim()).filter(t => t)
      };
      await api.post('/habits/templates', templateData);
      setNewTemplate({
        title: '',
        description: '',
        category: 'health',
        icon: '✓',
        color: '#10B981',
        frequency: 'daily',
        tags: ''
      });
      fetchTemplates();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const [statsRes, goalsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/recent-goals'),
        api.get('/admin/users')
      ]);
      
      setStats(statsRes.data);
      setRecentGoals(goalsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setProcessing(true);
    setTestEmailResult(null);
    try {
      const res = await api.post('/admin/test-email');
      setTestEmailResult({ success: true, ...res.data });
    } catch (err) {
      setTestEmailResult({ success: false, error: err.response?.data?.msg || 'Failed to send email' });
    } finally {
      setProcessing(false);
    }
  };

  const handleTriggerReminders = async () => {
    setProcessing(true);
    setReminderResult(null);
    try {
      const res = await api.post('/admin/trigger-goal-reminders');
      setReminderResult({ success: true, ...res.data });
    } catch (err) {
      setReminderResult({ success: false, error: err.response?.data?.msg || 'Failed to trigger reminders' });
    } finally {
      setProcessing(false);
    }
  };

  const handleResetReminder = async (goalId) => {
    try {
      await api.post(`/admin/reset-reminder/${goalId}`);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin"></div>
        <p className="text-secondary dark:text-dark-secondary font-medium">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-primary dark:text-dark-primary flex items-center gap-4">
            <Shield size={36} className="text-red-500" /> Admin Control Panel
          </h2>
          <p className="text-secondary dark:text-dark-secondary mt-1 text-sm sm:text-base font-medium opacity-70">
            System diagnostics and testing tools
          </p>
        </div>
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl text-xs font-black uppercase tracking-widest border border-red-100 dark:border-red-900/20">
          Admin Access
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', value: stats?.users || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Total Goals', value: stats?.goals || 0, icon: Target, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' },
          { label: 'Total Habits', value: stats?.habits || 0, icon: Activity, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
          { label: 'Active Goals', value: stats?.activeGoals || 0, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10' },
          { label: 'Upcoming Deadlines', value: stats?.upcomingDeadlines || 0, icon: Clock, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/10' }
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft">
            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} w-fit mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-secondary dark:text-dark-secondary uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-primary dark:text-dark-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Testing Tools */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Email Test */}
        <div className="p-8 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-blue-500">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-xl font-heading font-black text-primary dark:text-dark-primary">Email System Test</h3>
              <p className="text-xs text-secondary dark:text-dark-secondary">Send a test email to verify configuration</p>
            </div>
          </div>

          <button
            onClick={handleTestEmail}
            disabled={processing}
            className="w-full px-6 py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing ? <RefreshCw size={18} className="animate-spin" /> : <Mail size={18} />}
            {processing ? 'Sending...' : 'Send Test Email'}
          </button>

          {testEmailResult && (
            <div className={`mt-4 p-4 rounded-xl ${testEmailResult.success ? 'bg-green-50 dark:bg-green-900/10 text-green-600' : 'bg-red-50 dark:bg-red-900/10 text-red-600'}`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {testEmailResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {testEmailResult.success ? `Email sent to ${testEmailResult.sentTo}` : testEmailResult.error}
              </div>
            </div>
          )}
        </div>

        {/* Cron Test */}
        <div className="p-8 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl text-orange-500">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-xl font-heading font-black text-primary dark:text-dark-primary">Goal Reminders Test</h3>
              <p className="text-xs text-secondary dark:text-dark-secondary">Manually trigger the cron job</p>
            </div>
          </div>

          <button
            onClick={handleTriggerReminders}
            disabled={processing}
            className="w-full px-6 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
            {processing ? 'Checking...' : 'Trigger Reminder Check'}
          </button>

          {reminderResult && (
            <div className={`mt-4 p-4 rounded-xl ${reminderResult.success ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}>
              {reminderResult.success ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-green-600">
                    <CheckCircle size={16} />
                    {reminderResult.msg}
                  </div>
                  <div className="text-xs text-secondary space-y-1">
                    <p>Users checked: {reminderResult.usersChecked}</p>
                    <p>Total reminders: {reminderResult.totalReminders}</p>
                    {reminderResult.results?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {reminderResult.results.map((r, i) => (
                          <p key={i} className="text-[10px]">
                            • {r.user} ({r.email}): {r.goalsFound} goal(s)
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 font-bold text-sm text-red-600">
                  <AlertCircle size={16} />
                  {reminderResult.error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Goals */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl text-purple-500">
            <Target size={24} />
          </div>
          <div>
            <h3 className="text-xl font-heading font-black text-primary dark:text-dark-primary">Recent Goals</h3>
            <p className="text-xs text-secondary dark:text-dark-secondary">Last 10 goals created</p>
          </div>
        </div>

        <div className="space-y-3">
          {recentGoals.map(goal => (
            <div key={goal._id} className="p-4 bg-surface dark:bg-gray-800 rounded-xl flex items-center justify-between">
              <div className="flex-1">
                <p className="font-bold text-sm text-primary dark:text-dark-primary">{goal.title}</p>
                <p className="text-xs text-secondary mt-1">
                  {goal.userId?.username} • {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'No deadline'}
                  {goal.reminderSent && <span className="ml-2 text-green-500">✓ Reminded</span>}
                </p>
              </div>
              <button
                onClick={() => handleResetReminder(goal._id)}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                Reset Reminder
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Template Manager */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-action">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-xl font-heading font-black text-primary dark:text-dark-primary">Template Manager</h3>
              <p className="text-xs text-secondary dark:text-dark-secondary">Global habit templates available to all users</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-1 p-6 bg-surface/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-black text-primary dark:text-dark-primary uppercase tracking-widest mb-6">Create New Template</h4>
            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest block mb-1.5 ml-1">Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Morning Run"
                  className="w-full px-4 py-2.5 bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-action transition-all text-sm"
                  value={newTemplate.title}
                  onChange={e => setNewTemplate({...newTemplate, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest block mb-1.5 ml-1">Icon & Color</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    required
                    placeholder="🔥"
                    className="w-16 px-4 py-2.5 bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-action transition-all text-sm text-center font-bold"
                    value={newTemplate.icon}
                    onChange={e => setNewTemplate({...newTemplate, icon: e.target.value})}
                  />
                  <input 
                    type="color"
                    className="h-10 w-full p-1 bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer"
                    value={newTemplate.color}
                    onChange={e => setNewTemplate({...newTemplate, color: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest block mb-1.5 ml-1">Category</label>
                <select 
                  className="w-full px-4 py-2.5 bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-action transition-all text-sm"
                  value={newTemplate.category}
                  onChange={e => setNewTemplate({...newTemplate, category: e.target.value})}
                >
                  <option value="health">Health & Fitness</option>
                  <option value="productivity">Productivity</option>
                  <option value="learning">Learning</option>
                  <option value="wellness">Wellness</option>
                  <option value="social">Social</option>
                  <option value="finance">Finance</option>
                  <option value="routine">Routine</option>
                  <option value="creativity">Creativity</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest block mb-1.5 ml-1">Tags (comma separated)</label>
                <input 
                  type="text"
                  placeholder="fitness, morning, health"
                  className="w-full px-4 py-2.5 bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-action transition-all text-sm"
                  value={newTemplate.tags}
                  onChange={e => setNewTemplate({...newTemplate, tags: e.target.value})}
                />
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 bg-action text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {processing ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={18} />}
                Create Template
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar modal-scroll pr-2">
            <h4 className="text-sm font-black text-primary dark:text-dark-primary uppercase tracking-widest mb-4">Existing Templates ({templates.length})</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {templates.map(template => (
                <div key={template._id} className="p-4 bg-surface dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                    style={{ backgroundColor: `${template.color}15`, color: template.color }}
                  >
                    {template.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-primary dark:text-dark-primary truncate">{template.title}</p>
                    <p className="text-[10px] text-secondary uppercase tracking-wider font-bold mt-0.5">{template.category}</p>
                  </div>
                  <div className="text-[10px] font-black text-action bg-action/10 px-2 py-1 rounded-lg">
                    {template.popularity} uses
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-gray-700 shadow-soft p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-xl text-green-500">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-xl font-heading font-black text-primary dark:text-dark-primary">All Users</h3>
            <p className="text-xs text-secondary dark:text-dark-secondary">User preferences and settings</p>
          </div>
        </div>

        <div className="space-y-3">
          {users.map(u => (
            <div key={u._id} className="p-4 bg-surface dark:bg-gray-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-sm text-primary dark:text-dark-primary">{u.username}</p>
                <p className="text-xs text-secondary">{u.email}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px]">
                <span className={`px-2 py-1 rounded ${u.preferences?.goalReminders ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  Goal Reminders: {u.preferences?.goalReminders ? 'ON' : 'OFF'}
                </span>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                  Reminder Window: {u.preferences?.reminderDaysBefore || 3} days
                </span>
                <span className={`px-2 py-1 rounded ${u.preferences?.emailNotifications ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  Email: {u.preferences?.emailNotifications ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
