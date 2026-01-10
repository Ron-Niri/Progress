import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckCircle, Target, BookOpen, BarChart2, Settings, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const { logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Habits', href: '/habits', icon: CheckCircle },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-heading font-bold text-primary">Progress.</h1>
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
                    ? 'bg-surface text-primary' 
                    : 'text-secondary hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-action' : 'text-secondary'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
           <button 
             onClick={logout}
             className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-secondary hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
           >
             <LogOut size={18} />
             Sign out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden border-b border-gray-100 bg-white p-4 flex items-center justify-between">
           <h1 className="text-lg font-heading font-bold text-primary">Progress.</h1>
           <button onClick={logout} className="text-sm text-secondary">Sign Out</button>
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
