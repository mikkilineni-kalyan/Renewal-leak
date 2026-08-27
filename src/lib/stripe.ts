import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key);
}

export function getConnectAuthorizeUrl(state: string) {
  const clientId = process.env.STRIPE_CLIENT_ID;
  const redirectUri = process.env.STRIPE_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    throw new Error("STRIPE_CLIENT_ID or STRIPE_REDIRECT_URI is not set");
  }
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: "read_write",
    redirect_uri: redirectUri,
    state,
  });
  return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
}
