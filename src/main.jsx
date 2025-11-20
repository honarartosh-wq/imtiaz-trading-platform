import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext'
import './index.css'

// Initialize mobile app if running on Capacitor
import { initializeMobileApp, isCapacitor } from './utils/capacitor'

// Initialize mobile features
if (isCapacitor()) {
  initializeMobileApp().then(() => {
    console.log('✓ Mobile app initialized');
  }).catch(error => {
    console.error('✗ Failed to initialize mobile app:', error);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>,
)
