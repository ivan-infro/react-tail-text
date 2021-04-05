// Для поддержки старых браузеров подключаем полифилл Intersection Observer
// Т.к. Resizer Observer поддерживает меньшее количество браузеров, он встроен прямо в пакет с компонентом react-tail-text
import 'intersection-observer';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
