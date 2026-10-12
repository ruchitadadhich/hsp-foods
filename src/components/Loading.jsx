export default function Loading() {
  return (
    <main className="loading-screen" role="status" aria-live="polite">
      <span className="loading-mark" aria-hidden="true">H</span>
      <span className="loading-spinner" aria-hidden="true" />
      <span className="loading-label">Loading HSP Foods</span>
    </main>
  );
}