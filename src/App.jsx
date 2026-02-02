import { useEffect, useMemo, useState } from "react";
import Tabs from "./components/Tabs";
import MermaidDiagram from "./components/MermaidDiagram";
import RiskRegister from "./components/RiskRegister";
import AuditPlan from "./components/AuditPlan";
import Findings from "./components/Findings";
import KpiDashboard from "./components/KpiDashboard";
import Roadmap from "./components/Roadmap";
import ExportJson from "./components/ExportJson";
import Reports from "./components/Reports";
import { sample } from "./data/sampleData";

const TABS = ["Overview", "Risks", "Audit Plan", "Findings", "KPIs", "Reports", "Roadmap", "Export"];

const diagrams = {
  pdca: `flowchart LR
    P["Plan"] --> D["Do"] --> C["Check"] --> A["Act"]
    A --> P
  `,

  auditFlow: `flowchart TD
    A["Define IMS Scope & Criteria"] --> B["Risk Assessment"]
    B --> C["Audit Program & Plan"]
    C --> D["Audit Execution"]
    D --> E["Findings: NC / OBS / OFI"]
    E --> F["Corrective Actions"]
    F --> G["Management Review"]
    G --> H["Continual Improvement<br/>(PDCA)"]
    H --> B
  `,

  imsIntegration: `flowchart LR
    Q["ISO 9001<br/>Quality"] --> IMS["Integrated Management System"]
    E["ISO 14001<br/>Environment"] --> IMS
    S["ISO 45001<br/>OH&S"] --> IMS
    IMS --> PE["Performance Evaluation<br/>KPIs + Audit + Review"]
  `
};


const LS_KEY = "ims_audit_demo_v1";

