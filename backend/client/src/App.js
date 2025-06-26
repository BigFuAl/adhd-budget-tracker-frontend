import React from 'react';
import AuthForm from './components/AuthForm';
import Profile from './components/Profile';

function App() {
  return (
    <div>
      <h1>ADHD Budget Tracker</h1>
      <AuthForm />
      <Profile />
    </div>
  );
}

export default App;