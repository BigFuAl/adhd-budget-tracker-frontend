import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';

const Profile = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.REACT_APP_API_URL}/api/profile`,  {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Profile data:', data);
        setMessage(data.message);
        setUser(data.user);
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
        setMessage('Error fetching profile');
      });
  }, [token]);

  return (
  <div>
    <h2>Profile Page</h2>
    <p>{message}</p>

    {user && (
      <>
        <div style={{ marginTop: '10px' }}>
          <strong>User Info:</strong>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>

        <Dashboard user={user} />
      </>
    )}
  </div>
  );
};

export default Profile;