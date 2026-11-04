import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Registro de Service Worker para capacidades Offline PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] ServiceWorker registrado con éxito: ', registration.scope);
      })
      .catch((error) => {
        console.error('[PWA] Error al registrar ServiceWorker: ', error);
      });
  });
} else if ('serviceWorker' in navigator) {
  // También registrar en desarrollo si se desea probar offline
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
