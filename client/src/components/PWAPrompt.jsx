import { useRegisterSW } from 'virtual:pwa-register/react';
import { X, RefreshCw, Smartphone } from 'lucide-react';

export default function PWAPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[200] md:left-auto md:right-8 md:bottom-8 md:w-96 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white dark:bg-dark-surface p-6 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-xl bg-white/90 dark:bg-dark-surface/90">
         <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-action/10 rounded-2xl flex items-center justify-center text-action shrink-0">
               {needRefresh ? <RefreshCw className="animate-spin-slow" size={24} /> : <Smartphone size={24} />}
            </div>
            <div className="flex-1">
               <h3 className="text-lg font-heading font-black text-primary dark:text-dark-primary">
                  {needRefresh ? 'Update Available' : 'Ready for Offline'}
               </h3>
               <p className="text-sm text-secondary dark:text-dark-secondary font-medium leading-relaxed mt-1">
                  {needRefresh 
                    ? 'A new version is ready to deploy. Upgrade now for the latest refinements.' 
                    : 'Progress has been secured for offline use. You can now access it anywhere.'}
               </p>
               
               <div className="flex gap-3 mt-4">
                  {needRefresh && (
                    <button 
                      onClick={() => updateServiceWorker(true)}
                      className="flex-1 px-6 py-3 bg-action text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Update Now
                    </button>
                  )}
                  <button 
                    onClick={close}
                    className="flex-1 px-6 py-3 bg-gray-50 dark:bg-gray-800 text-primary dark:text-dark-primary rounded-xl font-black uppercase tracking-widest text-[10px] border border-gray-100 dark:border-gray-700 hover:bg-gray-100 transition-all"
                  >
                    {needRefresh ? 'Later' : 'Dismiss'}
                  </button>
               </div>
            </div>
            <button onClick={close} className="p-2 text-secondary hover:text-primary transition-all">
               <X size={18} />
            </button>
         </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
