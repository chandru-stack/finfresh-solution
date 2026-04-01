import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Login() {
  const [mode, setMode]       = useState('login'); // 'login' | 'register'
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async () => {
    setError('');
    if (!validateEmail(form.email)) { setError('Enter a valid email address'); return; }
    if (form.password.length < 6)   { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      const fn = mode === 'login' ? authAPI.login : authAPI.register;
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await fn(payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 1rem', fontSize: 15,
    border: '1px solid #ddd', borderRadius: 8, marginBottom: '0.8rem',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: 12, width: 380, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginTop: 0, color: '#1a1a2e' }}>
          {mode === 'login' ? '🔐 Login' : '📝 Register'}
        </h2>
        <p style={{ textAlign: 'center', color: '#888', marginTop: -10 }}>FinFresh Personal Finance</p>

        {mode === 'register' && (
          <input name="name" placeholder="Full Name" value={form.name}
            onChange={handleChange} style={inputStyle} />
        )}
        <input name="email" placeholder="Email" type="email" value={form.email}
          onChange={handleChange} style={inputStyle} />
        <input name="password" placeholder="Password" type="password" value={form.password}
          onChange={handleChange} style={inputStyle} />

        {error && <p style={{ color: '#e74c3c', fontSize: 13, margin: '0 0 0.8rem' }}>⚠️ {error}</p>}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '0.8rem', background: loading ? '#aaa' : '#2563eb',
          color: '#fff', border: 'none', borderRadius: 8, fontSize: 16,
          cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600
        }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: 14, color: '#555' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}