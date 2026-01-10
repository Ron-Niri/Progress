import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ xp: 0, level: 1, streak: 0 });
  const [newTaskText, setNewTaskText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        setLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTaskText.trim()) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTaskText }),
      });
      if (res.ok) {
        setNewTaskText('');
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const toggleTask = async (id) => {
    try {
      // Optimistic update
      setTasks(tasks.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
      
      const res = await fetch(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        if (data.stats) setStats(data.stats);
      } else {
          // Revert on error
          fetchData();
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      fetchData();
    }
  };

  const xpProgress = (stats.xp % 100); 

  if (loading) {
      return <div className="app-loading">Loading Progress...</div>;
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">
          <div className="logo-stack">
            <span className="logo-icon">▲</span>
          </div>
        </div>

        <div className="nav-links">
          {['dashboard', 'tasks', 'journal', 'settings'].map((view) => (
            <button
              key={view}
              className={`nav-item ${activeView === view ? 'active' : ''}`}
              onClick={() => setActiveView(view)}
            >
              <div className="tooltip">{view.charAt(0).toUpperCase() + view.slice(1)}</div>
              {/* Icons placeholders */}
              <div className="icon-placeholder" style={{
                  width: 20, 
                  height: 20, 
                  background: 'currentColor', 
                  opacity: activeView === view ? 1 : 0.5, 
                  borderRadius: 4,
                  transition: 'opacity 0.2s'
              }}></div>
            </button>
          ))}
        </div>

        <div className="user-mini">
          <div className="avatar-glow">
            <div className="avatar">R</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-view">
        <header className="view-header">
          <div className="greeting">
            <h2>Good Evening, User</h2>
            <p className="subtitle">Ready to conquer?</p>
          </div>
          <div className="level-indicator">
            <div className="xp-ring">
              <svg width="60" height="60">
                <circle className="bg" cx="30" cy="30" r="26"></circle>
                <circle
                  className="progress"
                  cx="30"
                  cy="30"
                  r="26"
                  style={{ strokeDashoffset: 163 - (163 * xpProgress) / 100 }}
                ></circle>
              </svg>
              <span className="level-num">LVL {stats.level}</span>
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="bento-grid">
            {/* Focus Score */}
            <div className="bento-item stat-box primary-stat">
              <div className="stat-content">
                <h3>Focus Score</h3>
                <div className="big-number">84<span className="small">%</span></div>
                <div className="chart-mini">
                  <div className="bar" style={{ height: '40%' }}></div>
                  <div className="bar" style={{ height: '60%' }}></div>
                  <div className="bar" style={{ height: '80%' }}></div>
                  <div className="bar active" style={{ height: '100%' }}></div>
                  <div className="bar" style={{ height: '70%' }}></div>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="bento-item task-box">
              <div className="box-header">
                <h3>Next Tasks</h3>
                <button
                  className="icon-btn add-task-btn"
                  onClick={() => setIsModalOpen(true)}
                >
                  +
                </button>
              </div>
              <div className="task-scroller">
                {tasks.length === 0 ? (
                    <div style={{padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)'}}>
                        No tasks yet. Start somewhere!
                    </div>
                ) : (
                    tasks.map((task) => (
                    <div
                        key={task._id}
                        className={`task-item ${task.completed ? 'completed' : ''}`}
                        onClick={() => toggleTask(task._id)}
                    >
                        <div className={`checkbox ${task.completed ? 'checked' : ''}`}>
                            {task.completed && '✓'}
                        </div>
                        <span className="task-text">{task.text}</span>
                    </div>
                    ))
                )}
              </div>
            </div>

            {/* Streak */}
            <div className="bento-item streak-box">
              <h3>Current Streak</h3>
              <div className="fire-anim">
                <div className="flame"></div>
                <div className="flame"></div>
                <div className="flame"></div>
              </div>
              <div className="streak-count">{stats.streak}</div>
              <p className="streak-label">Days</p>
            </div>

            {/* Quote */}
            <div className="bento-item quote-box">
              <p className="quote">"The only way to do great work is to love what you do."</p>
              <span className="author">— Steve Jobs</span>
            </div>

            {/* Quick Action */}
            <div className="bento-item quick-action">
              <button className="action-btn">
                <span>Start Focus Session</span>
                <div className="glow"></div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>New Mission</h3>
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && createTask()}
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                My bad
              </button>
              <button className="btn-confirm" onClick={createTask}>
                Commit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
