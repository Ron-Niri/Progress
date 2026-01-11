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
    <div className="min-h-screen bg-background dark:bg-dark-background flex transition-colors overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="w-72 bg-white dark:bg-dark-surface border-r border-gray-100 dark:border-gray-700 hidden lg:flex flex-col transition-colors">
        <div className="p-8">
          <Logo />
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
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

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 space-y-3">
           <button 
             onClick={toggleDarkMode}
             className="flex items-center gap-4 w-full px-4 py-3.5 text-sm font-bold text-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-dark-primary hover:bg-surface dark:hover:bg-gray-800 rounded-2xl transition-all"
           >
             <div className="w-8 h-8 rounded-full bg-surface dark:bg-gray-800 flex items-center justify-center">
               {darkMode ? <Sun size={18} className="text-orange-400" /> : <Moon size={18} className="text-blue-500" />}
             </div>
             {darkMode ? 'Light Theme' : 'Dark Theme'}
           </button>
           <button 
             onClick={logout}
             className="flex items-center gap-4 w-full px-4 py-3.5 text-sm font-bold text-secondary dark:text-dark-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
           >
             <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
               <LogOut size={18} className="text-red-500" />
             </div>
             Sign out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Mini Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 px-4 pt-[env(safe-area-inset-top,1rem)] pb-4 flex items-center justify-between">
            <Logo className="scale-90 origin-left" />
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-surface dark:bg-gray-800 text-primary dark:text-dark-primary"
              >
                {darkMode ? <Sun size={20} className="text-orange-400" /> : <Moon size={20} className="text-blue-500" />}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 rounded-xl bg-primary dark:bg-action text-white shadow-lg"
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
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-700 px-6 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] md:pb-3 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
           {navigation.slice(0, 5).map((item) => {
             const isActive = location.pathname === item.href;
             return (
               <Link
                 key={item.name}
                 to={item.href}
                 className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-action' : 'text-secondary dark:text-dark-secondary'}`}
               >
                 <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-action/10 scale-110' : ''}`}>
                   <item.icon size={22} strokeWidth={isActive ? 3 : 2} />
                 </div>
                 <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-50'}`}>{item.name.substring(0, 5)}</span>
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
