import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [newlyAddedId, setNewlyAddedId] = useState(null);
  const [showCheck, setShowCheck] = useState(false);

  const token = localStorage.getItem('token');

  const formatCurrency = (value) => `$${parseFloat(value).toFixed(2)}`;

  useEffect(() => {
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data.user || null))
      .catch(err => console.error('User fetch error:', err));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setExpenses(Array.isArray(data) ? data : []))
      .catch(err => console.error('Fetch error:', err));
  }, [token]);

  const handleAddExpense = async () => {
    if (!description.trim() || !amount.trim()) {
      return setMessage('Please enter both a description and amount.');
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ description, amount, category })
    });

    const data = await res.json();
    if (res.ok) {
      setExpenses(prev => [data, ...prev]);
      setNewlyAddedId(data._id);
      setTimeout(() => setNewlyAddedId(null), 3000);
      setDescription('');
      setAmount('');
      setCategory('');
      setMessage('Expense added successfully!');
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 2000);
    } else {
      setMessage(data.message || 'Error adding expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    console.log('🧨 ID being sent to delete:', id);
    const confirmed = window.confirm('Are you sure you want to delete this expense?');
    if (!confirmed) return;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (res.ok) {
      setExpenses(prev => prev.filter(exp => exp._id !== id));
      setMessage('Expense deleted');
    } else {
      setMessage(data.message || 'Failed to delete');
    }
  };

  const startEditing = (expense) => {
    setEditingId(expense._id);
    setEditDescription(expense.description);
    setEditAmount(expense.amount);
    setEditCategory(expense.category || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditDescription('');
    setEditAmount('');
    setEditCategory('');
    setMessage('Edit canceled');
  };

  const handleUpdateExpense = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        description: editDescription,
        amount: editAmount,
        category: editCategory
      })
    });

    const data = await res.json();
    if (res.ok) {
      setExpenses(prev => prev.map(exp => (exp._id === id ? data : exp)));
      cancelEditing();
      setMessage('Expense updated!');
    } else {
      setMessage(data.message || 'Failed to update');
    }
  };

  const getMonthlyTotal = () => {
    const now = new Date();
    return formatCurrency(
      expenses
        .filter(exp => {
          const date = new Date(exp.createdAt);
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        })
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
    );
  };

  const getCategoryBreakdown = () => {
    const now = new Date();
    const filtered = expenses.filter(exp => {
      const date = new Date(exp.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const totals = {};
    filtered.forEach(exp => {
      const cat = exp.category?.trim() || 'Uncategorized';
      totals[cat] = (totals[cat] || 0) + parseFloat(exp.amount);
    });

    return totals;
  };

  const getMonthlyBreakdown = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${months[date.getMonth()]} ${date.getFullYear()}`;
      const total = expenses
        .filter(exp => {
          const d = new Date(exp.createdAt);
          return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
        })
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      return { name: label, total: parseFloat(total.toFixed(2)) };
    }).reverse();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const filteredExpenses = expenses.filter(exp => {
    const cat = exp.category?.trim() || 'Uncategorized';
    return categoryFilter === '' || categoryFilter === cat;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Welcome, {user?.name}</h2>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">Logout</button>
        </div>

        <div className="mb-6 space-y-3">
          <h3 className="text-lg font-medium">Add Expense</h3>
          <div className="flex gap-2 flex-wrap">
            <input className="p-2 rounded bg-gray-800 border border-gray-700 text-sm" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
            <input className="p-2 rounded bg-gray-800 border border-gray-700 text-sm" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" type="number" />
            <input className="p-2 rounded bg-gray-800 border border-gray-700 text-sm" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category (optional)" />
            <button onClick={handleAddExpense} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded">Add</button>
          </div>

          <div className="flex items-center gap-2 text-sm h-6">
            {message && (
              <span className={message.toLowerCase().includes('success') ? 'text-green-400' : 'text-red-400'}>
                {message}
              </span>
            )}
            {showCheck && <span className="text-green-500 text-xl">✅</span>}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-1">Total this month: {getMonthlyTotal()}</h4>
          <h4 className="font-semibold mb-2">Spending by Category</h4>
          <ul className="space-y-1 text-sm">
            {Object.entries(getCategoryBreakdown()).map(([cat, total]) => (
              <li key={cat}>
                <strong>{cat}:</strong> {formatCurrency(total)}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Filter by Category:</label>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="p-2 bg-gray-800 text-white rounded border border-gray-700"
          >
            <option value="">All Categories</option>
            {[...new Set(expenses.map(exp => exp.category?.trim() || 'Uncategorized'))]
              .sort((a, b) => a.localeCompare(b))
              .map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
          </select>
        </div>

        <div className="mb-6" style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={getMonthlyBreakdown()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#38bdf8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {filteredExpenses.length === 0 ? (
            <p className="text-gray-400">No expenses to show. Add your first one to get started 💸</p>
          ) : (
            filteredExpenses.map(exp => (
              <div key={exp._id} className={`p-3 rounded ${editingId === exp._id ? 'bg-blue-950' : newlyAddedId === exp._id ? 'bg-yellow-900' : 'bg-gray-800'}`}>
                {editingId === exp._id ? (
                  <div className="space-y-2">
                    <input value={editDescription} onChange={e => setEditDescription(e.target.value)} className="bg-gray-700 p-1 rounded w-full" />
                    <input value={editAmount} onChange={e => setEditAmount(e.target.value)} className="bg-gray-700 p-1 rounded w-full" />
                    <input value={editCategory} onChange={e => setEditCategory(e.target.value)} className="bg-gray-700 p-1 rounded w-full" />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateExpense(exp._id)} className="bg-green-600 px-3 py-1 rounded">Save</button>
                      <button onClick={cancelEditing} className="bg-gray-600 px-3 py-1 rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-sm">
                    <span>{exp.description} – {formatCurrency(exp.amount)} ({exp.category || 'Uncategorized'})</span>
                    <div className="space-x-2">
                      <button onClick={() => startEditing(exp)} className="text-blue-400 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteExpense(exp._id)} className="text-red-400 hover:underline">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;