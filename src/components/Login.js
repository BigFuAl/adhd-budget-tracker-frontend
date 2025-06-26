import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleLogin = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name); // ✅ Save the user's name
      setMessage('Login successful!');
      onLoginSuccess(data.user); // still update App state
      navigate('/dashboard');
    } else {
      setMessage(data.message || 'Login failed');
    }
  } catch (err) {
    console.error('Login error:', err);
    setMessage('Something went wrong');
  }
};

  return (
    <div>
      <h2>Login</h2>
      <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={e => setEmail(e.target.value)}
  required
/>
<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={e => setPassword(e.target.value)}
  required
/>
      <button onClick={handleLogin}>Login</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;