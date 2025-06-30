import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        setUser(data.user);
      })
      .catch(() => setMessage('Error fetching profile'));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile Page</h2>
        <p className="text-center text-sm mb-4">{message}</p>

        {user && (
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;