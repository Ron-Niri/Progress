import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/register', formData);
      // Redirect to verification page
      navigate('/verify', { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background dark:bg-dark-background transition-colors">
      <div className="w-full max-w-md space-y-8 p-10 bg-white dark:bg-dark-surface rounded-xl shadow-soft dark:shadow-soft-dark border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-heading font-bold text-primary dark:text-dark-primary">Create your account</h2>
           <p className="mt-2 text-sm text-secondary dark:text-dark-secondary">
            Already have an account? <Link to="/login" className="font-medium text-action hover:text-blue-500">Sign in</Link>
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
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <input
                type="email"
                required
                className="relative block w-full rounded-md border-0 py-2.5 px-3 text-primary dark:text-dark-primary bg-white dark:bg-dark-background ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-action sm:text-sm sm:leading-6"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <input
                type="password"
                required
                minLength={6}
                className="relative block w-full rounded-md border-0 py-2.5 px-3 text-primary dark:text-dark-primary bg-white dark:bg-dark-background ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-action sm:text-sm sm:leading-6"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-primary dark:bg-action px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
