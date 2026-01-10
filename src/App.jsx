import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { StatCard, FocusChart, QuoteWidget } from './components/dashboard/Widgets';
import { TaskList } from './components/dashboard/TaskList';
import { Zap, Flame, Target, Trophy, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ xp: 0, level: 1, streak: 0 });
  const [activeView, setActiveView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setTimeout(() => setLoading(false), 800); // Faint delay for effect
    }
  };

  const createTask = async (text) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const toggleTask = async (id) => {
    try {
      setTasks(tasks.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
      const res = await fetch(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        if (data.stats) setStats(data.stats);
      } else fetchData();
    } catch (error) {
      console.error('Error toggling task:', error);
      fetchData();
    }
  };

  const deleteTask = async (id) => {
    try {
      setTasks(tasks.filter(t => t._id !== id));
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting task:', error);
      fetchData();
    }
  };

  const xpProgress = (stats.xp % 100);

  if (loading) {
    return (
      <div className="sync-screen">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
        >
            <div className="sync-glitch">Syncing Systems</div>
            <div className="sync-bar-container">
                <div className="sync-bar-progress"></div>
            </div>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                className="sync-status"
            >
                Establishing secure uplink...
            </motion.div>
        </motion.div>
        
        {/* Decorative elements */}
        <div style={{ position: 'absolute', bottom: '40px', left: '40px', fontSize: '10px', color: 'rgba(255,255,255,0.1)', fontFamily: 'var(--font-mono)' }}>
            PRGRS_DEV_NODE v1.0.4<br/>
            AUTH_STATE: PENDING<br/>
            KERNEL_REV: 8.4.1
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="main-view">
        <header className="view-header">
          <div className="greeting">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              System Active, <span style={{ color: 'var(--primary)' }}>Ron</span>
            </motion.h1>
            <p className="subtitle">Operational efficiency: 94%. Ready for optimization.</p>
          </div>
          
          <div className="level-box">
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>RANKING</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>VANGUARD</div>
             </div>
             <div className="level-circle">
                <svg className="level-svg" width="64" height="64">
                    <circle className="level-bg" cx="32" cy="32" r="28" />
                    <motion.circle 
                        className="level-progress" 
                        cx="32" cy="32" r="28" 
                        strokeDasharray="176"
                        initial={{ strokeDashoffset: 176 }}
                        animate={{ strokeDashoffset: 176 - (176 * xpProgress) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>
                <span className="level-num-huge">{stats.level}</span>
             </div>
          </div>
        </header>

        <div className="content-wrapper">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bento-grid"
              >
                <StatCard 
                  className="stat-main"
                  title="Focus Score" 
                  value="84" 
                  subtext="Weekly Average"
                  icon={Target}
                  delay={0}
                />

                <StatCard 
                  className="streak-module"
                  title="Persistence" 
                  value={stats.streak} 
                  subtext="Consecutive Days"
                  icon={Flame}
                  delay={0.1}
                />
                
                <FocusChart />

                <TaskList 
                  tasks={tasks} 
                  onToggle={toggleTask} 
                  onDelete={deleteTask}
                  onAdd={createTask}
                />

                <StatCard 
                  className="small-widget"
                  title="Total XP" 
                  value={stats.xp + (stats.level-1)*100} 
                  subtext="Accumulated Power"
                  icon={Zap}
                  delay={0.4}
                />

                <QuoteWidget />
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="card small-widget"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--primary-faint)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700 }}>
                        RUN DIAGNOSTICS <ChevronRight size={18} />
                    </div>
                </motion.div>

              </motion.div>
            )}

            {activeView !== 'dashboard' && (
              <motion.div 
                key="other"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-[50vh] text-gray-500"
              >
                <Activity size={48} className="mb-4 opacity-20" />
                <h2 className="text-xl font-bold text-white mb-2">ACCESS RESTRICTED</h2>
                <p>Neural pathways not yet initialized for this section.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
