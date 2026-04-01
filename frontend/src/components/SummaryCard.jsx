import { formatCurrency } from '../utils/formatCurrency';
import { parseNumber } from '../utils/parseNumber';

export default function SummaryCard({ summary }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
      {[
        { label: 'Monthly Income',   value: formatCurrency(parseNumber(summary.income)) },
        { label: 'Monthly Expenses', value: formatCurrency(parseNumber(summary.expense)) },
        { label: 'Savings',          value: formatCurrency(parseNumber(summary.savings)) },
        { label: 'Savings Rate',     value: `${parseNumber(summary.savingsRate).toFixed(1)}%` },
      ].map(({ label, value }) => (
        <div key={label} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '1.2rem' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#888' }}>{label}</p>
          <p style={{ margin: '0.4rem 0 0', fontSize: 22, fontWeight: 700 }}>{value}</p>
        </div>
      ))}
    </div>
  );
}