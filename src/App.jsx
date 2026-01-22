import { useEffect, useMemo, useState } from "react";
import Tabs from "./components/Tabs";
import MermaidDiagram from "./components/MermaidDiagram";
import RiskRegister from "./components/RiskRegister";
import AuditPlan from "./components/AuditPlan";
import Findings from "./components/Findings";
import KpiDashboard from "./components/KpiDashboard";
import Roadmap from "./components/Roadmap";
import ExportJson from "./components/ExportJson";
import { sample } from "./data/sampleData";

const TABS = ["Overview", "Risks", "Audit Plan", "Findings", "KPIs", "Roadmap", "Export"];

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
        <div className="row">
          <div style={{flex: 1}}>
            <MermaidDiagram code={diagrams.imsIntegration} />
            <div style={{height:12}} />
            <MermaidDiagram code={diagrams.auditFlow} />
          </div>
          <div style={{flex: 1}}>
            <MermaidDiagram code={diagrams.pdca} />
            <div className="card" style={{marginTop:12}}>
              <h2 className="h1">How to explain in presentation</h2>
              <ol className="muted">
                <li>Start from IMS integration (3 standards, one system).</li>
                <li>Show risk register → audit plan is risk-based.</li>
                <li>Findings create corrective actions.</li>
                <li>KPIs + Management Review → PDCA improvement.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {tab === "Risks" && <RiskRegister risks={risks} setRisks={setRisks} />}
      {tab === "Audit Plan" && <AuditPlan auditPlan={sample.auditPlan} />}
      {tab === "Findings" && <Findings findings={findings} setFindings={setFindings} />}
      {tab === "KPIs" && <KpiDashboard kpis={sample.kpis} />}
      {tab === "Roadmap" && <Roadmap roadmap={roadmap} setRoadmap={setRoadmap} />}
      {tab === "Export" && <ExportJson state={{ risks, findings, roadmap }} />}
    </div>
  );
}
