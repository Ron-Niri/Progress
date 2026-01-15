import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(window.location.hostname) || 
             window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1';

const isStandalone = window.navigator.standalone || 
                    window.matchMedia('(display-mode: standalone)').matches;

// If accessing via IP AND not in PWA mode, we enter "Dev Mode": unregister service workers
if (isIP && !isStandalone && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
