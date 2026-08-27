"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CsvUpload() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/csv", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        router.push(`/?error=${encodeURIComponent(data.error ?? "CSV import failed")}`);
        return;
      }
      router.push(`/?imported=${data.imported ?? 0}`);
      router.refresh();
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <label className="btn">
      {busy ? "Uploading…" : "Upload CSV"}
      <input type="file" accept=".csv,text/csv" hidden disabled={busy} onChange={onChange} />
    </label>
  );
}
