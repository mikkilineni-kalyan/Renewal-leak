import { prisma } from "@/lib/prisma";
import { getOrCreateWorkspace } from "@/lib/workspace";
import { ConnectStripe } from "@/components/ConnectStripe";
import { CsvUpload } from "@/components/CsvUpload";
import { FailedPaymentsList } from "@/components/FailedPaymentsList";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string; imported?: string }>;
}) {
  const params = await searchParams;
  const workspace = await getOrCreateWorkspace();
  const payments = await prisma.failedPayment.findMany({
    where: { workspaceId: workspace.id },
    include: { customer: true },
    orderBy: { failedAt: "desc" },
    take: 100,
  });

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <div className="brand">Renewal Leak</div>
          <div className="muted">Failed-renewal recovery for micro-SaaS</div>
        </div>
        <div className="muted" style={{ textAlign: "right" }}>
          {workspace.stripeAccountId ? (
            <>
              Connected · {workspace.stripeAccountId}
              <br />
            </>
          ) : (
            <>
              Stripe not connected
              <br />
            </>
          )}
          Last sync: {workspace.lastSyncAt ? workspace.lastSyncAt.toISOString() : "never"}
        </div>
      </header>

      {params.error ? <div className="flash err">{params.error}</div> : null}
      {params.connected ? <div className="flash ok">Stripe account connected.</div> : null}
      {params.imported ? (
        <div className="flash ok">Imported {params.imported} failed payment(s).</div>
      ) : null}

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row">
          <div>
            <strong>Connect & ingest</strong>
            <div className="muted">OAuth into Stripe Connect or upload a failed-payments CSV.</div>
          </div>
          <div className="actions">
            <ConnectStripe connected={Boolean(workspace.stripeAccountId)} />
            <CsvUpload />
          </div>
        </div>
      </div>

      <FailedPaymentsList payments={payments} />
    </main>
  );
}
