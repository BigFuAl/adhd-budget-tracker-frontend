// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login     from './components/Login.jsx';
import Register  from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import Profile   from './components/Profile.jsx';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/"         element={<Login onLoginSuccess={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/profile"   element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;