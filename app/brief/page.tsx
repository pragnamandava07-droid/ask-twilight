import BriefButton from "@/components/BriefButton";

export default function BriefPage() {
  return (
    <main className="max-w-2xl mx-auto px-5 py-10 space-y-6">
      <header className="text-center space-y-2 rise">
        <div className="text-5xl float">🔊</div>
        <h1 className="font-grove text-4xl glow-text">Daily voice brief</h1>
        <p className="opacity-80">A friendly voice reads out your open commitments across every account.</p>
      </header>

      <div className="grove-card text-center space-y-4">
        <p>Press play to hear what needs your attention today.</p>
        <div className="flex justify-center">
          <BriefButton />
        </div>
      </div>
    </main>
  );
}
