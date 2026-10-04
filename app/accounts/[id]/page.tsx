"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Chat from "@/components/Chat";

const ICONS: Record<string, string> = { meeting: "🗣️", email: "💌", call: "📞", chat: "💬" };

export default function AccountPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);

  async function load() {
    const r = await fetch(`/api/accounts/${id}`);
    setData(await r.json());
  }
  useEffect(() => { load(); }, [id]);

  async function toggle(cid: number) {
    await fetch(`/api/commitments/${cid}`, { method: "PATCH" });
    load();
  }

  if (!data) return <main className="p-10 text-center opacity-80">Gathering the fireflies… ✨</main>;

  const block = (title: string, items: string[], cls: string) =>
    items?.length > 0 && (
      <div className={`tag ${cls}`}>
        <b>{title}</b>
        <ul className="list-disc ml-5 mt-1">
          {items.map((x, i) => <li key={i}>{x}</li>)}
        </ul>
      </div>
    );

  return (
    <main className="max-w-3xl mx-auto px-5 py-10 space-y-6">
      <Link href="/" className="back-link">← Back to home</Link>

      <div className="flex items-center gap-4 rise">
        <div className="avatar">{data.account?.name?.[0]}</div>
        <h1 className="font-grove text-4xl glow-text">{data.account?.name}</h1>
      </div>

      <Chat
        accountId={id}
        suggestions={[
          "What are the open commitments and next steps?",
          "What are the biggest risks?",
          "Summarize our history with this account",
        ]}
      />

      <section className="grove-card">
        <h2 className="font-grove text-2xl mb-2">🌿 Promises to keep</h2>
        {data.commitments.length === 0 && <p className="opacity-70">Nothing yet. All clear! 🌙</p>}
        {data.commitments.map((c: any) => (
          <label key={c.id} className="flex items-start gap-3 py-1.5 cursor-pointer">
            <input type="checkbox" className="check" checked={c.done} onChange={() => toggle(c.id)} />
            <span className={c.done ? "line-through opacity-50" : ""}>
              {c.task}
              <span className="block text-sm opacity-70">👤 {c.owner} · 🗓️ {c.due}</span>
            </span>
          </label>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-grove text-2xl">📖 The story so far</h2>
        {data.interactions.map((i: any) => (
          <div key={i.id} className="grove-card rise space-y-3">
            <p className="text-sm opacity-70">
              {ICONS[i.source] || "🗂️"} {i.source} · {new Date(i.created_at).toLocaleDateString()}
            </p>
            <p className="text-lg">{i.summary}</p>
            {block("✅ Decisions", i.decisions, "tag-good")}
            {block("🍂 Risks", i.risks, "tag-risk")}
            {block("🌸 What they need", i.needs, "tag-need")}
          </div>
        ))}
      </section>
    </main>
  );
}
