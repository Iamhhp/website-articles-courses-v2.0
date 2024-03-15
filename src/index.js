import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import dataStore from './context/Redux/dataStore';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <UserDataContextProvider> */}
    <Provider store={dataStore}>
      <App />
    </Provider>
    {/* </UserDataContextProvider> */}
  </React.StrictMode>
);
