const Transaction = require('../models/Transaction');

exports.getFinancialHealth = async (req, res) => {
  try {
    const now = new Date();

    // Current month boundaries
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Last 3 months for avg expense
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    const allTx = await Transaction.find({ userId: req.userId }).lean();
    const currentMonthTx = allTx.filter(t => t.date >= monthStart && t.date <= monthEnd);
    const last3MonthsTx  = allTx.filter(t => t.date >= threeMonthsAgo && t.date <= monthEnd);

    // --- Helpers ---
    const sum = (txs, type) =>
      txs.filter(t => t.type === type).reduce((a, t) => a + Math.max(0, t.amount), 0);

    // Component 1: Emergency Fund
    const totalIncome  = sum(allTx, 'income');
    const totalExpense = sum(allTx, 'expense');
    const totalSavings = totalIncome - totalExpense;

    // Avg monthly expense over last 3 months
    const last3Expense = sum(last3MonthsTx, 'expense');
    const monthlyExpenses = last3Expense / 3;

    let emergencyFundPts;
    if (monthlyExpenses === 0) {
      emergencyFundPts = 25; // no expenses = infinite coverage
    } else {
      const months = totalSavings / monthlyExpenses;
      if (months < 1)      emergencyFundPts = 5;
      else if (months < 3) emergencyFundPts = 10;
      else if (months < 6) emergencyFundPts = 20;
      else                 emergencyFundPts = 25;
    }

    // Component 2: Savings Rate
    const monthlyIncome  = sum(currentMonthTx, 'income');
    const monthlyExpense = sum(currentMonthTx, 'expense');
    const monthlySavings = monthlyIncome - monthlyExpense;

    let savingsRatePts;
    if (monthlyIncome === 0) {
      savingsRatePts = 0;
    } else {
      const rate = (monthlySavings / monthlyIncome) * 100;
      if (rate < 10)      savingsRatePts = 5;
      else if (rate < 20) savingsRatePts = 10;
      else if (rate < 40) savingsRatePts = 20;
      else                savingsRatePts = 25;
    }

    // Component 3: Debt Ratio
    const monthlyDebt = sum(currentMonthTx, 'debt');
    let debtRatioPts;
    if (monthlyIncome === 0) {
      debtRatioPts = 0;
    } else {
      const ratio = (monthlyDebt / monthlyIncome) * 100;
      if (ratio > 50)      debtRatioPts = 5;
      else if (ratio > 30) debtRatioPts = 10;
      else if (ratio > 10) debtRatioPts = 20;
      else                 debtRatioPts = 25;
    }

    // Component 4: Investment Ratio
    const monthlyInvestment = sum(currentMonthTx, 'investment');
    let investmentRatioPts;
    if (monthlyIncome === 0) {
      investmentRatioPts = 0;
    } else {
      const ratio = (monthlyInvestment / monthlyIncome) * 100;
      if (ratio < 5)       investmentRatioPts = 5;
      else if (ratio < 15) investmentRatioPts = 10;
      else if (ratio < 30) investmentRatioPts = 20;
      else                 investmentRatioPts = 25;
    }

    const score = emergencyFundPts + savingsRatePts + debtRatioPts + investmentRatioPts;

    let category;
    if (score >= 80)      category = 'Excellent';
    else if (score >= 60) category = 'Healthy';
    else if (score >= 40) category = 'Moderate';
    else                  category = 'At Risk';

    // Suggestions
    const suggestions = [];
    if (emergencyFundPts < 25)    suggestions.push('Increase your emergency fund to cover at least 6 months of expenses');
    if (savingsRatePts < 20)      suggestions.push('Try to save at least 20% of your monthly income');
    if (debtRatioPts < 20)        suggestions.push('Work on reducing your debt payments below 30% of income');
    if (investmentRatioPts < 20)  suggestions.push('Consider increasing your investment contributions to at least 15%');

    res.json({
      score,
      category,
      breakdown: {
        emergencyFund:    emergencyFundPts,
        savingsRate:      savingsRatePts,
        debtRatio:        debtRatioPts,
        investmentRatio:  investmentRatioPts
      },
      suggestions
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};