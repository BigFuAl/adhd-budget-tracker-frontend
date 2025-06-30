import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate
} from 'react-router-dom';

import Login     from './components/Login.jsx';
import Register  from './components/Register.jsx';
import Profile   from './components/Profile.jsx';
import Dashboard from './components/Dashboard.jsx';

// A simple navbar with logout
function Navbar({ user, onLogout }) {
  return (
    <nav style={{
      display:        'flex',
      justifyContent: 'space-between',
      padding:        '10px 20px',
      borderBottom:   '1px solid #ddd'
    }}>
      <Link to="/" style={{ fontWeight: 'bold' }}>BudgetTracker</Link>
      {user && (
        <div>
          Hello, {user.name}{' '}
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const navigate        = useNavigate();

  // On mount, restore from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const name  = localStorage.getItem('userName');
    if (token && name) {
      setUser({ name });
    }
  }, []);

  const handleLoginSuccess = ({ token, name }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', name);
    setUser({ name });
    navigate('/dashboard', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/dashboard"
          element={user
            ? <Dashboard user={user} />
            : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/profile"
          element={user
            ? <Profile />
            : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/"
          element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
        />
      </Routes>
    </>
  );
}

export default App;