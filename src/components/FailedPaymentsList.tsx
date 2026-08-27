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

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function FailedPaymentsList({ payments }: { payments: Payment[] }) {
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
              <td>{money(p.amountCents, p.currency)}</td>
              <td>{p.declineCode ? <span className="pill">{p.declineCode}</span> : "—"}</td>
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
