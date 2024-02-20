import React from 'react'
import ReactDOM from 'react-dom/client'
import Landing from './components/landing/Landing'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import CreateRoom from './components/createRoom/CreateRoom';
import JoinRoom from './components/joinRoom/JoinRoom';
import PageNotFound from './components/pageNotFound/PageNotFound';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/createRoom" element={<CreateRoom />} />
        <Route path="/joinRoom" element={<JoinRoom />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
