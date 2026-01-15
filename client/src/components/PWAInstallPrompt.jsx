import { useState, useEffect } from 'react';
import { Smartphone, X, Download } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const standalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
      
      // Only show if not already standalone and we haven't dismissed it this session
      if (!standalone && !sessionStorage.getItem('pwa-prompt-dismissed')) {
        // Delay appearance for better UX
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    
    setIsVisible(false);
    installPrompt.prompt();
    
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-[150] md:left-auto md:right-8 md:top-24 md:w-80 animate-in slide-in-from-top-10 duration-700">
      <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl p-5 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
        <div className="w-12 h-12 bg-action/10 rounded-2xl flex items-center justify-center text-action shrink-0 shadow-inner">
          <Smartphone size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-black text-primary dark:text-dark-primary uppercase tracking-tight">Focus Protocol</h4>
          <p className="text-[11px] text-secondary dark:text-dark-secondary font-medium leading-tight mt-0.5">
            Install <span className="text-action font-bold">Progress.</span> for a distraction-free experience.
          </p>
        </div>

        <div className="flex flex-col gap-1.5 shrink-0">
          <button 
            onClick={handleInstall}
            className="p-2 bg-action text-white rounded-xl shadow-lg shadow-blue-500/20 hover:scale-110 active:scale-90 transition-all"
            title="Install App"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={handleDismiss}
            className="p-2 text-secondary hover:text-primary dark:hover:text-white transition-all"
            title="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
