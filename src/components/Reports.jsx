import { useMemo } from "react";
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Reports({ risks, findings, auditPlan, kpis }) {
  // Risk statistics
  const riskStats = useMemo(() => {
    const withScores = risks.map(r => ({ ...r, score: Number(r.L) * Number(r.I) }));
    return {
      total: risks.length,
      high: withScores.filter(r => r.score >= 13).length,
      medium: withScores.filter(r => r.score >= 7 && r.score < 13).length,
      low: withScores.filter(r => r.score < 7).length,
      byArea: {
        quality: risks.filter(r => r.area === "Quality").length,
        environment: risks.filter(r => r.area === "Environment").length,
        ohs: risks.filter(r => r.area === "OH&S").length,
        ims: risks.filter(r => r.area === "IMS").length,
      }
    };
  }, [risks]);

  // Findings statistics
  const findingStats = useMemo(() => {
    return {
      total: findings.length,
      nc: findings.filter(f => f.type === "NC").length,
      obs: findings.filter(f => f.type === "OBS").length,
      ofi: findings.filter(f => f.type === "OFI").length,
      open: findings.filter(f => f.status === "Open").length,
      inProgress: findings.filter(f => f.status === "In Progress").length,
      closed: findings.filter(f => f.status === "Closed").length,
    };
  }, [findings]);

  // KPI statistics
  const kpiStats = useMemo(() => {
    const onTarget = kpis.filter(k => k.value >= k.target).length;
    const belowTarget = kpis.length - onTarget;
    return {
      total: kpis.length,
      onTarget,
      belowTarget,
      avgPerformance: ((onTarget / kpis.length) * 100).toFixed(1)
    };
  }, [kpis]);

  // Risk Distribution Chart
  const riskDistributionData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [{
      data: [riskStats.high, riskStats.medium, riskStats.low],
      backgroundColor: ['#d32f2f', '#ff9800', '#1b5e20'],
      borderColor: ['#ffffff', '#ffffff', '#ffffff'],
      borderWidth: 2,
    }]
  };

  // Risk by Area Chart
  const riskByAreaData = {
    labels: ['Quality', 'Environment', 'OH&S', 'IMS'],
    datasets: [{
      label: 'Number of Risks',
      data: [
        riskStats.byArea.quality,
        riskStats.byArea.environment,
        riskStats.byArea.ohs,
        riskStats.byArea.ims
      ],
      backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
      borderColor: '#ffffff',
      borderWidth: 2,
    }]
  };

  // Findings Distribution Chart
  const findingsDistributionData = {
    labels: ['NC (Non-Conformity)', 'OBS (Observation)', 'OFI (Opportunity)'],
    datasets: [{
      data: [findingStats.nc, findingStats.obs, findingStats.ofi],
      backgroundColor: ['#dc2626', '#f59e0b', '#3b82f6'],
      borderColor: ['#ffffff', '#ffffff', '#ffffff'],
      borderWidth: 2,
    }]
  };

  // Findings Status Chart
  const findingsStatusData = {
    labels: ['Open', 'In Progress', 'Closed'],
    datasets: [{
      label: 'Number of Findings',
      data: [findingStats.open, findingStats.inProgress, findingStats.closed],
      backgroundColor: ['#ef4444', '#fbbf24', '#22c55e'],
      borderColor: '#ffffff',
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12, family: "'Inter', sans-serif" },
          color: '#1e3a5f'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 58, 95, 0.9)',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#6b7280',
          font: { size: 11 }
        },
        grid: {
          color: '#e5e7eb'
        }
      },
      x: {
        ticks: {
          color: '#6b7280',
          font: { size: 11 }
        },
        grid: {
          display: false
        }
      }
    }
  };

  const downloadReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalRisks: riskStats.total,
        highRisks: riskStats.high,
        totalFindings: findingStats.total,
        openFindings: findingStats.open,
        totalAudits: auditPlan.length,
        kpiPerformance: `${kpiStats.avgPerformance}%`
      },
      riskStatistics: riskStats,
      findingStatistics: findingStats,
      kpiStatistics: kpiStats,
      detailedRisks: risks,
      detailedFindings: findings,
      auditPlan: auditPlan,
      kpis: kpis
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ims-audit-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    // Combine all risks data into CSV format
    const headers = ['ID', 'Area', 'Description', 'Cause', 'Impact', 'Likelihood', 'Impact Score', 'Risk Score', 'Owner', 'Controls'];
    const rows = risks.map(r => [
      r.id,
      r.area,
      `"${r.description}"`,
      `"${r.cause}"`,
      `"${r.impact}"`,
      r.L,
      r.I,
      Number(r.L) * Number(r.I),
      r.owner,
      `"${r.controls}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ims-risks-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadChartImage = (chartId, chartName) => {
    const canvas = document.querySelector(`#${chartId} canvas`);
    if (!canvas) return;

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chartName}-${new Date().toISOString().split('T')[0]}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const downloadAllCharts = () => {
    ['risk-distribution', 'risk-by-area', 'findings-distribution', 'findings-status'].forEach((chartId, idx) => {
      setTimeout(() => {
        const canvas = document.querySelector(`#${chartId} canvas`);
        if (canvas) {
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chart-${chartId}-${new Date().toISOString().split('T')[0]}.png`;
            a.click();
            URL.revokeObjectURL(url);
          });
        }
      }, idx * 300);
    });
  };

  const downloadPrintable = () => {
    const reportContent = `
IMS AUDIT MANAGEMENT SYSTEM - COMPREHENSIVE REPORT
Generated: ${new Date().toLocaleString()}
============================================================

EXECUTIVE SUMMARY
-----------------
Total Risks: ${riskStats.total} (${riskStats.high} High, ${riskStats.medium} Medium, ${riskStats.low} Low)
Total Findings: ${findingStats.total} (${findingStats.open} Open, ${findingStats.inProgress} In Progress, ${findingStats.closed} Closed)
Scheduled Audits: ${auditPlan.length}
KPI Performance: ${kpiStats.avgPerformance}% (${kpiStats.onTarget}/${kpiStats.total} targets met)

RISK DETAILS
------------
${risks.map((r, i) => `
${i + 1}. [${r.area}] ${r.description}
   Risk Score: ${Number(r.L) * Number(r.I)} (L:${r.L} × I:${r.I})
   Owner: ${r.owner}
   Controls: ${r.controls}
`).join('')}

FINDINGS DETAILS
----------------
${findings.map((f, i) => `
${i + 1}. [${f.type}] ${f.description}
   Status: ${f.status}
   Responsible: ${f.responsible}
   ${f.action ? `Action: ${f.action}` : ''}
`).join('')}

AUDIT PLAN
----------
${auditPlan.map((a, i) => `
${i + 1}. ${a.area} - ${a.date}
   Auditor: ${a.auditor}
   Scope: ${a.scope}
`).join('')}

============================================================
End of Report
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ims-audit-full-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px", flexWrap:"wrap", gap:"12px"}}>
        <div>
          <h2 className="h1">Comprehensive Audit Reports & Analytics</h2>
          <p className="muted">Detailed analysis of risks, findings, KPIs, and audit performance across all management systems.</p>
        </div>
        <div style={{display:"flex", gap:"10px", flexWrap:"wrap"}}>
          <button className="btn" onClick={downloadReport} style={{background:"linear-gradient(135deg, #2563eb 0%, #1e40af 100%)", color:"white", padding:"10px 20px", borderRadius:"8px", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"13px", boxShadow:"0 2px 8px rgba(37, 99, 235, 0.3)"}}>
            📊 JSON Report
          </button>
          <button className="btn" onClick={downloadCSV} style={{background:"linear-gradient(135deg, #10b981 0%, #059669 100%)", color:"white", padding:"10px 20px", borderRadius:"8px", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"13px", boxShadow:"0 2px 8px rgba(16, 185, 129, 0.3)"}}>
            📑 CSV Export
          </button>
          <button className="btn" onClick={downloadPrintable} style={{background:"linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", color:"white", padding:"10px 20px", borderRadius:"8px", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"13px", boxShadow:"0 2px 8px rgba(139, 92, 246, 0.3)"}}>
            📄 Text Report
          </button>
          <button className="btn" onClick={downloadAllCharts} style={{background:"linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color:"white", padding:"10px 20px", borderRadius:"8px", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"13px", boxShadow:"0 2px 8px rgba(245, 158, 11, 0.3)"}}>
            📈 All Charts
          </button>
        </div>
      </div>

      <hr style={{margin:"20px 0"}} />

      {/* Summary Statistics Cards */}
      <h3 style={{margin:"0 0 16px", fontSize:"16px", fontWeight:"600", color:"#1e3a5f"}}>Executive Summary</h3>
      <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"16px", marginBottom:"32px"}}>
        <div className="card" style={{background:"linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", borderLeft:"4px solid #2563eb", padding:"20px"}}>
          <div style={{fontSize:"28px", fontWeight:"700", color:"#1e3a5f", marginBottom:"4px"}}>
            {riskStats.total}
          </div>
          <div style={{fontSize:"13px", color:"#6b7280", fontWeight:"500"}}>Total Risks</div>
          <div style={{fontSize:"11px", color:"#dc2626", marginTop:"6px"}}>
            {riskStats.high} High Priority
          </div>
        </div>

        <div className="card" style={{background:"linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", borderLeft:"4px solid #f59e0b", padding:"20px"}}>
          <div style={{fontSize:"28px", fontWeight:"700", color:"#1e3a5f", marginBottom:"4px"}}>
            {findingStats.total}
          </div>
          <div style={{fontSize:"13px", color:"#6b7280", fontWeight:"500"}}>Total Findings</div>
          <div style={{fontSize:"11px", color:"#dc2626", marginTop:"6px"}}>
            {findingStats.open} Open
          </div>
        </div>

        <div className="card" style={{background:"linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", borderLeft:"4px solid #10b981", padding:"20px"}}>
          <div style={{fontSize:"28px", fontWeight:"700", color:"#1e3a5f", marginBottom:"4px"}}>
            {auditPlan.length}
          </div>
          <div style={{fontSize:"13px", color:"#6b7280", fontWeight:"500"}}>Scheduled Audits</div>
          <div style={{fontSize:"11px", color:"#1e3a5f", marginTop:"6px"}}>
            Risk-based planning
          </div>
        </div>

        <div className="card" style={{background:"linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)", borderLeft:"4px solid #8b5cf6", padding:"20px"}}>
          <div style={{fontSize:"28px", fontWeight:"700", color:"#1e3a5f", marginBottom:"4px"}}>
            {kpiStats.avgPerformance}%
          </div>
          <div style={{fontSize:"13px", color:"#6b7280", fontWeight:"500"}}>KPI Performance</div>
          <div style={{fontSize:"11px", color:"#10b981", marginTop:"6px"}}>
            {kpiStats.onTarget}/{kpiStats.total} on target
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <h3 style={{margin:"0 0 16px", fontSize:"16px", fontWeight:"600", color:"#1e3a5f"}}>Visual Analytics</h3>
      <div style={{display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"24px", marginBottom:"32px"}}>
        <div className="card" style={{padding:"24px", position:"relative"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px"}}>
            <h4 style={{margin:"0", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>
              Risk Distribution by Severity
            </h4>
            <button 
              onClick={() => downloadChartImage('risk-distribution', 'risk-distribution')}
              style={{background:"transparent", border:"1px solid #2563eb", color:"#2563eb", padding:"6px 12px", borderRadius:"6px", cursor:"pointer", fontSize:"11px", fontWeight:"600"}}
            >
              💾 Save
            </button>
          </div>
          <div id="risk-distribution" style={{maxWidth:"320px", margin:"0 auto"}}>
            <Pie data={riskDistributionData} options={chartOptions} />
          </div>
        </div>

        <div className="card" style={{padding:"24px", position:"relative"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px"}}>
            <h4 style={{margin:"0", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>
              Risks by Management System Area
            </h4>
            <button 
              onClick={() => downloadChartImage('risk-by-area', 'risk-by-area')}
              style={{background:"transparent", border:"1px solid #2563eb", color:"#2563eb", padding:"6px 12px", borderRadius:"6px", cursor:"pointer", fontSize:"11px", fontWeight:"600"}}
            >
              💾 Save
            </button>
          </div>
          <div id="risk-by-area">
            <Bar data={riskByAreaData} options={barChartOptions} />
          </div>
        </div>

        <div className="card" style={{padding:"24px", position:"relative"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px"}}>
            <h4 style={{margin:"0", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>
              Findings Distribution by Type
            </h4>
            <button 
              onClick={() => downloadChartImage('findings-distribution', 'findings-distribution')}
              style={{background:"transparent", border:"1px solid #2563eb", color:"#2563eb", padding:"6px 12px", borderRadius:"6px", cursor:"pointer", fontSize:"11px", fontWeight:"600"}}
            >
              💾 Save
            </button>
          </div>
          <div id="findings-distribution" style={{maxWidth:"320px", margin:"0 auto"}}>
            <Doughnut data={findingsDistributionData} options={chartOptions} />
          </div>
        </div>

        <div className="card" style={{padding:"24px", position:"relative"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px"}}>
            <h4 style={{margin:"0", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>
              Findings Status Tracking
            </h4>
            <button 
              onClick={() => downloadChartImage('findings-status', 'findings-status')}
              style={{background:"transparent", border:"1px solid #2563eb", color:"#2563eb", padding:"6px 12px", borderRadius:"6px", cursor:"pointer", fontSize:"11px", fontWeight:"600"}}
            >
              💾 Save
            </button>
          </div>
          <div id="findings-status">
            <Bar data={findingsStatusData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Statistics Tables */}
      <h3 style={{margin:"0 0 16px", fontSize:"16px", fontWeight:"600", color:"#1e3a5f"}}>Detailed Statistics</h3>
      <div style={{display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"20px"}}>
        <div className="card" style={{padding:"20px"}}>
          <h4 style={{margin:"0 0 12px", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>Risk Breakdown</h4>
          <table style={{fontSize:"13px"}}>
            <tbody>
              <tr>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb"}}>Total Risks</td>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb", textAlign:"right", fontWeight:"600"}}>{riskStats.total}</td>
              </tr>
              <tr>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb", color:"#dc2626"}}>High Risk (13-25)</td>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb", textAlign:"right", fontWeight:"600", color:"#dc2626"}}>{riskStats.high}</td>
              </tr>
              <tr>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb", color:"#f59e0b"}}>Medium Risk (7-12)</td>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb", textAlign:"right", fontWeight:"600", color:"#f59e0b"}}>{riskStats.medium}</td>
              </tr>
              <tr>
                <td style={{padding:"8px 0", color:"#10b981"}}>Low Risk (1-6)</td>
                <td style={{padding:"8px 0", textAlign:"right", fontWeight:"600", color:"#10b981"}}>{riskStats.low}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card" style={{padding:"20px"}}>
          <h4 style={{margin:"0 0 12px", fontSize:"14px", fontWeight:"600", color:"#1e3a5f"}}>Findings Breakdown</h4>
          <table style={{fontSize:"13px"}}>
            <tbody>
              <tr>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb"}}>Total Findings</td>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb", textAlign:"right", fontWeight:"600"}}>{findingStats.total}</td>
              </tr>
              <tr>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb", color:"#dc2626"}}>Non-Conformities (NC)</td>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb", textAlign:"right", fontWeight:"600", color:"#dc2626"}}>{findingStats.nc}</td>
              </tr>
              <tr>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb", color:"#f59e0b"}}>Observations (OBS)</td>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb", textAlign:"right", fontWeight:"600", color:"#f59e0b"}}>{findingStats.obs}</td>
              </tr>
              <tr>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb", color:"#3b82f6"}}>Opportunities (OFI)</td>
                <td style={{padding:"8px 0", borderBottom:"1px solid #e5e7eb", textAlign:"right", fontWeight:"600", color:"#3b82f6"}}>{findingStats.ofi}</td>
              </tr>
              <tr>
                <td style={{padding:"8px 0", color:"#dc2626"}}>Open Items</td>
                <td style={{padding:"8px 0", textAlign:"right", fontWeight:"600", color:"#dc2626"}}>{findingStats.open}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
