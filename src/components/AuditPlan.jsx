export default function AuditPlan({ auditPlan }) {
  return (
    <div className="card">
      <h2 className="h1">Internal Audit Plan</h2>
      <p className="muted">
        Risk-based audit schedule. Coverage prioritizes high-risk processes and key ISO 9001, 14001, 45001 clauses.
      </p>

      <table>
        <thead>
          <tr>
            <th>Process / Area</th>
            <th>Standards</th>
            <th>Method</th>
            <th>Date</th>
            <th>Auditor</th>
            <th>Risk Focus</th>
            <th>Key Docs</th>
          </tr>
        </thead>
        <tbody>
          {auditPlan.map((a, idx) => (
            <tr key={idx}>
              <td><b>{a.process}</b></td>
              <td>{a.standards}</td>
              <td>{a.method}</td>
              <td>{a.plannedDate}</td>
              <td>{a.auditor}</td>
              <td>{a.riskFocus}</td>
              <td className="small">{a.docs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
