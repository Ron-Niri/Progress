import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Book, 
  Settings, 
  LogOut,
  Zap,
  Target,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'tasks', icon: CheckSquare, label: 'Focus Missions' },
  { id: 'journal', icon: Book, label: 'Growth Log' },
  { id: 'settings', icon: Settings, label: 'Configuration' },
];

export function Sidebar({ activeView, setActiveView }) {
  return (
    <motion.nav 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="sidebar"
    >
      <div className="logo-container">
        <div className="logo-box">
          <Zap size={22} fill="white" color="white" />
        </div>
        <span className="logo-text">Progress</span>
      </div>

      <div className="nav-section">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">R</div>
          <div className="user-info">
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Ron Niri</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Level 1 Achiever</div>
          </div>
        </div>
        <button className="nav-item" style={{ marginTop: '16px' }}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.nav>
  );
}
