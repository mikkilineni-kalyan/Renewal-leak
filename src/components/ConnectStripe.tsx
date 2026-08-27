export function ConnectStripe({ connected }: { connected: boolean }) {
  return (
    <a className="btn primary" href="/api/stripe/connect">
      {connected ? "Reconnect Stripe" : "Connect Stripe"}
    </a>
  );
}
