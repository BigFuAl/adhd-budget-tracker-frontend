import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async () => {
  setLoading(true);
    try {
    const res = await fetch("/api/auth/login", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
});

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name); // ✅ Save the user's name
      setMessage('Login successful!');
      setTimeout(() => setMessage(''), 3000);
      onLoginSuccess(data.user); // still update App state
      navigate('/dashboard');
    } else {
      setMessage(data.message || 'Login failed');
      setTimeout(() => setMessage(''), 3000);
    }
  } catch (err) {
    console.error('Login error:', err);
    setMessage('Something went wrong');
    setTimeout(() => setMessage(''), 3000);
  } finally {
    setLoading(false);
  }
};

  return (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
    <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <input
  type="email"
  autoFocus
  placeholder="Email"
  value={email}
  onChange={e => setEmail(e.target.value)}
  required
  className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
/>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
      />
      <button
  onClick={handleLogin}
  disabled={loading}
  className={`w-full py-2 rounded transition ${
    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
  } text-white`}
>
  {loading ? 'Logging in...' : 'Login'}
</button>
      {message && (
  <p
    className={`mt-4 text-center text-sm ${
      message.toLowerCase().includes('success') ? 'text-green-400' : 'text-red-400'
    }`}
  >
    {message}
  </p>
)}
    </div>
  </div>
);
};

export default Login;