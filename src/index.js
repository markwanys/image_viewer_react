import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Test } from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const test = ReactDOM.createRoot(document.getElementById('test'));
test.render(
  // <React.StrictMode>
    <Test />
  // </React.StrictMode>
);