"use client";
import { useState } from "react";

export default function BriefButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function play() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/brief", { method: "POST" });
      if (!res.ok) throw new Error("failed");
      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      await audio.play();
    } catch {
      setError("Couldn't play the brief. Check the terminal for details.");
    }
    setLoading(false);
  }

  return (
    <div>
      <button className="btn-soft" onClick={play} disabled={loading}>
        {loading ? "🎶 Preparing your brief…" : "🔊 Hear today's brief"}
      </button>
      {error && <p className="text-orange-300 text-sm mt-1">{error}</p>}
    </div>
  );
}
