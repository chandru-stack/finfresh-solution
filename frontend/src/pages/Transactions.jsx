import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../services/api';
import TransactionList from '../components/TransactionList';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

const TYPES = ['', 'income', 'expense', 'investment', 'debt'];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination]     = useState({ page: 1, limit: 20, total: 0 });
  const [typeFilter, setTypeFilter]     = useState('');
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const navigate                        = useNavigate();

  const fetch = useCallback(async (page = 1) => {
    setLoading(true); setError('');
    try {
      const params = { page, limit: 20 };
      if (typeFilter) params.type = typeFilter;
      const res = await transactionAPI.getAll(params);
      setTransactions(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => { fetch(1); }, [fetch]);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <div style={{ background: '#1a1a2e', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>💰 FinFresh</h2>
        <button onClick={() => navigate('/dashboard')} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer' }}>← Dashboard</button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Transactions</h2>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #ddd', fontSize: 14 }}>
            {TYPES.map(t => <option key={t} value={t}>{t ? t.charAt(0).toUpperCase() + t.slice(1) : 'All Types'}</option>)}
          </select>
        </div>

        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && (
          <>
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
              <TransactionList transactions={transactions} />
            </div>

            {/* Pagination */}
            {pagination.total > pagination.limit && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button onClick={() => fetch(pagination.page - 1)} disabled={pagination.page === 1}
                  style={{ padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer', background: '#fff' }}>
                  ← Prev
                </button>
                <span style={{ padding: '0.5rem 1rem', color: '#555' }}>
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                </span>
                <button onClick={() => fetch(pagination.page + 1)}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                  style={{ padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer', background: '#fff' }}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}