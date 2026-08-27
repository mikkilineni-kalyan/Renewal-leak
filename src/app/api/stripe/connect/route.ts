import { NextResponse } from "next/server";
import { getConnectAuthorizeUrl } from "@/lib/stripe";
import { getOrCreateWorkspace } from "@/lib/workspace";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  try {
    const workspace = await getOrCreateWorkspace();
    const url = getConnectAuthorizeUrl(workspace.id);
    return NextResponse.redirect(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe Connect is not configured";
    return NextResponse.redirect(`${appUrl}/?error=${encodeURIComponent(message)}`);
  }
}
