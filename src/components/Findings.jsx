import { useState } from "react";

const badgeClass = (t) => t === "NC" ? "nc" : t === "OBS" ? "obs" : "ofi";

export default function Findings({ findings, setFindings }) {
  const [statusFilter, setStatusFilter] = useState("All");

  const updateStatus = (id, status) => {
    setFindings(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  const filtered = findings.filter(f => statusFilter === "All" ? true : f.status === statusFilter);

  return (
    <div className="card">
      <h2 className="h1">Audit Findings & Actions</h2>
      <div className="row">
        <div>
          <label className="small">Filter by Status</label>
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Planned</option>
            <option>Closed</option>
          </select>
        </div>
        <div className="muted">
          Demo: change status to show corrective action tracking (supports management review).
        </div>
      </div>

      <hr />

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Type</th><th>Standard</th><th>Description</th><th>Risk Link</th><th>Action</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td><span className={`badge ${badgeClass(f.type)}`}>{f.type}</span></td>
              <td>{f.standard}</td>
              <td>{f.description}</td>
              <td>{f.riskLink}</td>
              <td className="small">{f.action}</td>
              <td>
                <select value={f.status} onChange={(e)=>updateStatus(f.id, e.target.value)}>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Planned</option>
                  <option>Closed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
