import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ loginId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(formData.loginId, formData.password);
      navigate('/dashboard');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.needsVerification) {
        navigate('/verify', { state: { email: formData.loginId } });
      } else {
        setError(errorData?.msg || 'Login failed');
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background dark:bg-dark-background transition-colors">
      <div className="w-full max-w-md space-y-8 p-10 bg-white dark:bg-dark-surface rounded-xl shadow-soft dark:shadow-soft-dark border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-heading font-bold text-primary dark:text-dark-primary">Sign in to your account</h2>
          <p className="mt-2 text-sm text-secondary dark:text-dark-secondary">
            Or <Link to="/register" className="font-medium text-action hover:text-blue-500">start your journey today</Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-center text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">{error}</div>}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <input
                type="text"
                required
                className="relative block w-full rounded-md border-0 py-2.5 px-3 text-primary dark:text-dark-primary bg-white dark:bg-dark-background ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-action sm:text-sm sm:leading-6"
                placeholder="Email or Username"
                value={formData.loginId}
                onChange={(e) => setFormData({...formData, loginId: e.target.value})}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="relative block w-full rounded-md border-0 py-2.5 px-3 text-primary dark:text-dark-primary bg-white dark:bg-dark-background ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-action sm:text-sm sm:leading-6"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link to="/forgot-password" className="text-sm font-medium text-action hover:text-blue-500">
              Forgot your password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-primary dark:bg-action px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
