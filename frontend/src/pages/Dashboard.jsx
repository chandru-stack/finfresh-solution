import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { summaryAPI, healthAPI } from '../services/api';
import SummaryCard from '../components/SummaryCard';
import HealthScoreCard from '../components/HealthScoreCard';
import CategoryBreakdown from '../components/CategoryBreakdown';
import AddTransactionForm from '../components/AddTransactionForm';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function Dashboard() {
  const [summary, setSummary]     = useState(null);
  const [health, setHealth]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showForm, setShowForm]   = useState(false);
  const navigate                  = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [sRes, hRes] = await Promise.all([summaryAPI.get(), healthAPI.get()]);
      setSummary(sRes.data);
      setHealth(hRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const noData = summary && summary.income === 0 && summary.expense === 0;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Navbar */}
      <div style={{
        background: '#1a1a2e', color: '#fff',
        padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: 20, color: '#ffffff' }}>💰 FinFresh</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: 14 }}>Hi, {user.name || 'User'}</span>
          <button onClick={() => setShowForm(!showForm)} style={{
            background: '#27ae60', color: '#fff', border: 'none',
            padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer', fontWeight: 600
          }}>
            {showForm ? '✕ Close' : '➕ Add'}
          </button>
          <button onClick={() => navigate('/transactions')} style={{
            background: '#2563eb', color: '#fff', border: 'none',
            padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer'
          }}>
            Transactions
          </button>
          <button onClick={logout} style={{
            background: 'transparent', color: '#fff',
            border: '1px solid #fff', padding: '0.4rem 1rem',
            borderRadius: 6, cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <h2 style={{ marginTop: 0 }}>
          Dashboard — {new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
        </h2>

        {/* Add Transaction Form — toggle */}
        {showForm && (
          <div style={{ marginBottom: '1.5rem' }}>
            <AddTransactionForm onSuccess={() => { fetchAll(); setShowForm(false); }} />
          </div>
        )}

        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && noData && (
          <EmptyState message="No transactions found for this month. Click ➕ Add to get started!" />
        )}

        {!loading && !error && summary && (
          <>
            <SummaryCard summary={summary} />
            <div style={{ marginTop: '1.5rem' }}>
              {health && <HealthScoreCard health={health} />}
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <CategoryBreakdown categories={summary.categories} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