export default function App() {
  const [tab, setTab] = useState("Overview");

  const [risks, setRisks] = useState(sample.risks);
  const [findings, setFindings] = useState(sample.findings);
  const [roadmap, setRoadmap] = useState(sample.roadmap);

  // Load/save from localStorage (so your demo changes persist)
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.risks) setRisks(parsed.risks);
      if (parsed?.findings) setFindings(parsed.findings);
      if (parsed?.roadmap) setRoadmap(parsed.roadmap);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify({ risks, findings, roadmap }));
  }, [risks, findings, roadmap]);

  const highRiskCount = useMemo(() => risks.filter(r => Number(r.L) * Number(r.I) >= 13).length, [risks]);
  const openFindings = useMemo(() => findings.filter(f => f.status !== "Closed").length, [findings]);

  return (
    <div>
      <div className="app-header">
        <h1>IMS Audit Management System</h1>
        <p>Integrated Quality, Environmental & Safety Management | Risk-Based Internal Audits</p>
      </div>

      <div className="app-content">
        <div className="container">
          <div className="card">
            <h1 className="h1">IMS Audit & Performance Evaluation — Demo UI</h1>
            <div className="muted">
              Organization: <b>{sample.meta.orgName}</b> • Standards: <b>{sample.meta.standards.join(", ")}</b>
            </div>
            <div style={{marginTop:10}} className="row">
              <div className="card" style={{boxShadow:"none", background:"#f3f5ff"}}>
                <b>High risks</b><div className="muted">{highRiskCount}</div>
              </div>
              <div className="card" style={{boxShadow:"none", background:"#f3f5ff"}}>
                <b>Open findings</b><div className="muted">{openFindings}</div>
              </div>
              <div className="card" style={{boxShadow:"none", background:"#f3f5ff"}}>
                <b>Demo goal</b><div className="muted">Show risk-based audit + KPI + PDCA</div>
              </div>
            </div>
          </div>

          <Tabs tabs={TABS} active={tab} onChange={setTab} />

          {tab === "Overview" && (
            <div>
              {/* Metrics Widgets */}
              <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"16px", marginBottom:"24px"}}>
                <div 
                  className="card metric-widget" 
                  style={{background:"linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", borderLeft:"5px solid #2563eb", padding:"20px", textAlign:"center", cursor:"pointer"}}
                  onClick={() => setTab("Risks")}
                  title="Click to view Risk Register"
                >
                  <div style={{fontSize:"32px", fontWeight:"700", color:"#2563eb", marginBottom:"8px"}}>
                    {risks.length}
                  </div>
                  <div style={{fontSize:"13px", color:"#1e3a5f", fontWeight:"600", marginBottom:"4px"}}>
                    Total Risks
                  </div>
                  <div style={{fontSize:"11px", color:"#dc2626"}}>
                    {highRiskCount} High Priority
                  </div>
                </div>

                <div 
                  className="card metric-widget" 
                  style={{background:"linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", borderLeft:"5px solid #f59e0b", padding:"20px", textAlign:"center", cursor:"pointer"}}
                  onClick={() => setTab("Findings")}
                  title="Click to view Findings"
                >
                  <div style={{fontSize:"32px", fontWeight:"700", color:"#f59e0b", marginBottom:"8px"}}>
                    {findings.length}
                  </div>
                  <div style={{fontSize:"13px", color:"#1e3a5f", fontWeight:"600", marginBottom:"4px"}}>
                    Total Findings
                  </div>
                  <div style={{fontSize:"11px", color:"#dc2626"}}>
                    {openFindings} Open
                  </div>
                </div>

                <div 
                  className="card metric-widget" 
                  style={{background:"linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", borderLeft:"5px solid #10b981", padding:"20px", textAlign:"center", cursor:"pointer"}}
                  onClick={() => setTab("Audit Plan")}
                  title="Click to view Audit Plan"
                >
                  <div style={{fontSize:"32px", fontWeight:"700", color:"#10b981", marginBottom:"8px"}}>
                    {sample.auditPlan.length}
                  </div>
                  <div style={{fontSize:"13px", color:"#1e3a5f", fontWeight:"600", marginBottom:"4px"}}>
                    Planned Audits
                  </div>
                  <div style={{fontSize:"11px", color:"#1e3a5f"}}>
                    Risk-based schedule
                  </div>
                </div>

                <div 
                  className="card metric-widget" 
                  style={{background:"linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)", borderLeft:"5px solid #8b5cf6", padding:"20px", textAlign:"center", cursor:"pointer"}}
                  onClick={() => setTab("KPIs")}
                  title="Click to view KPI Dashboard"
                >
                  <div style={{fontSize:"32px", fontWeight:"700", color:"#8b5cf6", marginBottom:"8px"}}>
                    {sample.kpis.length}
                  </div>
                  <div style={{fontSize:"13px", color:"#1e3a5f", fontWeight:"600", marginBottom:"4px"}}>
                    Active KPIs
                  </div>
                  <div style={{fontSize:"11px", color:"#1e3a5f"}}>
                    Performance metrics
                  </div>
                </div>
              </div>

              {/* IMS Process Flow */}
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginBottom:"20px"}}>
                <div className="card" style={{padding:"20px"}}>
                  <h3 style={{margin:"0 0 16px", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>
                    IMS Integration Framework
                  </h3>
                  <MermaidDiagram code={diagrams.imsIntegration} />
                  <p className="muted" style={{marginTop:"12px", fontSize:"12px"}}>
                    Unified management system combining Quality (ISO 9001), Environment (ISO 14001), and Safety (ISO 45001) standards.
                  </p>
                </div>

                <div className="card" style={{padding:"20px"}}>
                  <h3 style={{margin:"0 0 16px", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>
                    PDCA Continuous Improvement Cycle
                  </h3>
                  <MermaidDiagram code={diagrams.pdca} />
                  <p className="muted" style={{marginTop:"12px", fontSize:"12px"}}>
                    Plan-Do-Check-Act methodology ensures systematic improvement and compliance maintenance.
                  </p>
                </div>
              </div>

              {/* Audit Flow Process */}
              <div className="card" style={{padding:"20px"}}>
                <h3 style={{margin:"0 0 16px", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>
                  End-to-End Audit Management Process
                </h3>
                <MermaidDiagram code={diagrams.auditFlow} />
                <p className="muted" style={{marginTop:"12px", fontSize:"12px"}}>
                  Complete audit lifecycle from scope definition through risk assessment, execution, findings documentation, corrective actions, and continuous improvement.
                </p>
              </div>

              {/* Key Features Grid */}
              <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"16px", marginTop:"20px"}}>
                <div className="card" style={{padding:"20px", borderLeft:"4px solid #2563eb"}}>
                  <div style={{fontSize:"16px", fontWeight:"600", color:"#1e3a5f", marginBottom:"8px"}}>
                    Risk-Based Auditing
                  </div>
                  <p className="muted" style={{fontSize:"12px", margin:"0"}}>
                    Prioritize audits based on risk assessment scores and business impact analysis for efficient resource allocation.
                  </p>
                </div>

                <div className="card" style={{padding:"20px", borderLeft:"4px solid #10b981"}}>
                  <div style={{fontSize:"16px", fontWeight:"600", color:"#1e3a5f", marginBottom:"8px"}}>
                    Integrated Compliance
                  </div>
                  <p className="muted" style={{fontSize:"12px", margin:"0"}}>
                    Unified approach to ISO 9001, 14001, and 45001 compliance reduces duplication and streamlines management.
                  </p>
                </div>

                <div className="card" style={{padding:"20px", borderLeft:"4px solid #f59e0b"}}>
                  <div style={{fontSize:"16px", fontWeight:"600", color:"#1e3a5f", marginBottom:"8px"}}>
                    Performance Analytics
                  </div>
                  <p className="muted" style={{fontSize:"12px", margin:"0"}}>
                    Real-time KPI tracking and visual analytics support data-driven decision making and continuous improvement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === "Risks" && <RiskRegister risks={risks} setRisks={setRisks} />}
          {tab === "Audit Plan" && <AuditPlan auditPlan={sample.auditPlan} />}
          {tab === "Findings" && <Findings findings={findings} setFindings={setFindings} />}
          {tab === "KPIs" && <KpiDashboard kpis={sample.kpis} />}
          {tab === "Reports" && <Reports risks={risks} findings={findings} auditPlan={sample.auditPlan} kpis={sample.kpis} />}
          {tab === "Roadmap" && <Roadmap roadmap={roadmap} setRoadmap={setRoadmap} />}
          {tab === "Export" && <ExportJson state={{ risks, findings, roadmap }} />}
        </div>
      </div>
    </div>
  );
}
