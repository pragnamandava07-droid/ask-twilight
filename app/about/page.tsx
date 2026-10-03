export default function About() {
  const steps = [
    { icon: "📥", title: "Capture", text: "Drop in meeting notes, emails, call recordings, photos, or PDFs." },
    { icon: "🧠", title: "Understand", text: "AI extracts decisions, risks, customer needs, and promises with owners and due dates." },
    { icon: "🔗", title: "Connect", text: "Everything is organized into a timeline for each customer, so nothing lives in scattered notes." },
    { icon: "💡", title: "Reuse", text: "Ask questions by typing or speaking, and hear a daily brief of what needs attention." },
  ];

  return (
    <main className="max-w-3xl mx-auto px-5 py-10 space-y-6">
      <header className="text-center space-y-2 rise">
        <div className="text-5xl float">💫</div>
        <h1 className="font-grove text-4xl glow-text">About Ask Twilight</h1>
        <p className="opacity-80">Connect the stars, come ask twilight.</p>
      </header>

      <section className="grove-card space-y-3">
  <p>
    Twilight is when the day's work settles and you take stock of what happened. Ask Twilight is for that moment:
    ask anything about your customers and get a clear answer, because the important details are usually scattered
    across meetings, emails, chats, and documents, and teams spend more time searching than acting.
  </p>
  <p>
    Ask Twilight turns those messy conversations into organized, searchable knowledge. It finds the decisions,
    risks, needs, and commitments hiding inside them, then keeps everyone aligned so nothing slips through the cracks.
  </p>
</section>

      <section className="grid gap-4 sm:grid-cols-2">
        {steps.map((s) => (
          <div key={s.title} className="grove-card space-y-1">
            <div className="text-3xl">{s.icon}</div>
            <h2 className="font-grove text-xl">{s.title}</h2>
            <p className="text-sm opacity-80">{s.text}</p>
          </div>
        ))}
      </section>

      <section className="grove-card space-y-2">
        <h2 className="font-grove text-xl">Built with</h2>
        <p className="text-sm opacity-80">
          Next.js and TypeScript, Google Gemini for understanding and answering, Tiger Data (Postgres) for storage,
          and ElevenLabs for natural voice. Made at GirlHacks 2026 for the ADP "AI for the Modern Enterprise" challenge.
        </p>
      </section>
    </main>
  );
}

