const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, updateExpense } = require('../controllers/expenseController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, addExpense);
router.get('/', protect, getExpenses);
router.patch('/:id', protect, updateExpense);

module.exports = router;