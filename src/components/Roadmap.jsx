export default function Roadmap({ roadmap, setRoadmap }) {
  const update = (i, status) => {
    setRoadmap(prev => prev.map((r, idx) => idx === i ? { ...r, status } : r));
  };

  return (
    <div className="card">
      <h2 className="h1">🛣️ Continuous Improvement Roadmap (PDCA)</h2>
      <p className="muted">Strategic actions linked to findings and risks. Track owners, timelines, success metrics, and progress status.</p>

      <table>
        <thead>
          <tr>
            <th>Action</th><th>Link</th><th>Owner</th><th>Timeline</th><th>Success Metric</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {roadmap.map((r, idx) => (
            <tr key={idx}>
              <td><b>{r.action}</b></td>
              <td>{r.link}</td>
              <td>{r.owner}</td>
              <td>{r.timeline}</td>
              <td className="small">{r.metric}</td>
              <td>
                <select value={r.status} onChange={(e)=>update(idx, e.target.value)}>
                  <option>Planned</option>
                  <option>In Progress</option>
                  <option>Done</option>
                  <option>Blocked</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
