import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // ✅ loading state added

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
  setMessage('✅ Registered successfully!');
  setFormData({ name: '', email: '', password: '' }); // ✅ clear form
  setTimeout(() => {
    navigate('/login'); // ✅ redirect after 2s
  }, 2000);

      } else {
        setMessage(data.message || '❌ Registration failed.');
      }
    } catch (err) {
      setMessage('❌ Server error. Please try again later.');
    }
    setLoading(false); // stop loading
  };

  return (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
    <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
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

export default Register;