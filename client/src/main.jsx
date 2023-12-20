import './index.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from "react-router-dom";
// createStore is depreciated but still works
import { createStore } from "redux";
import { Provider } from "react-redux";
import myReducers from "./context/reducers"

const myStore = createStore(
    myReducers, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Provider store={myStore}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>,
)
