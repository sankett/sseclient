import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Approach1 from './Approach1';
import Approach2 from './Approach2';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <div>

<div style={{float: "left", width:"49%", border:"1px whitesmoke black"}}>

    <Approach1 /></div>
    <div style={{float: "left", width:"49%", border:"1px whitesmoke black"}}>

    <Approach2 /></div>
    </div>
 // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
