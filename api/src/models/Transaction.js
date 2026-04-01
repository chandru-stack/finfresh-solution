const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type:        { type: String, required: true, enum: ['income', 'expense', 'investment', 'debt'] },
  category:    { type: String, required: true },
  amount:      { type: Number, required: true, min: 0 },
  date:        { type: Date, required: true },
  description: { type: String },
  createdAt:   { type: Date, default: Date.now }
});

// Compound index — most common query pattern
transactionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);