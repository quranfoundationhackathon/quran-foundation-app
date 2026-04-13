import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './performance.css'; // Load performance optimizations first
import './transitions.css'; // Page transition animations
import './index.css';
import './search-enhancements.css'; // Search UI enhancements
import './search-animations.css'; // Advanced search animations

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
