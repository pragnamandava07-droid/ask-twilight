"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AllAccounts() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);

  async function load() {
    try {
      const r = await fetch("/api/accounts");
      const d = await r.json();
      setAccounts(Array.isArray(d) ? d : []);
    } catch {}
    setLoaded(true);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(a: any) {
    if (!confirm(`Delete "${a.name}" and everything saved for it? This can't be undone.`)) return;
    setBusy(a.id);
    await fetch(`/api/accounts/${a.id}`, { method: "DELETE" });
    setBusy(null);
    await load();
    window.dispatchEvent(new Event("accounts-changed"));
  }

  return (
    <main className="max-w-4xl mx-auto px-5 py-10 space-y-6">
      <header className="text-center space-y-2 rise">
        <div className="text-5xl float">🗂️</div>
        <h1 className="font-grove text-4xl glow-text">All accounts</h1>
        <p className="opacity-80">Every customer, all in one place.</p>
      </header>

      {!loaded && <p className="text-center opacity-70">Loading…</p>}
      {loaded && accounts.length === 0 && (
        <div className="grove-card text-center">No accounts yet. Add your first conversation to get started!</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {accounts.map((a) => (
          <div key={a.id} className="grove-card rise" style={{ position: "relative" }}>
            <Link href={`/accounts/${a.id}`} className="lift" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="flex items-center gap-3">
                <div className="avatar">{a.name?.[0]}</div>
                <div>
                  <h3 className="font-grove text-xl">{a.name}</h3>
                  <p className="text-sm opacity-70">{a.interactions} conversations</p>
                </div>
              </div>
              <div className="mt-3">
                <span className="badge">{a.open_commitments} open commitments</span>
              </div>
            </Link>
            <button
              onClick={() => remove(a)}
              disabled={busy === a.id}
              className="chip"
              style={{ position: "absolute", top: "1rem", right: "1rem", color: "#ffb4a0", borderColor: "rgba(255,150,120,.5)" }}
              title="Delete this account"
            >
              {busy === a.id ? "Deleting…" : "🗑 Delete"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}