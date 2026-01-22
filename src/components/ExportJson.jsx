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
      <h2 className="h1">Export Demo Data</h2>
      <p className="muted">
        Optional: export current state to JSON (evidence you can attach as appendix).
      </p>
      <button className="btn" onClick={download}>Download JSON</button>
    </div>
  );
}
