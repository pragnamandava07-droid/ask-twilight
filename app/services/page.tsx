import Link from "next/link";

const SERVICES = [
  {
    href: "/add",
    icon: "🌱",
    title: "Plant a new memory",
    text: "Paste notes, record a meeting live, or drop in photos, PDFs, and audio. AI pulls out decisions, risks, needs, and promises.",
  },
  {
    href: "/",
    icon: "🕯️",
    title: "Whisper to the grove",
    text: "Ask questions about any customer by typing or speaking, and hear the answer read back to you.",
  },
  {
    href: "/brief",
    icon: "🔊",
    title: "Daily voice brief",
    text: "A spoken summary of every open promise across your accounts, so you start the day knowing what matters.",
  },
  {
    href: "/accounts",
    icon: "🌳",
    title: "Your grove",
    text: "See every customer at a glance with their memories, timeline, and promises to keep.",
  },
];

export default function Services() {
  return (
    <main className="max-w-4xl mx-auto px-5 py-10 space-y-6">
      <header className="text-center space-y-2 rise">
        <div className="text-5xl float">✨</div>
        <h1 className="font-grove text-4xl glow-text">Services</h1>
        <p className="opacity-80">Everything Ask Twilight can do for your team. Pick one to begin.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <Link key={s.title} href={s.href} className="grove-card lift rise space-y-2">
            <div className="text-4xl">{s.icon}</div>
            <h2 className="font-grove text-2xl">{s.title}</h2>
            <p className="opacity-80 text-sm">{s.text}</p>
            <span className="badge">Open →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

