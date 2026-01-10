import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Verify() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verify } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await verify(email, code);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Verification failed');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post('/auth/resend-code', { email });
      alert('Verification code resent!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to resend code');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background dark:bg-dark-background">
      <div className="w-full max-w-md space-y-8 p-10 bg-white dark:bg-dark-surface rounded-xl shadow-soft dark:shadow-soft-dark border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="mt-6 text-3xl font-heading font-bold text-primary dark:text-dark-primary">Verify Your Email</h2>
          <p className="mt-2 text-sm text-secondary dark:text-dark-secondary">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-center text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">{error}</div>}
          <div>
            <input
              type="text"
              required
              maxLength={6}
              className="relative block w-full rounded-md border-0 py-3 px-3 text-center text-2xl font-bold tracking-widest text-primary dark:text-dark-primary bg-surface dark:bg-dark-background ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-action sm:leading-6"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="group relative flex w-full justify-center rounded-md bg-primary dark:bg-action px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-action hover:text-blue-500 font-medium"
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
