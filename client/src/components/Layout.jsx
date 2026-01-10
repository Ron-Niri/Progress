import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, CheckCircle, Target, BookOpen, BarChart2, Settings as SettingsIcon, LogOut, Moon, Sun, User } from 'lucide-react';

export default function Layout({ children }) {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Habits', href: '/habits', icon: CheckCircle },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background flex transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-surface border-r border-gray-100 dark:border-gray-700 hidden md:flex flex-col transition-colors">
        <div className="p-6">
          <h1 className="text-2xl font-heading font-bold text-primary dark:text-dark-primary">Progress.</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-surface dark:bg-gray-700 text-primary dark:text-dark-primary' 
                    : 'text-secondary dark:text-dark-secondary hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-dark-primary'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-action' : 'text-secondary dark:text-dark-secondary'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
           <button 
             onClick={toggleDarkMode}
             className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-dark-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
           >
             {darkMode ? <Sun size={18} /> : <Moon size={18} />}
             {darkMode ? 'Light Mode' : 'Dark Mode'}
           </button>
           <button 
             onClick={logout}
             className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-secondary dark:text-dark-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
           >
             <LogOut size={18} />
             Sign out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-dark-surface p-4 flex items-center justify-between">
           <h1 className="text-lg font-heading font-bold text-primary dark:text-dark-primary">Progress.</h1>
           <button onClick={logout} className="text-sm text-secondary dark:text-dark-secondary">Sign Out</button>
        </div>

        <main className="flex-1 overflow-auto p-4 sm:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
