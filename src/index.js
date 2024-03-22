import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import dataStore from './context/Redux/dataStore';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <UserDataContextProvider> */}
    <Provider store={dataStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
    {/* </UserDataContextProvider> */}
  </React.StrictMode>
);
