import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { applyThemeToDocument, getInitialTheme } from './hooks/useTheme.ts';
import './index.css';

declare const __APP_CACHE_VERSION__: string;

applyThemeToDocument(getInitialTheme());

registerSW({
  immediate: true,
  onNeedRefresh() {
    // Auto-update activates new service worker immediately via skipWaiting + clientsClaim
  },
  onOfflineReady() {
    // App shell and assets cached for offline use
  },
  onRegisteredSW(_swUrl, registration) {
    if (registration) {
      setInterval(() => {
        registration.update().catch(() => {});
      }, 30 * 60 * 1000);
    }
  },
});

if (typeof __APP_CACHE_VERSION__ === 'string') {
  document.documentElement.dataset.cacheVersion = __APP_CACHE_VERSION__;
}

createRoot(document.getElementById('root')!).render(<App />);
