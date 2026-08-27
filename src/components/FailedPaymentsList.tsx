import { formatCents } from "@/lib/money";

type Payment = {
  id: string;
  amountCents: number;
  currency: string;
  declineCode: string | null;
  status: string;
  source: string;
  failedAt: Date;
  customer: { email: string; name: string | null } | null;
};

export function FailedPaymentsList({
  payments,
  filterLabel,
}: {
  payments: Payment[];
  filterLabel?: string;
}) {
  if (payments.length === 0) {
    return (
      <section className="card empty">
        <h2>No failed payments yet</h2>
        <p>Connect Stripe or upload a CSV to populate this list.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="row" style={{ marginBottom: 8 }}>
        <strong>Failed payments</strong>
        {filterLabel ? <span className="muted">{filterLabel}</span> : null}
      </div>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Amount</th>
            <th>Decline</th>
            <th>Source</th>
            <th>Failed</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.customer?.email ?? "—"}</td>
              <td>{formatCents(p.amountCents, p.currency)}</td>
              <td>
                <span className="pill">{p.declineCode?.trim() ? p.declineCode : "unknown"}</span>
              </td>
              <td>{p.source}</td>
              <td>{new Date(p.failedAt).toLocaleString()}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
