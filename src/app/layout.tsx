import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Renewal Leak",
  description: "Stripe failed-renewal recovery for micro-SaaS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
