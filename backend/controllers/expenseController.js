const Expense = require('../models/Expense');

// POST /api/expenses
const addExpense = async (req, res) => {
  try {
    const { description, amount, category } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ message: 'Description and amount are required' });
    }

    const expense = new Expense({
  userId: req.user.id,
  description,
  amount,
  category,
  createdAt: new Date(), // 🧠 Explicitly set current timestamp
});

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/expenses
const getExpenses = async (req, res) => {
  try {
const expenses = await Expense.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
  _id: req.params.id,
  userId: req.user.id
});

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.status(200).json({ message: 'Expense deleted', id: req.params.id });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/expenses/:id
const updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
  { _id: req.params.id, userId: req.user.id },
  { $set: req.body },
  { new: true }
);

    if (!updated) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense
};