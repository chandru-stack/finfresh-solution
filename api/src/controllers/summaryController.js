const Transaction = require('../models/Transaction');

exports.getSummary = async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  try {
    const transactions = await Transaction.find({
      userId: req.userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    }).lean();

    let income = 0, expense = 0, investment = 0, debt = 0;
    const categories = {};

    for (const t of transactions) {
      const amt = Math.max(0, t.amount);
      if (t.type === 'income') income += amt;
      else if (t.type === 'expense') expense += amt;
      else if (t.type === 'investment') investment += amt;
      else if (t.type === 'debt') debt += amt;

      categories[t.category] = (categories[t.category] || 0) + amt;
    }

    const savings = income - expense;
    const savingsRate = income === 0 ? 0 : parseFloat(((savings / income) * 100).toFixed(1));

    res.json({ income, expense, investment, debt, savings, savingsRate, categories });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};