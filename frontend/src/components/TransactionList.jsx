import { formatCurrency } from '../utils/formatCurrency';
import { parseNumber } from '../utils/parseNumber';
import EmptyState from './EmptyState';

const typeBadgeColor = {
  income:     { bg: '#eafaf1', color: '#27ae60' },
  expense:    { bg: '#fdecea', color: '#e74c3c' },
  investment: { bg: '#eaf3fb', color: '#2980b9' },
  debt:       { bg: '#fef9e7', color: '#f39c12' },
};

export default function TransactionList({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return <EmptyState message="No transactions found." />;
  }

  return (
    <div>
      {transactions.map((t) => {
        const badge = typeBadgeColor[t.type] || { bg: '#f0f0f0', color: '#555' };
        return (
          <div key={t.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.8rem 1rem', borderBottom: '1px solid #f0f0f0', background: '#fff'
          }}>
            <div>
              <span style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                background: badge.bg, color: badge.color,
                padding: '2px 8px', borderRadius: 12, marginRight: 8
              }}>{t.type}</span>
              <span style={{ fontWeight: 600 }}>{t.category}</span>
              <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>
                {new Date(t.date).toLocaleDateString('en-IN')}
              </span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 16 }}>
              {formatCurrency(parseNumber(t.amount))}
            </span>
          </div>
        );
      })}
    </div>
  );
}