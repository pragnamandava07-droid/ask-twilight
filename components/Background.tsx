"use client";

import { useEffect, useMemo, useRef } from "react";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

export default function Background() {
  const ref = useRef<HTMLDivElement>(null);

  // fixed star positions (same every time, so no flicker on load)
  const stars = useMemo(() => {
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: 70 }, () => ({
      left: rnd() * 100,
      top: rnd() * 100,
      size: 1 + rnd() * 2,
      delay: rnd() * 6,
      dur: 3 + rnd() * 4,
    }));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;

    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp(window.scrollY / max) : 0;
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--a", clamp(1 - p / 0.4).toFixed(3));                   // top: gradient
      el.style.setProperty("--b", clamp(1 - Math.abs(p - 0.45) / 0.35).toFixed(3)); // middle: solid green night
      el.style.setProperty("--c", clamp((p - 0.6) / 0.3).toFixed(3));              // bottom: original glow
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <div className="tw-bg" ref={ref} aria-hidden="true">
        {/* TOP: smooth green gradient */}
        <div className="tw-layer tw-top" />

        {/* MIDDLE: solid dark green + stars + shooting star */}
        <div className="tw-layer tw-mid">
          {stars.map((s, i) => (
            <span
              key={i}
              className="tw-star"
              style={{
                left: `${s.left.toFixed(2)}%`,
                top: `${s.top.toFixed(2)}%`,
                width: `${s.size.toFixed(1)}px`,
                height: `${s.size.toFixed(1)}px`,
                ["--dl" as string]: `${s.delay.toFixed(1)}s`,
                ["--dur" as string]: `${s.dur.toFixed(1)}s`,
              }}
            />
          ))}
          <span className="tw-shoot" />
        </div>

        {/* BOTTOM: the original forest glow */}
        <div className="tw-layer tw-bot">
          <div className="tw-par-c">
            <div className="tw-g tw-g-outer" />
            <div className="tw-g tw-g-mid" />
            <div className="tw-g tw-g-core" />
            <div className="tw-g tw-g-warm" />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .tw-bg {
          --p: 0; --a: 1; --b: 0; --c: 0;
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background: #020b08;
        }
        .tw-layer {
          position: absolute;
          inset: 0;
          transition: opacity .25s linear;
        }

        /* ---------- TOP: gradient ---------- */
        .tw-top {
          opacity: var(--a);
          background: linear-gradient(160deg, #010704 0%, #03160f 35%, #072a1d 65%, #031a12 100%);
          background-size: 200% 200%;
          animation: tw-gradshift 18s ease-in-out infinite alternate;
        }
        @keyframes tw-gradshift {
          from { background-position: 0% 0%; }
          to   { background-position: 100% 100%; }
        }

        /* ---------- MIDDLE: solid dark green ---------- */
        .tw-mid {
          opacity: var(--b);
          background: #031a12;
        }
        .tw-star {
          position: absolute;
          border-radius: 50%;
          background: #fff6dc;
          box-shadow: 0 0 6px rgba(255, 246, 220, 0.8);
          animation: tw-twinkle var(--dur) ease-in-out infinite;
          animation-delay: var(--dl);
        }
        .tw-shoot {
          position: absolute;
          top: 14%; left: 72%;
          width: 130px; height: 2px;
          background: linear-gradient(270deg, rgba(255, 246, 220, 0), #fff6dc);
          opacity: 0;
          transform: translate(0, 0) rotate(-35deg);
          animation: tw-shoot 7s linear infinite;
        }

        /* ---------- BOTTOM: original glow ---------- */
        .tw-bot {
          opacity: var(--c);
          background: linear-gradient(180deg, #020a07 0%, #03140f 55%, #04180f 100%);
        }
        .tw-par-c { position: absolute; inset: 0; transform: translateY(calc((1 - var(--c)) * 30vh)); }
        .tw-g { position: absolute; border-radius: 50%; will-change: transform, opacity; }
        .tw-g-outer {
          width: 140vw; height: 80vh; left: -20vw; bottom: -42vh; filter: blur(90px);
          background: radial-gradient(closest-side, rgba(18, 85, 62, 0.65), transparent);
          animation: tw-breathe 9s ease-in-out infinite;
        }
        .tw-g-mid {
          width: 100vw; height: 60vh; left: 0; bottom: -34vh; filter: blur(70px);
          background: radial-gradient(closest-side, rgba(38, 130, 96, 0.6), transparent);
          animation: tw-breathe 9s ease-in-out infinite 1.2s;
        }
        .tw-g-core {
          width: 60vw; height: 40vh; left: 20vw; bottom: -24vh; filter: blur(60px);
          background: radial-gradient(closest-side, rgba(110, 195, 150, 0.5), transparent);
          animation: tw-breathe 9s ease-in-out infinite 2.4s;
        }
        .tw-g-warm {
          width: 34vw; height: 24vh; left: 33vw; bottom: -17vh; filter: blur(50px);
          background: radial-gradient(closest-side, rgba(255, 214, 140, 0.4), transparent);
          animation: tw-breathe 9s ease-in-out infinite 3.2s;
        }

        /* ---------- Animations ---------- */
        @keyframes tw-breathe {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.85; }
          50%      { transform: scale(1.08) translateY(-2vh); opacity: 1; }
        }
        @keyframes tw-twinkle {
          0%, 100% { opacity: 0.15; }
          50%      { opacity: 1; }
        }
        @keyframes tw-shoot {
          0%, 80% { opacity: 0; transform: translate(0, 0) rotate(-35deg); }
          83%     { opacity: 1; }
          100%    { opacity: 0; transform: translate(-38vw, 26vh) rotate(-35deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .tw-top, .tw-g, .tw-star, .tw-shoot { animation: none; }
          .tw-par-c { transform: none; }
        }
      ` }} />
    </>
  );
}