import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle2, AlertCircle, Loader2, Target, Users } from 'lucide-react';

export default function AcceptInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [error, setError] = useState('');
  const [goalTitle, setGoalTitle] = useState('');

  useEffect(() => {
    const acceptCollaboration = async () => {
      try {
        const res = await api.post(`/goals/accept/${token}`);
        setStatus('success');
        // Optional: wait a few seconds and then navigate
        setTimeout(() => navigate('/goals'), 3000);
      } catch (err) {
        setStatus('error');
        setError(err.response?.data?.msg || 'Failed to accept invitation. It may be expired or invalid.');
      }
    };

    if (token) {
      acceptCollaboration();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-dark-surface p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 text-center space-y-8 animate-in zoom-in-95 duration-500">
        
        {status === 'loading' && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-action/10 rounded-3xl flex items-center justify-center mx-auto relative">
              <Loader2 className="animate-spin text-action" size={40} />
              <Users className="absolute inset-0 m-auto text-action opacity-50" size={20} />
            </div>
            <h2 className="text-3xl font-heading font-black text-primary dark:text-dark-primary">Synchronizing...</h2>
            <p className="text-secondary dark:text-dark-secondary font-medium">Validating your invitation and joining the mission.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-green-500" size={40} />
            </div>
            <h2 className="text-3xl font-heading font-black text-primary dark:text-dark-primary">Welcome Aboard!</h2>
            <p className="text-secondary dark:text-dark-secondary font-medium">Invitation accepted. You are now a collaborator on this goal.</p>
            <div className="bg-surface dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 text-left">
              <div className="p-2 bg-action/10 rounded-xl text-action"><Target size={20} /></div>
              <p className="text-sm font-bold text-primary dark:text-dark-primary">Goal has been added to your dashboard.</p>
            </div>
            <button 
              onClick={() => navigate('/goals')}
              className="w-full py-4 bg-primary dark:bg-action text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
            >
              Go to Goals
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto">
              <AlertCircle className="text-red-500" size={40} />
            </div>
            <h2 className="text-3xl font-heading font-black text-primary dark:text-dark-primary">Link Compromised</h2>
            <p className="text-secondary dark:text-dark-secondary font-medium">{error}</p>
            <button 
              onClick={() => navigate('/goals')}
              className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-primary dark:text-dark-primary rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-gray-200"
            >
              Back to Safety
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
