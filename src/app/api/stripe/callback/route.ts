import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const oauthError = req.nextUrl.searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(`${appUrl}/?error=${encodeURIComponent(oauthError)}`);
  }
  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/?error=${encodeURIComponent("Missing OAuth code")}`);
  }

  try {
    const stripe = getStripe();
    const token = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    const accountId = token.stripe_user_id;
    if (!accountId) {
      return NextResponse.redirect(`${appUrl}/?error=${encodeURIComponent("No stripe_user_id returned")}`);
    }

    await prisma.workspace.update({
      where: { id: state },
      data: {
        stripeAccountId: accountId,
        lastSyncAt: new Date(),
      },
    });

    return NextResponse.redirect(`${appUrl}/?connected=1`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "OAuth token exchange failed";
    return NextResponse.redirect(`${appUrl}/?error=${encodeURIComponent(message)}`);
  }
}
