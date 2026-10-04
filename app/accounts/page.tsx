"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AllAccounts() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/accounts")
      .then((r) => r.json())
      .then((d) => setAccounts(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-5 py-10 space-y-6">
      <header className="text-center space-y-2 rise">
        <div className="text-5xl float">🌳</div>
        <h1 className="font-grove text-4xl glow-text">All accounts</h1>
        <p className="opacity-80">Every customer, all in one place.</p>
      </header>

      {!loaded && <p className="text-center opacity-70">Gathering the fireflies…</p>}
      {loaded && accounts.length === 0 && (
        <div className="grove-card text-center">🌱 No accounts yet. Add your first conversation to get started!</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {accounts.map((a) => (
          <Link key={a.id} href={`/accounts/${a.id}`} className="grove-card lift rise">
            <div className="flex items-center gap-3">
              <div className="avatar">{a.name?.[0]}</div>
              <div>
                <h3 className="font-grove text-xl">{a.name}</h3>
                <p className="text-sm opacity-70">🕯️ {a.interactions} memories</p>
              </div>
            </div>
            <div className="mt-3">
              <span className="badge">🌿 {a.open_commitments} promises to keep</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
