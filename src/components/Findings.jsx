import { useState } from "react";

const badgeClass = (t) => t === "NC" ? "nc" : t === "OBS" ? "obs" : "ofi";

export default function Findings({ findings, setFindings }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [uploadMessage, setUploadMessage] = useState("");

  const updateStatus = (id, status) => {
    setFindings(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadMessage("⏳ Processing CSV file...");
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setUploadMessage("❌ Error: CSV file is empty or invalid");
          setTimeout(() => setUploadMessage(""), 4000);
          return;
        }
        
        const parseCSVLine = (line) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim().replace(/^"|"$/g, ''));
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim().replace(/^"|"$/g, ''));
          return result;
        };
        
        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
        
        const newFindings = lines.slice(1).map(line => {
          const values = parseCSVLine(line);
          const finding = {};
          
          headers.forEach((header, index) => {
            finding[header] = values[index] || '';
          });
          
          return finding;
        }).filter(finding => finding.id && finding.description);
        
        if (newFindings.length === 0) {
          setUploadMessage("❌ No valid findings found in CSV file");
          setTimeout(() => setUploadMessage(""), 4000);
          return;
        }
        
        setFindings(prev => [...prev, ...newFindings]);
        setUploadMessage(`✅ Successfully imported ${newFindings.length} finding(s)! Updated: Overview, Findings, Reports, KPIs tabs.`);
        setTimeout(() => setUploadMessage(""), 5000);
      } catch (error) {
        setUploadMessage(`❌ Error parsing CSV: ${error.message}`);
        setTimeout(() => setUploadMessage(""), 5000);
      }
    };
    
    reader.onerror = () => {
      setUploadMessage("❌ Error reading file");
      setTimeout(() => setUploadMessage(""), 4000);
    };
    
    reader.readAsText(file);
    e.target.value = '';
  };

  const filtered = findings.filter(f => statusFilter === "All" ? true : f.status === statusFilter);

  return (
    <div className="card">
      <h2 className="h1">Audit Findings & Corrective Actions</h2>
      <p className="muted">Document and track audit findings: NC (Non-Conformity), OBS (Observation), OFI (Opportunity for Improvement). Monitor corrective action status.</p>

      <div className="card" style={{background:"linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)", borderLeft:"4px solid #0284c7", marginTop:"16px", marginBottom:"16px", padding:"16px"}}>
        <h3 style={{margin:"0 0 8px", fontSize:"14px", fontWeight:"700", color:"#0c4a6e"}}>
          🔄 What Updates When You Add Findings
        </h3>
        <ul style={{margin:"8px 0 0", paddingLeft:"20px", fontSize:"12px", color:"#0c4a6e", lineHeight:"1.8"}}>
          <li><strong>Overview Tab:</strong> "Total Findings" and "Open Findings" counts update</li>
          <li><strong>This Table Below:</strong> New findings appear immediately</li>
          <li><strong>KPIs Tab:</strong> "Finding Closure Rate" recalculates automatically</li>
          <li><strong>Reports Tab:</strong> Findings charts (Doughnut, Bar), statistics, and tables update</li>
          <li><strong>Roadmap Tab:</strong> "Open Findings" section shows new items</li>
          <li><strong>Export:</strong> New findings included in downloads</li>
        </ul>
      </div>

      <div className="card" style={{background:"linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", borderLeft:"4px solid #2563eb", marginBottom:"20px"}}>
        <h3 style={{margin:"0 0 12px", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>Import Findings from CSV</h3>
        <p className="muted" style={{marginBottom:"16px", fontSize:"13px"}}>
          Upload a CSV file with columns: id, type, standard, description, area, riskLink, action, status, responsible, dueDate
        </p>
        
        {uploadMessage && (
          <div style={{
            padding:"12px 16px", 
            marginBottom:"16px", 
            borderRadius:"8px", 
            background: uploadMessage.includes("✅") ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)" : 
                       uploadMessage.includes("⏳") ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" :
                       "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
            border: uploadMessage.includes("✅") ? "2px solid #10b981" : 
                   uploadMessage.includes("⏳") ? "2px solid #f59e0b" :
                   "2px solid #dc2626",
            fontWeight:"600",
            fontSize:"13px",
            color:"#1e3a5f",
            animation:"slideIn 0.3s ease-out"
          }}>
            {uploadMessage}
          </div>
        )}
        
        <div style={{display:"flex", gap:"12px", alignItems:"center"}}>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleCSVUpload}
            style={{padding:"8px", border:"2px solid #2563eb", borderRadius:"6px", fontSize:"13px", background:"white"}}
          />
        </div>
      </div>

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
