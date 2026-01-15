import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Dashboard from '../pages/Dashboard';
import Habits from '../pages/Habits';
import Goals from '../pages/Goals';
import Journal from '../pages/Journal';
import Analytics from '../pages/Analytics';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Motivation from '../pages/Motivation';
import AdminPanel from '../pages/AdminPanel';

const KeepAlivePage = ({ active, preload, children }) => {
  const [hasBeenVisited, setHasBeenVisited] = useState(active || preload);
  
  useEffect(() => {
    if (active && !hasBeenVisited) {
      setHasBeenVisited(true);
    }
  }, [active, hasBeenVisited]);

  if (!hasBeenVisited) return null;

  return (
    <div className={`h-full ${active ? 'block animate-in fade-in duration-300' : 'hidden'}`}>
      {children}
    </div>
  );
};

export default function AuthenticatedStack() {
  const location = useLocation();
  const { user } = useAuth();
  const pathname = location.pathname;

  const isAdmin = user?.username?.toLowerCase() === import.meta.env.VITE_ADMIN_USERNAME?.toLowerCase();

  const pages = useMemo(() => [
    { path: '/dashboard', component: <Dashboard />, preload: true },
    { path: '/habits', component: <Habits />, preload: true },
    { path: '/goals', component: <Goals />, preload: true },
    { path: '/journal', component: <Journal />, preload: true },
    { path: '/analytics', component: <Analytics /> },
    { path: '/motivation', component: <Motivation /> },
    { path: '/profile', component: <Profile /> },
    { path: '/settings', component: <Settings /> },
    ...(isAdmin ? [{ path: '/admin', component: <AdminPanel /> }] : [])
  ], [isAdmin]);

  // Handle dynamic routes or unmapped routes by allowing the router to eventually handle them
  // but for the core stack, we keep them alive.
  const isCorePath = pages.some(p => pathname === p.path || (p.path === '/profile' && pathname.startsWith('/profile/')));

  return (
    <div className="h-full relative">
      {pages.map((page) => {
        // Special handling for profile to catch both /profile and /profile/:id
        const isActive = page.path === '/profile' 
          ? pathname.startsWith('/profile') 
          : pathname === page.path;

        return (
          <KeepAlivePage key={page.path} active={isActive} preload={page.preload}>
            {page.component}
          </KeepAlivePage>
        );
      })}
      
      {!isCorePath && (
        <div className="animate-in fade-in duration-300">
           {/* This handles any other routes that might be added later but aren't in the core stack */}
           <p className="text-secondary p-10 mt-20 text-center font-bold">Navigating to extended module...</p>
        </div>
      )}
    </div>
  );
}
