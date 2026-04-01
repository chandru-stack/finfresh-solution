import { useState } from 'react';
import { transactionAPI } from '../services/api';

const CATEGORIES = [
  'Housing', 'Food', 'Transport', 'Entertainment',
  'Healthcare', 'Education', 'Shopping', 'Utilities',
  'Salary', 'Freelance', 'Investment', 'Debt Payment', 'Other'
];

export default function AddTransactionForm({ onSuccess }) {
  const [form, setForm] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(''); setSuccess('');

    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError('Please enter a valid amount'); return;
    }
    if (!form.date) {
      setError('Please select a date'); return;
    }

    setLoading(true);
    try {
      await transactionAPI.create({
        type:        form.type,
        category:    form.category,
        amount:      parseFloat(form.amount),
        date:        form.date,
        description: form.description
      });
      setSuccess('Transaction added successfully!');
      setForm({
        type: 'expense',
        category: 'Food',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      if (onSuccess) onSuccess(); // refresh dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.6rem 1rem', fontSize: 14,
    border: '1px solid #ddd', borderRadius: 8,
    boxSizing: 'border-box', marginBottom: '0.8rem'
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '1.5rem' }}>
      <h3 style={{ marginTop: 0 }}>➕ Add Transaction</h3>

      {/* Type */}
      <label style={{ fontSize: 13, color: '#555' }}>Type</label>
      <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
        <option value="investment">Investment</option>
        <option value="debt">Debt</option>
      </select>

      {/* Category */}
      <label style={{ fontSize: 13, color: '#555' }}>Category</label>
      <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Amount */}
      <label style={{ fontSize: 13, color: '#555' }}>Amount (₹)</label>
      <input
        name="amount" type="number" placeholder="Enter amount"
        value={form.amount} onChange={handleChange} style={inputStyle}
        min="1"
      />

      {/* Date */}
      <label style={{ fontSize: 13, color: '#555' }}>Date</label>
      <input
        name="date" type="date"
        value={form.date} onChange={handleChange} style={inputStyle}
      />

      {/* Description */}
      <label style={{ fontSize: 13, color: '#555' }}>Description (optional)</label>
      <input
        name="description" type="text" placeholder="Add a note..."
        value={form.description} onChange={handleChange} style={inputStyle}
      />

      {/* Error / Success */}
      {error   && <p style={{ color: '#e74c3c', fontSize: 13, margin: '0 0 0.8rem' }}>⚠️ {error}</p>}
      {success && <p style={{ color: '#27ae60', fontSize: 13, margin: '0 0 0.8rem' }}>✅ {success}</p>}

      {/* Submit */}
      <button onClick={handleSubmit} disabled={loading} style={{
        width: '100%', padding: '0.8rem',
        background: loading ? '#aaa' : '#2563eb',
        color: '#fff', border: 'none', borderRadius: 8,
        fontSize: 15, fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer'
      }}>
        {loading ? 'Adding...' : 'Add Transaction'}
      </button>
    </div>
  );
}