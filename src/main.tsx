import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeFirebase } from './firebase';

initializeFirebase();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
