import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔑 token is:', token);

    if (!token) {
      setMessage('No token found – please log in.');
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log('fetch /api/auth/profile status', res.status);
        return res.json();
      })
      .then(data => {
        console.log('profile data→', data);
        setMessage(data.message);
        setUser(data.user);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        setMessage('Error fetching profile');
      });
  }, []);

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
    </div>
  );
};

export default Profile;