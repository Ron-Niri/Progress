import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  CheckCircle, 
  Target, 
  BookOpen, 
  BarChart2, 
  Settings as SettingsIcon, 
  LogOut, 
  Moon, 
  Sun, 
  User,
  Menu,
  X
} from 'lucide-react';
import Logo from './Logo';

export default function Layout({ children }) {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="h-screen bg-background dark:bg-dark-background flex transition-colors overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="w-72 bg-white dark:bg-dark-surface border-r border-gray-100 dark:border-gray-700 hidden lg:flex flex-col transition-colors sticky top-0 h-screen">
        <div className="p-8 flex items-center justify-between">
          <Logo />
        </div>

        {/* User Quick Actions */}
        <div className="px-6 mb-6 flex gap-2">
           <button 
             onClick={toggleDarkMode}
             title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
             className="flex-1 flex items-center justify-center p-3.5 bg-surface dark:bg-gray-800 text-secondary dark:text-dark-secondary hover:text-action dark:hover:text-action rounded-2xl transition-all border border-transparent hover:border-action/20"
           >
             {darkMode ? <Sun size={20} className="text-orange-400" /> : <Moon size={20} className="text-blue-500" />}
           </button>
           <button 
             onClick={logout}
             title="Sign out"
             className="flex-1 flex items-center justify-center p-3.5 bg-red-50/50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-transparent"
           >
             <LogOut size={20} />
           </button>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-action text-white shadow-lg shadow-blue-500/20 active:scale-95' 
                    : 'text-secondary dark:text-dark-secondary hover:bg-surface dark:hover:bg-gray-800 hover:text-primary dark:hover:text-dark-primary'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-secondary dark:text-dark-secondary'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Improved User Section at Bottom */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
           <Link 
             to="/profile"
             className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface dark:hover:bg-gray-800 transition-all group"
           >
             <div className="w-10 h-10 rounded-full bg-action/10 flex items-center justify-center text-action font-black">
                {useAuth().user?.username?.charAt(0).toUpperCase()}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-primary dark:text-dark-primary truncate">{useAuth().user?.username}</p>
               <p className="text-[10px] font-bold text-secondary uppercase tracking-widest truncate">View Profile</p>
             </div>
             <SettingsIcon size={16} className="text-secondary group-hover:rotate-90 transition-transform" />
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Mini Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 px-5 h-20 flex items-center justify-between">
            <Logo className="scale-90 origin-left" />
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleDarkMode}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-surface dark:bg-gray-800 text-primary dark:text-dark-primary transition-all active:scale-90"
              >
                {darkMode ? <Sun size={20} className="text-orange-400" /> : <Moon size={20} className="text-blue-500" />}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-primary dark:bg-action text-white shadow-lg active:scale-90 transition-all"
              >
                <Menu size={20} />
              </button>
            </div>
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-10 pb-24 lg:pb-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

        {/* Bottom Tab Bar for Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-700 px-8 py-4 pb-[calc(1.2rem+env(safe-area-inset-bottom,0px))] flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
           {navigation.slice(0, 5).map((item) => {
             const isActive = location.pathname === item.href;
             return (
               <Link
                 key={item.name}
                 to={item.href}
                 className={`flex flex-col items-center transition-all ${isActive ? 'text-action' : 'text-secondary dark:text-dark-secondary'}`}
               >
                 <div className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-action/10 scale-110 shadow-inner' : 'hover:bg-surface dark:hover:bg-gray-800'}`}>
                   <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                 </div>
               </Link>
             )
           })}
        </div>

        {/* Full Mobile Overlay Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-dark-background animate-in fade-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-12">
                <h1 className="text-2xl font-heading font-black text-primary dark:text-dark-primary tracking-tighter">Command Center</h1>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-surface dark:bg-gray-800 text-secondary"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-5 p-5 rounded-3xl text-lg font-black transition-all ${
                        isActive 
                          ? 'bg-action text-white shadow-xl shadow-blue-500/30' 
                          : 'bg-surface dark:bg-gray-800 text-primary dark:text-dark-primary border border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      <item.icon size={28} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>

              <div className="mt-12 pt-12 border-t border-gray-100 dark:border-gray-700 space-y-4">
                 <button 
                   onClick={logout}
                   className="flex items-center justify-center gap-4 w-full p-5 rounded-3xl bg-red-50 dark:bg-red-900/10 text-red-600 font-black text-lg transition-all"
                 >
                   <LogOut size={24} />
                   Log Out
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
