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

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const newRisks = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const risk = {};
        headers.forEach((header, index) => {
          risk[header] = values[index];
        });
        risk.L = Number(risk.L);
        risk.I = Number(risk.I);
        return risk;
      });
      
      setRisks(prev => [...prev, ...newRisks]);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  const downloadSampleCSV = () => {
    const csvContent = `id,area,description,cause,impact,L,I,owner,controls
R99,Quality,Sample Risk,Sample cause,Sample impact,3,3,Owner Name,Sample controls`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-risks.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <h2 className="h1">Risk Register</h2>
      <p className="muted">Identify and assess audit risks. Score = Likelihood (L) × Impact (I). Thresholds: 1–6 Low, 7–12 Medium, 13–25 High.</p>

      <hr />

      <h3 style={{margin:"16px 0 12px", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>Risk Assessment Scale</h3>
      <div style={{display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"12px", marginBottom:"20px"}}>
        <div className="card" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)", borderLeft:"4px solid #3b82f6"}}>
          <b>Likelihood (L): 1–5 Scale</b>
          <div className="muted" style={{fontSize:"12px", marginTop:"6px", lineHeight:"1.5"}}>
            1 = Very unlikely<br/>2 = Unlikely<br/>3 = Possible<br/>4 = Likely<br/>5 = Very likely
          </div>
        </div>
        <div className="card" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)", borderLeft:"4px solid #d32f2f"}}>
          <b>Impact (I): 1–5 Scale</b>
          <div className="muted" style={{fontSize:"12px", marginTop:"6px", lineHeight:"1.5"}}>
            1 = Minimal harm<br/>2 = Minor issues<br/>3 = Moderate effect<br/>4 = Major consequence<br/>5 = Severe impact
          </div>
        </div>
      </div>

      <div className="card" style={{background:"linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", borderLeft:"4px solid #2563eb", marginBottom:"20px"}}>
        <h3 style={{margin:"0 0 12px", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>Import Risks from CSV</h3>
        <p className="muted" style={{marginBottom:"16px", fontSize:"13px"}}>
          Upload a CSV file to bulk import risks. Download the sample template to see the required format.
        </p>
        <div style={{display:"flex", gap:"12px", alignItems:"center"}}>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleCSVUpload}
            style={{padding:"8px", border:"2px solid #2563eb", borderRadius:"6px", fontSize:"13px", background:"white"}}
          />
          <button className="btn secondary" onClick={downloadSampleCSV} style={{whiteSpace:"nowrap"}}>
            Download Sample CSV
          </button>
        </div>
      </div>

      <h3 style={{margin:"16px 0 12px", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>Current Assessed Risks</h3>
      <table style={{marginBottom:"24px"}}>
        <thead>
          <tr>
            <th style={{width:"8%"}}>Risk ID</th>
            <th style={{width:"20%"}}>Risk Description</th>
            <th style={{width:"16%"}}>Area</th>
            <th style={{width:"10%"}}>L</th>
            <th style={{width:"10%"}}>I</th>
            <th style={{width:"12%"}}>Score</th>
            <th style={{width:"14%"}}>Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {computed.slice(0, 7).map(r => (
            <tr key={r.id}>
              <td><b>{r.id}</b></td>
              <td><div className="small">{r.description}</div></td>
              <td>{r.area}</td>
              <td style={{textAlign:"center", fontWeight:"600"}}>{r.L}</td>
              <td style={{textAlign:"center", fontWeight:"600"}}>{r.I}</td>
              <td style={{textAlign:"center"}}><span className={`badge ${scoreColor(r.score)}`}><b>{r.score}</b></span></td>
              <td style={{fontSize:"12px"}}>
                {r.score >= 13 ? "🔴 High" : r.score >= 7 ? "🟡 Medium" : "🟢 Low"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
