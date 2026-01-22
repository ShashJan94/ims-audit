import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function KpiDashboard({ kpis }) {
  const labels = kpis.map(k => k.name);
  const values = kpis.map(k => k.value);
  const targets = kpis.map(k => k.target);

  const data = {
    labels,
    datasets: [
      { label: "Current", data: values },
      { label: "Target", data: targets },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: true, text: "IMS KPIs (Current vs Target)" } },
  };

  return (
    <div className="card">
      <h2 className="h1">Performance Monitoring (KPI Dashboard)</h2>
      <p className="muted">Simple dashboard to support evidence-based decisions and management review.</p>

      <Bar data={data} options={options} />

      <hr />

      <table>
        <thead>
          <tr>
            <th>KPI</th><th>Domain</th><th>Baseline</th><th>Target</th><th>Current</th>
          </tr>
        </thead>
        <tbody>
          {kpis.map((k, idx) => (
            <tr key={idx}>
              <td><b>{k.name}</b></td>
              <td>{k.domain}</td>
              <td>{k.baseline}{k.unit}</td>
              <td>{k.target}{k.unit}</td>
              <td>{k.value}{k.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
