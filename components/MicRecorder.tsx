"use client";
import { useRef, useState } from "react";

export default function MicRecorder({ onText }: { onText: (t: string) => void }) {
  const [listening, setListening] = useState(false);
  const [live, setLive] = useState("");
  const recRef = useRef<any>(null);
  const finalRef = useRef("");

  function start() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Live recording works in Chrome or Edge.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    finalRef.current = "";
    setLive("");

    rec.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalRef.current += t + " ";
        else interim += t;
      }
      setLive(finalRef.current + interim);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => {
      setListening(false);
      const t = finalRef.current.trim();
      if (t) onText(t);
      setLive("");
    };

    recRef.current = rec;
    setListening(true);
    rec.start();
  }

  function stop() {
    recRef.current?.stop();
  }

  return (
    <div className="space-y-2">
      {!listening ? (
        <button type="button" className="btn-soft" onClick={start}>
          🎙️ Record a meeting live
        </button>
      ) : (
        <button type="button" className="btn-magic" onClick={stop}>
          ⏹️ Stop and add to notes
        </button>
      )}
      {listening && (
        <div className="bubble-ai text-sm">
          <span className="animate-pulse">🔴 Listening…</span>
          <p className="mt-1 opacity-90">{live || "Start talking, and your words will appear here."}</p>
        </div>
      )}
    </div>
  );
}
