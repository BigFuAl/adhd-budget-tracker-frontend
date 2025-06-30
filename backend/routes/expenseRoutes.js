const express = require('express');
const router = express.Router();
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense // ⬅️ make sure this is imported
} = require('../controllers/expenseController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, addExpense);
router.get('/', protect, getExpenses);
router.patch('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense); // ⬅️ ADD THIS LINE

module.exports = router;