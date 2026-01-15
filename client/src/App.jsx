import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressDataProvider } from './context/ProgressContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Goals from './pages/Goals';
import Journal from './pages/Journal';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Motivation from './pages/Motivation';
import AdminPanel from './pages/AdminPanel';
import AcceptInvite from './pages/AcceptInvite';
import Layout from './components/Layout';
import PWAPrompt from './components/PWAPrompt';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import AuthenticatedStack from './components/AuthenticatedStack';

// Wrapper for protected routes to enforce authentication and layout
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="text-secondary dark:text-dark-secondary">Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <AuthenticatedStack />
    </Layout>
  );
};

const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(window.location.hostname) || 
             window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ProgressDataProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} />
              
              <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<AuthenticatedStack />} />
                  <Route path="/habits" element={<AuthenticatedStack />} />
                  <Route path="/goals" element={<AuthenticatedStack />} />
                  <Route path="/journal" element={<AuthenticatedStack />} />
                  <Route path="/analytics" element={<AuthenticatedStack />} />
                  <Route path="/motivation" element={<AuthenticatedStack />} />
                  <Route path="/profile" element={<AuthenticatedStack />} />
                  <Route path="/profile/:userId" element={<AuthenticatedStack />} />
                  <Route path="/settings" element={<AuthenticatedStack />} />
                  <Route path="/admin" element={<AuthenticatedStack />} />
                  <Route path="/goals/accept/:token" element={<AcceptInvite />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Suppress PWA prompt on IP to prevent caching friction during development */}
            {!isIP && (
              <>
                <PWAPrompt />
                <PWAInstallPrompt />
              </>
            )}
            
            {/* Subtle Dev Mode Indicator for IP access */}
            {isIP && (
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[300] pointer-events-none">
                 <div className="px-3 py-1 bg-black/80 backdrop-blur-md text-[8px] font-black text-white/50 rounded-full border border-white/10 uppercase tracking-[3px]">
                    IP / Dev Mode • No Cache
                 </div>
              </div>
            )}
          </ProgressDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
