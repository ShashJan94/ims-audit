import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function KpiDashboard({ kpis, risks, findings }) {
  const labels = kpis.map(k => k.name);
  const values = kpis.map(k => k.value);
  const targets = kpis.map(k => k.target);

  const highRisks = risks ? risks.filter(r => Number(r.L) * Number(r.I) >= 13).length : 0;
  const totalRisks = risks ? risks.length : 0;
  const openFindings = findings ? findings.filter(f => f.status !== "Closed").length : 0;

  const data = {
    labels,
    datasets: [
      { 
        label: "Current", 
        data: values,
        backgroundColor: '#1b5e20', // Bottle Green
        borderColor: '#0d3315',
        borderWidth: 1,
        borderRadius: 6,
      },
      { 
        label: "Target", 
        data: targets,
        backgroundColor: '#d32f2f', // Scarlet Red
        borderColor: '#b71c1c',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { 
      legend: { 
        position: "top",
        labels: {
          font: { size: 13, weight: '600', family: "'Segoe UI', sans-serif" },
          color: '#1a1a1a',
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      }, 
      title: { 
        display: true, 
        text: "Performance Monitoring (Current vs Target)",
        font: { size: 16, weight: '700', family: "'Segoe UI', sans-serif" },
        color: '#1e3a5f',
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 58, 95, 0.95)',
        titleFont: { size: 13, weight: '600' },
        bodyFont: { size: 13 },
        padding: 12,
        displayColors: true,
        borderColor: '#1b5e20',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: { size: 12 }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <div className="card">
      <h2 className="h1">Performance Monitoring Dashboard</h2>
      <p className="muted">Track key performance indicators across your integrated management system. Green shows current performance, Red shows target goals.</p>

      <div className="card" style={{background:"linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)", borderLeft:"4px solid #0284c7", marginTop:"16px", marginBottom:"20px", padding:"16px"}}>
        <h3 style={{margin:"0 0 8px", fontSize:"14px", fontWeight:"700", color:"#0c4a6e"}}>
          📊 Dynamic KPI Updates
        </h3>
        <p style={{margin:"0", fontSize:"13px", color:"#0c4a6e", lineHeight:"1.6"}}>
          These KPIs update automatically based on your risk and finding data:
        </p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"12px", marginTop:"12px"}}>
          <div style={{fontSize:"12px", color:"#0c4a6e"}}>
            <strong>Risks:</strong> {totalRisks} total ({highRisks} high)
          </div>
          <div style={{fontSize:"12px", color:"#0c4a6e"}}>
            <strong>Findings:</strong> {openFindings} open
          </div>
          <div style={{fontSize:"12px", color:"#0c4a6e"}}>
            <strong>Updates:</strong> Real-time
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px', padding: '12px 0' }}>
        <Bar data={data} options={options} />
      </div>

      <hr />

      <table>
        <thead>
          <tr>
            <th>KPI</th><th>Domain</th><th>Baseline</th><th>Target</th><th>Current</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {kpis.map((k, idx) => {
            const status = k.value >= k.target ? 'On Track' : 'Below Target';
            const statusColor = k.value >= k.target ? '#1b5e20' : '#d32f2f';
            const statusIcon = k.value >= k.target ? '●' : '▲';
            return (
              <tr key={idx}>
                <td><b>{k.name}</b></td>
                <td>{k.domain}</td>
                <td>{k.baseline}{k.unit}</td>
                <td><strong style={{color: '#d32f2f'}}>{k.target}{k.unit}</strong></td>
                <td><strong style={{color: '#1b5e20'}}>{k.value}{k.unit}</strong></td>
                <td><span style={{color: statusColor, fontWeight: '600'}}>{statusIcon} {status}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
