import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-5 py-10 space-y-6">
      <header className="text-center space-y-3">
        <div className="text-6xl float title-reveal">💫</div>
        <h1 className="font-grove text-6xl glow-text title-reveal">Ask Twilight</h1>
        <p className="text-lg opacity-80 fade-late">Connect the roots of your business knowledge.</p>
      </header>

      <div className="fade-late">
        <Chat
          suggestions={[
            "Show me all customers interested in payroll integration",
            "Which accounts are at risk of churning?",
            "What risks should I worry about across accounts?",
            "What are the open commitments for Priya?",
          ]}
        />
      </div>
    </main>
  );
}
