import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateWorkspace } from "@/lib/workspace";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell.trim());
      cell = "";
    } else if (ch === "\n") {
      row.push(cell.trim());
      if (row.some((c) => c.length)) rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  row.push(cell.trim());
  if (row.some((c) => c.length)) rows.push(row);
  return rows;
}

function centsFromAmount(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  if (cleaned.includes(".")) return Math.round(Number(cleaned) * 100);
  return Number(cleaned);
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCsv(text);
  if (rows.length < 2) {
    return NextResponse.json({ error: "CSV needs a header row and at least one data row" }, { status: 400 });
  }

  const header = rows[0].map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const idx = (names: string[]) => names.map((n) => header.indexOf(n)).find((i) => i >= 0) ?? -1;
  const emailI = idx(["email", "customer_email"]);
  const amountI = idx(["amount_cents", "amount", "amount_usd"]);
  const currencyI = idx(["currency"]);
  const declineI = idx(["decline_code", "decline"]);
  const nameI = idx(["name", "customer_name"]);
  const failedI = idx(["failed_at", "failed_on", "date"]);

  if (emailI < 0 || amountI < 0) {
    return NextResponse.json(
      { error: "CSV must include email and amount (or amount_cents) columns" },
      { status: 400 },
    );
  }

  const workspace = await getOrCreateWorkspace();
  let imported = 0;

  for (const cols of rows.slice(1)) {
    const email = (cols[emailI] ?? "").toLowerCase();
    if (!email || !email.includes("@")) continue;
    const amountCents = centsFromAmount(cols[amountI] ?? "0");
    if (!amountCents) continue;
    const currency = (cols[currencyI] ?? "usd").toLowerCase() || "usd";
    const declineCode = declineI >= 0 ? cols[declineI] || null : null;
    const name = nameI >= 0 ? cols[nameI] || null : null;
    const failedAt = failedI >= 0 && cols[failedI] ? new Date(cols[failedI]) : new Date();

    const customer = await prisma.customer.upsert({
      where: { workspaceId_email: { workspaceId: workspace.id, email } },
      update: name ? { name } : {},
      create: { workspaceId: workspace.id, email, name },
    });

    await prisma.failedPayment.create({
      data: {
        workspaceId: workspace.id,
        customerId: customer.id,
        amountCents,
        currency,
        declineCode,
        status: "open",
        source: "csv",
        failedAt: Number.isNaN(failedAt.getTime()) ? new Date() : failedAt,
      },
    });
    imported += 1;
  }

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: { lastSyncAt: new Date() },
  });

  return NextResponse.json({ imported });
}
