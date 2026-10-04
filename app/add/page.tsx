"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MicRecorder from "@/components/MicRecorder";

type Attached = { name: string; mimeType: string; data: string; size: number };

const MAX_TOTAL = 3 * 1024 * 1024; // 3 MB total, keeps uploads fast and reliable

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function AddPage() {
  const router = useRouter();
  const [accountName, setAccountName] = useState("");
  const [source, setSource] = useState("meeting");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<Attached[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function addFiles(list: FileList | null) {
    if (!list) return;
    setError("");
    const next = [...files];
    for (const f of Array.from(list)) {
      const isTextFile = f.type.startsWith("text/") || /\.(txt|md|csv)$/i.test(f.name);
      if (isTextFile) {
        const t = await f.text();
        setText((prev) => (prev ? prev + "\n\n" : "") + t);
        continue;
      }
      const ok = f.type.startsWith("image/") || f.type.startsWith("audio/") || f.type === "application/pdf";
      if (!ok) {
        setError(`"${f.name}" isn't supported. Try a photo, PDF, audio file, or .txt.`);
        continue;
      }
      const total = next.reduce((s, x) => s + x.size, 0) + f.size;
      if (total > MAX_TOTAL) {
        setError("Files are too big. Keep the total under 3 MB (try a smaller photo).");
        continue;
      }
      next.push({ name: f.name, mimeType: f.type, data: await readAsBase64(f), size: f.size });
    }
    setFiles(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountName,
          source,
          text,
          files: files.map(({ name, mimeType, data }) => ({ name, mimeType, data })),
        }),
      });
      const json = await res.json();
      if (json.ok) router.push(`/accounts/${json.accountId}`);
      else setError("The fireflies are busy right now. Please try again in a moment. 🌙");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  const icon = (m: string) => (m.startsWith("image/") ? "🖼️" : m.startsWith("audio/") ? "🎵" : "📄");
  const canSubmit = accountName && (text.trim() || files.length > 0);

  return (
    <main className="max-w-2xl mx-auto px-5 py-10 space-y-5">
      <Link href="/" className="back-link">← Back to the grove</Link>
      <div className="text-center space-y-2 rise">
        <div className="text-5xl float">🌱</div>
        <h1 className="font-grove text-4xl glow-text">Plant a new memory</h1>
        <p className="opacity-80">Paste notes, record a meeting, or drop in photos and files. Watch them grow into insights.</p>
      </div>

      <div className="grove-card space-y-4">
        <input className="field" placeholder="Which customer? (e.g. Acme Corp)" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
        <select className="field" value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="meeting">🗣️ Meeting</option>
          <option value="email">💌 Email</option>
          <option value="call">📞 Call</option>
          <option value="chat">💬 Chat</option>
        </select>

        <MicRecorder onText={(t) => setText((prev) => (prev ? prev + "\n" : "") + t)} />

        <textarea className="field" style={{ height: "10rem" }} placeholder="Paste a transcript, email, or call notes here…" value={text} onChange={(e) => setText(e.target.value)} />

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          className="cursor-pointer text-center rounded-2xl p-5 transition"
          style={{
            border: "2px dashed rgba(255,214,120,.5)",
            background: dragging ? "rgba(245,195,90,.15)" : "rgba(255,255,255,.04)",
          }}
        >
          <div className="text-3xl">📎</div>
          <p className="font-bold">Drop files or photos here, or tap to choose</p>
          <p className="text-sm opacity-70">Photos of notes or whiteboards, screenshots, PDFs, audio, .txt (4 MB max total)</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,audio/*,application/pdf,.txt,.md,.csv"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="tag tag-good flex items-center justify-between gap-2">
                <span className="truncate">{icon(f.mimeType)} {f.name} <span className="opacity-60 text-xs">({Math.round(f.size / 1024)} KB)</span></span>
                <button className="chip" onClick={() => setFiles(files.filter((_, j) => j !== i))}>✕</button>
              </div>
            ))}
          </div>
        )}

        <button className="btn-magic w-full" onClick={submit} disabled={loading || !canSubmit}>
          {loading ? "✨ Sprinkling magic…" : "✨ Grow insights"}
        </button>
        {error && <p className="text-orange-300">{error}</p>}
      </div>
    </main>
  );
}