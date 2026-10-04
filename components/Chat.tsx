"use client";
import { useRef, useState } from "react";


export default function Chat({ accountId, suggestions }: { accountId?: string; suggestions?: string[] }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
     const [offset, setOffset] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recRef = useRef<any>(null);

  function stopAudio() {
    audioRef.current?.pause();
    setSpeaking(false);
  }

  async function speak(text: string) {
    try {
      audioRef.current?.pause();
      setSpeaking(true);
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("voice failed");
      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audioRef.current = audio;
      audio.onended = () => setSpeaking(false);
      await audio.play();
    } catch {
      setSpeaking(false);
    }
  }

  async function ask(q: string, spoken = false) {
    if (!q.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, accountId, spoken }),
      });
      const json = await res.json();
      setMessages((m) => [...m, { role: "ai", text: json.ok ? json.answer : json.error }]);
      if (json.ok && spoken) speak(json.answer);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  }

  function listen() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Voice questions work in Chrome or Edge.");
      return;
    }
    stopAudio();
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setQuestion(t);
      ask(t, true);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  return (
    <section className="grove-card space-y-3">
      <p className="text-sm opacity-70">Type a question, or tap the mic and just ask out loud.</p>

         {suggestions && suggestions.length > 0 && (
     <div className="space-y-2">
       <p className="text-sm opacity-70">Not sure what to ask? Try one of these:</p>
       <div className="flex flex-wrap gap-2">
         {Array.from({ length: Math.min(4, suggestions.length) }).map((_, i) => {
           const s = suggestions[(offset + i) % suggestions.length];
           return (
             <button key={s} className="chip" onClick={() => ask(s)} disabled={loading}>
               {s}
             </button>
           );
         })}
         {suggestions.length > 4 && (
           <button
             className="chip"
             onClick={() => setOffset((o) => (o + 4) % suggestions.length)}
           >
             ↻ More ideas
           </button>
         )}
       </div>
     </div>
   )}

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <div className={m.role === "user" ? "bubble-user" : "bubble-ai"}>
              {m.text}
              {m.role === "ai" && (
                <button className="chip ml-2" onClick={() => speak(m.text)}>🔊</button>
              )}
            </div>
          </div>
        ))}
        {loading && <p className="text-sm opacity-70">🦋 Thinking…</p>}
        {listening && <p className="text-sm animate-pulse">🔴 Listening… ask your question</p>}
        {speaking && (
          <button className="chip" onClick={stopAudio}>⏹️ Stop voice</button>
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="field"
          placeholder="Ask a question…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask(question)}
        />
        <button className="btn-soft" onClick={listen} disabled={loading || listening} title="Ask by voice">🎙️</button>
        <button className="btn-magic" onClick={() => ask(question)} disabled={loading}>Ask</button>
      </div>
    </section>
  );
}