import { formatCurrency } from '../utils/formatCurrency';
import { parseNumber } from '../utils/parseNumber';

export default function CategoryBreakdown({ categories }) {
  const entries = Object.entries(categories || {});
  if (entries.length === 0) return <p style={{ color: '#888' }}>No category data this month.</p>;

  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '1.5rem' }}>
      <h3 style={{ marginTop: 0 }}>Category Breakdown</h3>
      {entries.map(([cat, amt]) => (
        <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
          <span>{cat}</span>
          <span style={{ fontWeight: 600 }}>{formatCurrency(parseNumber(amt))}</span>
        </div>
      ))}
    </div>
  );
}