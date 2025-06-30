import React, { useEffect, useState } from 'react'

export default function Profile() {
  const [ message, setMessage ] = useState('')
  const [ user, setUser ]       = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      return setMessage('No token found – please log in.')
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json()
      })
      .then(data => {
        setMessage(data.message)
        setUser(data.user)
      })
      .catch(err => {
        console.error('Profile fetch failed:', err)
        setMessage('Error fetching profile')
      })
  }, [])

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <h2>Your Profile</h2>
      <p>{message}</p>
      {user && (
        <div style={{ textAlign: 'left', lineHeight: 1.6 }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  )
}