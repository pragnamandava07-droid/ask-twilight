import Link from "next/link";
import Chat from "@/components/Chat";
import Reveal from "@/components/Reveal";
import { Page, PageDots } from "@/components/Pages";

const HOME_QUESTIONS = [
  "Show me all customers interested in payroll integration",
  "Which accounts are at risk of churning?",
  "What are the open commitments for Priya?",
  "What risks should I worry about across accounts?",
  "Who is evaluating a competitor?",
  "Summarize what we know about Globex Industries",
  "What did we discuss with Initech recently?",
  "Which customers need a follow-up this week?",
  "Which accounts need shift scheduling or time tracking?",
  "What should I prioritize today?",
];

const steps = [
  { icon: "🎙️", title: "Capture", text: "Talk, type, or upload" },
  { icon: "✨", title: "Understand", text: "AI finds the story" },
  { icon: "💬", title: "Ask", text: "Get answers out loud" },
];

const features = [
  { icon: "🎙️", label: "Live recording", href: "/add" },
  { icon: "📸", label: "Photos & PDFs", href: "/add" },
  { icon: "✅", label: "Promise tracker", href: "/accounts" },
  { icon: "🗓️", label: "Timelines", href: "/accounts" },
  { icon: "🔊", label: "Spoken answers", href: "/" },
  { icon: "☀️", label: "Daily brief", href: "/brief" },
];

const dots = [
  { id: "top", label: "Ask" },
  { id: "story", label: "How it works" },
  { id: "features", label: "Features" },
  { id: "demo", label: "See it" },
  { id: "try", label: "Try it" },
];

const iconCircle = {
  width: "5.5rem",
  height: "5.5rem",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  fontSize: "2.4rem",
  background: "rgba(255, 255, 255, .07)",
  border: "1px solid rgba(255, 235, 180, .3)",
  boxShadow: "0 0 30px rgba(245, 195, 90, .18), inset 0 1px 0 rgba(255, 255, 255, .1)",
  margin: "0 auto 1rem",
} as const;

const heading = {
  textAlign: "center" as const,
  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
  fontWeight: 800,
  marginBottom: "2.5rem",
};

export default function Home() {
  return (
    <>
      <PageDots items={dots} />

      {/* ---------- HERO ---------- */}
      <section
        id="top"
        style={{
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.25rem 4rem",
          textAlign: "center",
          scrollSnapAlign: "start",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: ".5rem" }} className="float">
          💫
        </div>
        <h1
          className="font-grove title-reveal glow-text"
          style={{
            fontSize: "clamp(1.5rem, 3.4vw, 2.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#ffe9a8",
            marginBottom: "1.75rem",
          }}
        >
          Need help finding something?
        </h1>

        <div className="fade-late" style={{ width: "100%", maxWidth: "56rem" }}>
          {/* PASTE YOUR CHAT LINE HERE (keep any props your old line had) */}
          <Chat suggestions={HOME_QUESTIONS} />
        </div>

        <div className="float" style={{ marginTop: "3rem", opacity: 0.6, fontSize: "1.4rem" }}>
          ↓
        </div>
      </section>

      {/* ---------- PAGE 1: HOW IT WORKS ---------- */}
      <Page id="story" num="01" label="How it works">
        <Reveal>
          <h2 className="font-grove" style={heading}>
            Never lose the story
          </h2>
        </Reveal>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem 2rem",
          }}
        >
          {steps.map((s, i) => (
            <div key={s.title} style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
              <Reveal delay={i * 200} variant="zoom">
                <div style={{ textAlign: "center", width: "10rem" }}>
                  <div style={iconCircle}>{s.icon}</div>
                  <h3 className="font-grove" style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ffe9a8" }}>
                    {s.title}
                  </h3>
                  <p style={{ opacity: 0.75, fontSize: ".95rem" }}>{s.text}</p>
                </div>
              </Reveal>
              {i < steps.length - 1 && (
                <Reveal delay={i * 200 + 150}>
                  <span style={{ fontSize: "1.8rem", color: "#ffd98a", opacity: 0.7 }}>→</span>
                </Reveal>
              )}
            </div>
          ))}
        </div>
      </Page>

      {/* ---------- PAGE 2: FEATURES ---------- */}
      <Page id="features" num="02" label="Features">
        <Reveal>
          <h2 className="font-grove" style={heading}>
            Everything in one place
          </h2>
        </Reveal>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", maxWidth: "46rem", margin: "0 auto" }}>
          {features.map((f, i) => (
            <Reveal key={f.label} delay={(i % 3) * 120} variant="zoom" style={{ height: "100%" }}>
              <Link
                href={f.href}
                className="grove-card lift"
                style={{ textDecoration: "none", color: "inherit", textAlign: "center", height: "100%" }}
              >
                <div style={{ fontSize: "2.2rem", marginBottom: ".6rem" }}>{f.icon}</div>
                <div className="font-grove" style={{ fontWeight: 800, color: "#ffe9a8" }}>
                  {f.label}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Page>

      {/* ---------- PAGE 3: SEE IT IN ACTION ---------- */}
      <Page id="demo" num="03" label="Live demo">
        <Reveal>
          <h2 className="font-grove" style={heading}>
            See it in action
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            textAlign: "left",
          }}
        >
          <Reveal variant="left" style={{ height: "100%" }}>
            <div className="grove-card" style={{ height: "100%" }}>
              <div style={{ textAlign: "right", marginBottom: ".75rem" }}>
                <span className="bubble-user">Who wants payroll integration?</span>
              </div>
              <div className="bubble-ai">Acme, Globex and Northwind. 3 accounts ✨</div>
              <div style={{ marginTop: ".9rem", textAlign: "right" }}>
                <span className="bubble-user">Anyone at risk?</span>
              </div>
              <div className="bubble-ai" style={{ marginTop: ".75rem" }}>
                Initech. Needs a reply this week ⚠️
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={150} style={{ height: "100%" }}>
            <div className="grove-card" style={{ height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
                <div className="avatar">G</div>
                <div>
                  <div className="font-grove" style={{ fontWeight: 800 }}>Globex Industries</div>
                  <div style={{ fontSize: ".8rem", opacity: 0.6 }}>Sample account</div>
                </div>
              </div>
              <div style={{ display: "grid", gap: ".5rem" }}>
                <div className="tag tag-good">✅ Send pricing · Priya</div>
                <div className="tag tag-need">⬜ Book demo · Daniel</div>
                <div className="tag tag-risk">⚠️ Wants payroll integration</div>
              </div>
            </div>
          </Reveal>
        </div>
      </Page>

      {/* ---------- PAGE 4: TRY IT ---------- */}
      <Page id="try" num="04" label="Get started">
        <Reveal variant="zoom">
          <div className="grove-card" style={{ textAlign: "center", padding: "2.5rem 1.5rem", maxWidth: "36rem", margin: "0 auto" }}>
            <div style={{ fontSize: "2.6rem", marginBottom: ".5rem" }} className="float">
              💫
            </div>
            <h2
              className="font-grove glow-text"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 800, color: "#ffe9a8", marginBottom: "1.5rem" }}
            >
              Try it now
            </h2>
            <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/add" className="btn-magic" style={{ textDecoration: "none" }}>
                Add a conversation
              </Link>
              <Link href="/accounts" className="btn-soft" style={{ textDecoration: "none" }}>
                Browse accounts
              </Link>
            </div>
            <p style={{ marginTop: "1.75rem", opacity: 0.5, fontSize: ".85rem" }}>
              💫 Ask Twilight · Built at GirlHacks 2026
            </p>
          </div>
        </Reveal>
      </Page>
    </>
  );
}