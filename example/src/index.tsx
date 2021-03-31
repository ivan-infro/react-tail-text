// Для поддержки старых браузеров подключаем полифилл Intersection Observer
// Т.к. Resizer Observer поддерживает меньшее количество браузеров, он встроен прямо в пакет с компонентом react-tail-text
import 'intersection-observer';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
