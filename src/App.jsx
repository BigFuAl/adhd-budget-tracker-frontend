import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Navbar   from './components/Navbar.jsx'
import Login    from './components/Login.jsx'
import Register from './components/Register.jsx'
import Dashboard from './components/Dashboard.jsx'
import Profile  from './components/Profile.jsx'

export default function App() {
  const [user, setUser]   = useState(null)
  const [loading, setLoading] = useState(true)

  // on mount, restore login state
  useEffect(() => {
    const token = localStorage.getItem('token')
    const name  = localStorage.getItem('userName')
    if (token && name) setUser({ name })
    setLoading(false)
  }, [])

  const onLoginSuccess = ({ token, name }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userName', name)
    setUser({ name })
  }

  const onLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    setUser(null)
  }

  if (loading) return null

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />

      <Routes>
        <Route path="/login"    element={<Login onLoginSuccess={onLoginSuccess}/>} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user}/> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
        />
      </Routes>
    </>
  )
}