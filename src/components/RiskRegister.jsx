import { useMemo, useState } from "react";

const scoreColor = (s) => (s >= 13 ? "nc" : s >= 7 ? "obs" : "ok");

export default function RiskRegister({ risks, setRisks }) {
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    id: "", area: "Quality", description: "", cause: "", impact: "",
    L: 3, I: 3, owner: "", controls: ""
  });

  const computed = useMemo(() => {
    return risks
      .map(r => ({ ...r, score: Number(r.L) * Number(r.I) }))
      .filter(r => filter === "All" ? true : r.area === filter);
  }, [risks, filter]);

  const addRisk = () => {
    if (!form.id || !form.description) return;
    setRisks(prev => [...prev, { ...form, L: Number(form.L), I: Number(form.I) }]);
    setForm({ id:"", area:"Quality", description:"", cause:"", impact:"", L:3, I:3, owner:"", controls:"" });
  };

  const removeRisk = (id) => setRisks(prev => prev.filter(r => r.id !== id));

  return (
    <div className="card">
      <h2 className="h1">Risk Register</h2>
      <p className="muted">Score = Likelihood (L) × Impact (I). Thresholds: 1–6 Low, 7–12 Medium, 13–25 High.</p>

      <div className="row">
        <div>
          <label className="small">Filter by Area</label>
          <select value={filter} onChange={(e)=>setFilter(e.target.value)}>
            <option>All</option>
            <option>Quality</option>
            <option>Environment</option>
            <option>OH&S</option>
            <option>IMS</option>
          </select>
        </div>
        <div>
          <label className="small">Quick Tip</label>
          <div className="muted">High risks become audit priorities (risk-based audit planning).</div>
        </div>
      </div>

      <hr />

      {/* <h3 style={{margin:"0 0 8px"}}>Add Risk (Demo)</h3>
      <div className="row">
        <div><input placeholder="ID (e.g., R8)" value={form.id} onChange={e=>setForm(f=>({...f,id:e.target.value}))} /></div>
        <div>
          <select value={form.area} onChange={e=>setForm(f=>({...f,area:e.target.value}))}>
            <option>Quality</option><option>Environment</option><option>OH&S</option><option>IMS</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div><input placeholder="Risk description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} /></div>
        <div><input placeholder="Cause" value={form.cause} onChange={e=>setForm(f=>({...f,cause:e.target.value}))} /></div>
      </div>
      <div className="row">
        <div><input placeholder="Impact" value={form.impact} onChange={e=>setForm(f=>({...f,impact:e.target.value}))} /></div>
        <div><input placeholder="Owner" value={form.owner} onChange={e=>setForm(f=>({...f,owner:e.target.value}))} /></div>
      </div>
      <div className="row">
        <div><textarea placeholder="Controls / treatment" value={form.controls} onChange={e=>setForm(f=>({...f,controls:e.target.value}))} /></div>
        <div className="row">
          <div>
            <label className="small">Likelihood (1–5)</label>
            <input type="number" min="1" max="5" value={form.L} onChange={e=>setForm(f=>({...f,L:e.target.value}))} />
          </div>
          <div>
            <label className="small">Impact (1–5)</label>
            <input type="number" min="1" max="5" value={form.I} onChange={e=>setForm(f=>({...f,I:e.target.value}))} />
          </div>
        </div>
      </div>
      <button className="btn" onClick={addRisk}>Add Risk</button> */}
<h3 style={{ margin: "0 0 8px" }}>Add Risk (Demo)</h3>

<div className="formGrid">
  <div className="field">
    <label>ID</label>
    <input
      placeholder="ID (e.g., R8)"
      value={form.id}
      onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
    />
  </div>

  <div className="field">
    <label>Area</label>
    <select
      value={form.area}
      onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
    >
      <option>Quality</option>
      <option>Environment</option>
      <option>OH&S</option>
      <option>IMS</option>
    </select>
  </div>

  <div className="field full">
    <label>Risk description</label>
    <input
      placeholder="Risk description"
      value={form.description}
      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
    />
  </div>

  <div className="field">
    <label>Cause</label>
    <input
      placeholder="Cause"
      value={form.cause}
      onChange={(e) => setForm((f) => ({ ...f, cause: e.target.value }))}
    />
  </div>

  <div className="field">
    <label>Owner</label>
    <input
      placeholder="Owner"
      value={form.owner}
      onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
    />
  </div>

  <div className="field">
    <label>Likelihood (1–5)</label>
    <input
      type="number"
      min="1"
      max="5"
      value={form.L}
      onChange={(e) => setForm((f) => ({ ...f, L: e.target.value }))}
    />
  </div>

  <div className="field">
    <label>Impact (1–5)</label>
    <input
      type="number"
      min="1"
      max="5"
      value={form.I}
      onChange={(e) => setForm((f) => ({ ...f, I: e.target.value }))}
    />
  </div>

  <div className="field full">
    <label>Controls / treatment</label>
    <textarea
      placeholder="Controls / treatment"
      value={form.controls}
      onChange={(e) => setForm((f) => ({ ...f, controls: e.target.value }))}
    />
  </div>

  <div className="full">
    <button className="btn" onClick={addRisk}>Add Risk</button>
  </div>
</div>

      <hr />

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Area</th><th>Description</th><th>L</th><th>I</th><th>Score</th><th>Owner</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {computed.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.area}</td>
              <td>
                <div><b>{r.description}</b></div>
                <div className="small">Cause: {r.cause || "-"}</div>
                <div className="small">Impact: {r.impact || "-"}</div>
                <div className="small">Controls: {r.controls || "-"}</div>
              </td>
              <td>{r.L}</td>
              <td>{r.I}</td>
              <td><span className={`badge ${scoreColor(r.score)}`}>{r.score}</span></td>
              <td>{r.owner || "-"}</td>
              <td><button className="btn secondary" onClick={()=>removeRisk(r.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
