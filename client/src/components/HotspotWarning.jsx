export default function HotspotWarning({ warnings }) {
  if (!warnings || warnings.length === 0) return null;
  return (
    <div className="alert alert-warning slide-up">
      <span>⚠️</span>
      <div>
        <strong>Hotspot Warning:</strong>
        <ul style={{ margin: '4px 0 0 16px', fontSize: '0.85rem' }}>
          {warnings.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      </div>
    </div>
  );
}
