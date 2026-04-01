const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { createTransaction, getTransactions } = require('../controllers/transactionController');

const router = express.Router();

router.use(auth);

router.post('/', [
  body('type').isIn(['income', 'expense', 'investment', 'debt']),
  body('category').notEmpty(),
  body('amount').isFloat({ min: 0.01 }),
  body('date').isISO8601(),
], createTransaction);

router.get('/', getTransactions);

module.exports = router;