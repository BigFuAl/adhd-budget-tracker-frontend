// src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [message, setMessage] = useState('');
  const [user, setUser]       = useState(null);
  const navigate             = useNavigate();
  const token                = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/'); // no token → back to login

    fetch('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => {
        setMessage(data.message || '');
        setUser(data.user || null);
      })
      .catch(err => {
        console.error('Profile fetch error:', err);
        setMessage('Could not load profile');
      });
  }, [token, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-6">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
        {message && <p className="mb-4 text-center">{message}</p>}
        {user && (
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}