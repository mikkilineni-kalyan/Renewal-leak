import Link from "next/link";
import { formatCents } from "@/lib/money";

export type CodeBucket = {
  code: string;
  cents: number;
  count: number;
};

function href(code: string) {
  return code === "all" ? "/" : `/?code=${encodeURIComponent(code)}`;
}

export function FailingBreakdown({
  totalCents,
  buckets,
  activeCode,
}: {
  totalCents: number;
  buckets: CodeBucket[];
  activeCode: string;
}) {
  return (
    <section className="card leak" style={{ marginBottom: 16 }}>
      <div className="row" style={{ alignItems: "flex-end", marginBottom: 16 }}>
        <div>
          <div className="muted">Failing $ · last 30 days · open</div>
          <div className="leak-total">{formatCents(totalCents)}</div>
        </div>
        <Link className={`chip ${activeCode === "all" ? "on" : ""}`} href={href("all")}>
          All
        </Link>
      </div>
      {buckets.length === 0 ? (
        <p className="muted" style={{ margin: 0 }}>
          No open failures in the last 30 days. Upload the sample CSV to see a breakdown.
        </p>
      ) : (
        <div className="code-grid">
          {buckets.map((b) => (
            <Link
              key={b.code}
              href={href(b.code)}
              className={`code-tile ${activeCode === b.code ? "on" : ""}`}
            >
              <div className="code-name">{b.code}</div>
              <div className="code-amt">{formatCents(b.cents)}</div>
              <div className="muted">
                {b.count} payment{b.count === 1 ? "" : "s"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
