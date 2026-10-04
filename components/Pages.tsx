"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/* One full-screen "page" with scroll-linked transitions */
export function Page({
  id,
  num,
  label,
  children,
}: {
  id: string;
  num: string;
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;

    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let t = 0; // +1 = just entering from below, -1 = just left through the top
      if (r.top > 0) t = clamp(r.top / vh);
      else if (r.bottom < vh) t = -clamp((vh - r.bottom) / vh);
      el.style.setProperty("--t", t.toFixed(3));
      el.style.setProperty("--a", Math.abs(t).toFixed(3));
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
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id={id} ref={ref} className="pg">
      <div className="pg-line" />

      <div className="pg-rings" aria-hidden="true">
        <div className="pg-ring pg-ring-1" />
        <div className="pg-ring pg-ring-2" />
        <div className="pg-ring pg-ring-3" />
      </div>

      <div className="pg-num font-grove" aria-hidden="true">
        {num}
      </div>

      <div className="pg-content">
        <div className="pg-label">
          {num} · {label}
        </div>
        {children}
      </div>
    </section>
  );
}

/* Dot navigator on the right + snap scrolling + all the styles */
export function PageDots({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const key = items.map((i) => i.id).join(",");

  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollSnapType;
    root.style.scrollSnapType = "y proximity"; // gentle snapping, removed when you leave the home page

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });

    return () => {
      root.style.scrollSnapType = prev;
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <>
      <nav className="pg-dots" aria-label="Page sections">
        {items.map((i) => (
          <button
            key={i.id}
            aria-label={i.label}
            className={`pg-dot ${active === i.id ? "on" : ""}`}
            onClick={() => document.getElementById(i.id)?.scrollIntoView({ behavior: "smooth" })}
          >
            <span className="pg-dot-label">{i.label}</span>
          </button>
        ))}
      </nav>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .pg {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem 1.25rem 4rem;
          overflow: hidden;
          scroll-snap-align: start;
        }

        /* the content shrinks, fades and drifts as the page enters or leaves */
        .pg-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 60rem;
          text-align: center;
          opacity: calc(1 - var(--a, 0) * 0.9);
          transform: translateY(calc(var(--t, 0) * 90px)) scale(calc(1 - var(--a, 0) * 0.1));
          will-change: transform, opacity;
        }

        .pg-label {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          margin-bottom: 1.5rem;
          padding: .3rem .9rem;
          border-radius: 999px;
          font-size: .75rem;
          font-weight: 800;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: #ffd98a;
          background: rgba(245, 195, 90, .08);
          border: 1px solid rgba(245, 195, 90, .35);
        }

        /* giant outlined chapter number that drifts the opposite way (parallax) */
        .pg-num {
          position: absolute;
          z-index: 1;
          top: 50%;
          left: 50%;
          font-size: clamp(11rem, 30vw, 26rem);
          font-weight: 900;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(245, 195, 90, .16);
          transform: translate(-50%, calc(-50% + var(--t, 0) * -160px));
          opacity: calc(1 - var(--a, 0));
          pointer-events: none;
          user-select: none;
        }

        /* rings that open up as the page arrives */
        .pg-rings {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: calc(1 - var(--a, 0));
          transform: scale(calc(0.75 + (1 - var(--a, 0)) * 0.25));
        }
        .pg-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
        }
        .pg-ring-1 {
          width: 56vmin; height: 56vmin; margin: -28vmin 0 0 -28vmin;
          border: 1px solid rgba(245, 195, 90, .16);
        }
        .pg-ring-2 {
          width: 84vmin; height: 84vmin; margin: -42vmin 0 0 -42vmin;
          border: 1px dashed rgba(120, 220, 160, .18);
          animation: pg-spin 70s linear infinite;
        }
        .pg-ring-3 {
          width: 118vmin; height: 118vmin; margin: -59vmin 0 0 -59vmin;
          border: 1px solid rgba(120, 220, 160, .09);
        }
        @keyframes pg-spin { to { transform: rotate(360deg); } }

        /* glowing line at the top edge that draws across as the page arrives */
        .pg-line {
          position: absolute;
          top: 0; left: 20%; right: 20%;
          height: 1px;
          z-index: 3;
          background: linear-gradient(90deg, transparent, rgba(245, 195, 90, .6), transparent);
          transform: scaleX(calc(1 - var(--a, 0)));
        }

        /* dot navigator */
        .pg-dots {
          position: fixed;
          right: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 40;
          display: flex;
          flex-direction: column;
          gap: .9rem;
        }
        .pg-dot {
          position: relative;
          width: 12px; height: 12px;
          padding: 0;
          border-radius: 50%;
          cursor: pointer;
          background: transparent;
          border: 1px solid rgba(255, 235, 180, .5);
          transition: transform .25s, background .25s, box-shadow .25s;
        }
        .pg-dot:hover { transform: scale(1.3); }
        .pg-dot.on {
          background: #f5c35a;
          border-color: #f5c35a;
          box-shadow: 0 0 12px rgba(245, 195, 90, .8);
          transform: scale(1.25);
        }
        .pg-dot-label {
          position: absolute;
          right: 22px; top: 50%;
          transform: translateY(-50%);
          white-space: nowrap;
          font-size: .8rem; font-weight: 700;
          color: #ffe9a8;
          opacity: 0;
          pointer-events: none;
          transition: opacity .2s;
        }
        .pg-dot:hover .pg-dot-label { opacity: 1; }

        @media (max-width: 800px) {
          .pg-dots { display: none; }
          .pg-num { opacity: .5; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pg-content, .pg-num, .pg-rings, .pg-line { transform: none; opacity: 1; }
          .pg-num { transform: translate(-50%, -50%); }
          .pg-ring-2 { animation: none; }
        }
      `,
        }}
      />
    </>
  );
}
