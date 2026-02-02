export default function Roadmap({ roadmap, setRoadmap, risks, findings }) {
  const update = (i, status) => {
    setRoadmap(prev => prev.map((r, idx) => idx === i ? { ...r, status } : r));
  };

  const highRisks = risks ? risks.filter(r => Number(r.L) * Number(r.I) >= 13) : [];
  const openFindings = findings ? findings.filter(f => f.status !== "Closed") : [];

  const addAction = (type, description) => {
    const newAction = {
      action: description,
      link: type === 'risk' ? 'Risk Mitigation' : 'Finding Resolution',
      owner: 'Action Owner',
      timeline: 'Q1 2026',
      metric: type === 'risk' ? 'Risk score reduction' : 'Finding closure',
      status: 'Planned'
    };
    setRoadmap(prev => [...prev, newAction]);
  };

  return (
    <div className="card">
      <h2 className="h1">Continuous Improvement Roadmap (PDCA)</h2>
      <p className="muted">Strategic actions linked to findings and risks. Track owners, timelines, success metrics, and progress status.</p>

      <div className="card" style={{background:"linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", borderLeft:"4px solid #f59e0b", marginTop:"16px", marginBottom:"20px", padding:"16px"}}>
        <h3 style={{margin:"0 0 8px", fontSize:"14px", fontWeight:"700", color:"#78350f"}}>
          🎯 Action Items from Current Data
        </h3>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginTop:"12px"}}>
          <div style={{padding:"12px", background:"rgba(255,255,255,0.6)", borderRadius:"8px"}}>
            <div style={{fontSize:"13px", fontWeight:"600", color:"#78350f", marginBottom:"6px"}}>
              📍 High Priority Risks ({highRisks.length})
            </div>
            {highRisks.slice(0, 3).map((r, i) => (
              <div key={i} style={{fontSize:"11px", color:"#78350f", marginBottom:"4px", paddingLeft:"8px"}}>
                • {r.id}: {r.description.substring(0, 40)}...
              </div>
            ))}
            {highRisks.length > 3 && (
              <div style={{fontSize:"11px", color:"#78350f", fontStyle:"italic", paddingLeft:"8px"}}>
                +{highRisks.length - 3} more requiring action
              </div>
            )}
          </div>
          <div style={{padding:"12px", background:"rgba(255,255,255,0.6)", borderRadius:"8px"}}>
            <div style={{fontSize:"13px", fontWeight:"600", color:"#78350f", marginBottom:"6px"}}>
              📋 Open Findings ({openFindings.length})
            </div>
            {openFindings.slice(0, 3).map((f, i) => (
              <div key={i} style={{fontSize:"11px", color:"#78350f", marginBottom:"4px", paddingLeft:"8px"}}>
                • [{f.type}] {f.description.substring(0, 35)}...
              </div>
            ))}
            {openFindings.length > 3 && (
              <div style={{fontSize:"11px", color:"#78350f", fontStyle:"italic", paddingLeft:"8px"}}>
                +{openFindings.length - 3} more to close
              </div>
            )}
          </div>
        </div>
        <p style={{margin:"12px 0 0", fontSize:"12px", color:"#78350f"}}>
          💡 <strong>Tip:</strong> Add action items below to address these risks and findings. Status updates sync across the system.
        </p>
      </div>

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
