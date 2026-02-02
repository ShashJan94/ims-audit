export default function ExportJson({ state }) {
  const download = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ims-audit-demo-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <h2 className="h1">📤 Export Audit Data</h2>
      <p className="muted">
        Export all audit data as JSON. Perfect for reporting, archiving, or integration with external systems.
      </p>
      <button className="btn" onClick={download}>⬇️ Download JSON Export</button>
    </div>
  );
}
