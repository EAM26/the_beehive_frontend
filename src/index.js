import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthContextProvider from "./context/AuthContext";
import LocaleContextProvider from "./context/LocaleContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <LocaleContextProvider>
            <AuthContextProvider>
                <App/>
            </AuthContextProvider>
        </LocaleContextProvider>
    </Router>
);
