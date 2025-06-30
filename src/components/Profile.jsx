import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        setUser(data.user);
      })
      .catch(() => setMessage('Error fetching profile'));
  }, [token]);

  return (
    <div style={{
      padding: '20px',
      maxWidth: '400px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '1rem' }}>Your Profile</h2>
      <p style={{ marginBottom: '1rem', color: '#555' }}>{message}</p>
      {user && (
        <div style={{ textAlign: 'left', lineHeight: 1.6 }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      {/* Logout is now only in the Navbar */}
    </div>
  );
};

export default Profile;