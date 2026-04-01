export default function ErrorState({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#c0392b', background: '#fdecea', borderRadius: 8 }}>
      <p>⚠️ {message || 'Something went wrong. Please try again.'}</p>
    </div>
  );
}