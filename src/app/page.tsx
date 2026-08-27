import { prisma } from "@/lib/prisma";
import { getOrCreateWorkspace } from "@/lib/workspace";
import { FailedPaymentsList } from "@/components/FailedPaymentsList";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
          Stripe not connected
          <br />
          Last sync: {workspace.lastSyncAt ? workspace.lastSyncAt.toISOString() : "never"}
        </div>
      </header>
      <FailedPaymentsList payments={payments} />
    </main>
  );
}
