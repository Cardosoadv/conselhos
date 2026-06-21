import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Importando Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importando CSS base (do projeto admin Vue)
import './assets/css/style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
