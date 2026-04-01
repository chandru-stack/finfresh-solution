export default function EmptyState({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
      <p>{message || 'No data found.'}</p>
    </div>
  );
}