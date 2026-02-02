import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Suppress expected Base44 SDK errors (auth_required, workspace restrictions)
const originalError = console.error;
const originalWarn = console.warn;

console.error = function(...args) {
  const message = args[0]?.toString() || '';
  
  // Suppress expected Base44 auth/workspace errors
  if (message.includes('[Base44 SDK Error]') || 
      message.includes('auth_required') ||
      message.includes('workspace members') ||
      message.includes('App state check failed')) {
    return; // Silently ignore these expected errors
  }
  
  originalError.apply(console, args);
};

console.warn = function(...args) {
  const message = args[0]?.toString() || '';
  
  // Suppress expected errors
  if (message.includes('Base44') || message.includes('auth_required')) {
    return;
  }
  
  originalWarn.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
