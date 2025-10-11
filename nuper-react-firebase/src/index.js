import React from 'react';
import ReactDOM from 'react-dom/client'; // Eğer React 18+ kullanıyorsanız bu
// import ReactDOM from 'react-dom'; // Eğer React 17 veya altı kullanıyorsanız bu

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// React 17 veya altı
/*
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();