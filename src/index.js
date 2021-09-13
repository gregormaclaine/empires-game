import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as socket from './socket';
import store from './store';
import { Provider } from 'react-redux';

socket.initialise();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
