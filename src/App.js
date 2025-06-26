import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    return token && name ? { name } : null;
  });

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/profile"
          element={
            user ? <Profile user={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/"
          element={<Navigate to={user ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </Router>
  );
}

export default App;