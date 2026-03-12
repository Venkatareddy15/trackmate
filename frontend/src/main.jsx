import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '652585055664-ctj6qs8hm54lt95j6ke9p4s9e0m2qc8i.apps.googleusercontent.com';
console.log('TrackMate Initializing with Client ID:', clientId ? 'CONNECTED' : 'MISSING');

if (!clientId) {
    console.error('ERROR: VITE_GOOGLE_CLIENT_ID is not set in environment variables');
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <Router>
                <App />
            </Router>
        </GoogleOAuthProvider>
    </React.StrictMode>,
)
