import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <Link to="/" className="text-white font-bold text-xl">BudgetTracker</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <span className="text-gray-300">Hello, {user.name}</span>
            <button
              onClick={onLogout}
              className="text-white hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
            <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
