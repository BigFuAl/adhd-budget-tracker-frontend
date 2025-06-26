import React, { useEffect, useState } from 'react';

const Dashboard = ({ user }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [expenses, setExpenses] = useState([]); // 🧠 New: list of expenses
  const [loading, setLoading] = useState(true); // 🛠️ Missing piece
  const token = localStorage.getItem('token');
  const [editingId, setEditingId] = useState(null); // tracks the expense being edited
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // 🧠 Fetch expenses when component mounts
  useEffect(() => {
  if (!token) return;

  fetch(`${process.env.REACT_APP_API_URL}/api/expenses`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => setExpenses(data))
    .catch(err => console.error('Error fetching expenses:', err))
    .finally(() => setLoading(false));
}, [token]);

  const handleAddExpense = async () => {
    if (!token) {
      setMessage('You must be logged in.');
      return;
    }

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ description: title, amount, category })
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Expense added successfully!');
      setTitle('');
      setAmount('');
      setCategory('');
      setExpenses(prev => [data, ...prev]); // 🧠 Add new expense to UI
    } else {
      setMessage(data.message || 'Error adding expense');
    }
  };
  const handleDeleteExpense = async (id) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/expenses/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (res.ok) {
    setExpenses(prev => prev.filter(exp => exp._id !== id));
    setMessage('Expense deleted');
  } else {
    setMessage(data.message || 'Failed to delete');
  }
};

// 🧠 These should be OUTSIDE handleDeleteExpense:
const startEditing = (expense) => {
  setEditingId(expense._id);
  setEditTitle(expense.description);
  setEditAmount(expense.amount);
  setEditCategory(expense.category || '');
};

const cancelEditing = () => {
  setEditingId(null);
  setEditTitle('');
  setEditAmount('');
  setEditCategory('');
};

const handleUpdateExpense = async (id) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/expenses/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
  description: editTitle,
  amount: editAmount,
  category: editCategory
})
  });

  const data = await res.json();

  if (res.ok) {
    setExpenses(prev =>
      prev.map(exp => exp._id === id ? data : exp)
    );
    cancelEditing();
    setMessage('Expense updated!');
  } else {
    setMessage(data.message || 'Failed to update');
  }
}; // ✅ closes handleUpdateExpense ONLY — not the whole component

const getMonthlyTotal = () => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const monthlyExpenses = expenses.filter(exp => {
    const date = new Date(exp.createdAt);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });

  const total = monthlyExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  return total.toFixed(2);
};

return (
  <div style={{ marginTop: '20px' }}>
    <h2>Dashboard</h2>
    <p>Welcome, {user.name} 👋</p>

    <div style={{ marginTop: '15px' }}>
      <h3>Add Expense</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category (optional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={handleAddExpense}>Add Expense</button>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>

    <div style={{ marginTop: '30px' }}>
      <h3>Your Expenses</h3>
      <p><strong>Total this month:</strong> ${getMonthlyTotal()}</p>
{loading ? (
  <p>Loading your expenses...</p>
) : expenses.length === 0 ? (
  <p>No expenses yet.</p>
) : (
  <ul>
    {expenses.map(expense => (
      <li key={expense._id}>
        {editingId === expense._id ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <input
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
            />
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            />
            <button onClick={() => handleUpdateExpense(expense._id)}>Save</button>
            <button onClick={cancelEditing} style={{ marginLeft: '5px' }}>
              Cancel
            </button>
          </>
        ) : (
          <>
            {expense.description} — ${parseFloat(expense.amount).toFixed(2)} ({expense.category || 'Uncategorized'})
            <button
              onClick={() => startEditing(expense)}
              style={{ marginLeft: '10px' }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteExpense(expense._id)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Delete
            </button>
          </>
        )}
      </li>
    ))}
  </ul>
)}
    </div>
  </div>
); // ✅ closes return()

}; // ✅ closes Dashboard function

export default Dashboard;