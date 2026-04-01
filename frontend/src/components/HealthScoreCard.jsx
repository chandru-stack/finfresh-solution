import { parseNumber } from '../utils/parseNumber';

const categoryColor = {
  Excellent: '#27ae60',
  Healthy:   '#2980b9',
  Moderate:  '#f39c12',
  'At Risk': '#e74c3c',
};

export default function HealthScoreCard({ health }) {
  const score    = parseNumber(health.score);
  const category = health.category || 'Unknown';
  const color    = categoryColor[category] || '#888';

  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '1.5rem' }}>
      <h3 style={{ marginTop: 0 }}>Financial Health Score</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
          width: 90, height: 90, borderRadius: '50%',
          background: color, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 700,
          flexShrink: 0
        }}>
          {score}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color }}>{category}</p>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
            {(health.suggestions || []).map((s, i) => (
              <li key={i} style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
      {health.breakdown && (
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {Object.entries(health.breakdown).map(([k, v]) => (
            <div key={k} style={{ background: '#f9f9f9', borderRadius: 6, padding: '0.6rem 1rem' }}>
              <span style={{ fontSize: 12, color: '#888', textTransform: 'capitalize' }}>
                {k.replace(/([A-Z])/g, ' $1')}
              </span>
              <span style={{ float: 'right', fontWeight: 700 }}>{v}/25</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}