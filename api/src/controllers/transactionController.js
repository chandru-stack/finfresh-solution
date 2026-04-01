const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { type, category, amount, date, description } = req.body;
  try {
    const transaction = await Transaction.create({
      userId: req.userId,
      type, category,
      amount: parseFloat(amount),
      date: new Date(date),
      description
    });
    res.status(201).json({
      id: transaction._id,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      createdAt: transaction.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTransactions = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const filter = { userId: req.userId };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.category) filter.category = req.query.category;

  try {
    const [data, total] = await Promise.all([
      Transaction.find(filter).sort({ date: -1 }).skip(skip).limit(limit).lean(),
      Transaction.countDocuments(filter)
    ]);

    res.json({
      data: data.map(t => ({ id: t._id, type: t.type, category: t.category, amount: t.amount, date: t.date, description: t.description })),
      pagination: { page, limit, total }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};