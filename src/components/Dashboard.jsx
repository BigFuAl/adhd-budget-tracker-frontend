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

const Dashboard = ({ user }) => {
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
  const formatCurrency = (value) => {
  return `$${parseFloat(value).toFixed(2)}`;
};

  const token = localStorage.getItem('token');

  // Fetch expenses on mount
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.REACT_APP_API_URL}/api/expenses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setExpenses(Array.isArray(data) ? data : []))
      .catch(err => console.error('Fetch error:', err))
  }, [token]);

  const handleAddExpense = async () => {
    if (!token) return setMessage('You must be logged in.');
    if (!description.trim() || !amount.trim()) {
      return setMessage('Please enter both a description and amount.');
    }

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/expenses`, {
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
    const confirmed = window.confirm('Are you sure you want to delete this expense?');
    if (!confirmed) return;

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/expenses/${id}`, {
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
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/expenses/${id}`, {
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

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome, {user.name}</h2>
      <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>

      <div>
        <h3>Add Expense</h3>
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" type="number" />
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category (optional)" />
        <button onClick={handleAddExpense}>Add</button>
        <div style={{ height: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
  {message && (
    <p style={{
      color: message.toLowerCase().includes('success') ? 'green' : 'red',
      fontWeight: 'bold',
      margin: 0
    }}>
      {message}
    </p>
  )}
  {showCheck && (
    <span style={{
      opacity: showCheck ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
      fontSize: '1.5rem',
      color: 'green'
    }}>
      ✅
    </span>
  )}
  </div>
</div>

      <h4>Total this month: ${getMonthlyTotal()}</h4>
      <div>
  <h4>Spending by Category</h4>
  <div style={{ marginTop: '20px' }}>
  <h4 style={{ marginBottom: '10px' }}>Spending by Category</h4>
  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
    {Object.entries(getCategoryBreakdown()).map(([cat, total]) => (
      <li key={cat} style={{ marginBottom: '4px' }}>
        <strong>{cat}:</strong> {formatCurrency(total)}
      </li>
    ))}
  </ul>
</div>
  
</div>

      <div>
        <h4>Filter by Category</h4>
       <select
  value={categoryFilter}
  onChange={e => setCategoryFilter(e.target.value)}
  style={{ marginTop: '10px', padding: '6px', borderRadius: '4px' }}
>
  <option value="">All Categories</option>
  {[...new Set(expenses.map(exp => exp.category?.trim() || 'Uncategorized'))]
    .sort((a, b) => a.localeCompare(b))
    .map(cat => (
      <option key={cat} value={cat}>{cat}</option>
  ))}
</select>
      </div>

      <div style={{ width: '100%', height: 300, marginTop: 20 }}>
        <ResponsiveContainer>
          <LineChart data={getMonthlyBreakdown()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {(() => {
  const filteredExpenses = expenses.filter(exp => {
    const cat = exp.category?.trim() || 'Uncategorized';
    return categoryFilter === '' || categoryFilter === cat;
  });

  if (filteredExpenses.length === 0) {
    return <p style={{ marginTop: '20px', color: '#888' }}>No expenses to show. Add your first one to get started 💸</p>;
  }

  return (
    <ul>
      {filteredExpenses.map(exp => (
        <li
          key={exp._id}
          style={{
            backgroundColor:
              editingId === exp._id ? '#eef6ff' :
              newlyAddedId === exp._id ? '#fff3cd' :
              isToday(exp.createdAt) ? '#d4edda' : 'transparent',
            padding: '10px',
            marginBottom: '6px',
            borderRadius: '6px'
          }}
        >
          {editingId === exp._id ? (
            <>
              <input value={editDescription} onChange={e => setEditDescription(e.target.value)} />
              <input value={editAmount} onChange={e => setEditAmount(e.target.value)} />
              <input value={editCategory} onChange={e => setEditCategory(e.target.value)} />
              <button onClick={() => handleUpdateExpense(exp._id)}>Save</button>
              <button onClick={cancelEditing}>Cancel</button>
            </>
          ) : (
            <>
              {exp.description} – {formatCurrency(exp.amount)}({exp.category || 'Uncategorized'})
              <button onClick={() => startEditing(exp)} style={{ marginLeft: 10 }}>Edit</button>
              <button onClick={() => handleDeleteExpense(exp._id)} style={{ marginLeft: 10, color: 'red' }}>Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
})()}    

</div>
  );
};

export default Dashboard;