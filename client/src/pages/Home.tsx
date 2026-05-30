// Sanctuary Grimoire — Landing Page
// Primary CTA routes to the wizard flow
import { useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { classes } from "@/data/classes";
import { ChevronRight, Sword, Gem, Star, Flame, Trophy } from "lucide-react";

// Ember particle system
function EmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    interface Particle { x: number; y: number; vx: number; vy: number; size: number; alpha: number; decay: number; hue: number; }
    const particles: Particle[] = [];
    const spawn = () => {
      particles.push({ x: Math.random() * canvas.width, y: canvas.height + 10, vx: (Math.random() - 0.5) * 0.6, vy: -(Math.random() * 1.2 + 0.4), size: Math.random() * 2.5 + 0.5, alpha: Math.random() * 0.6 + 0.3, decay: Math.random() * 0.004 + 0.002, hue: Math.random() * 30 + 15 });
    };
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (frame % 3 === 0 && particles.length < 80) spawn();
      frame++;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx + Math.sin(frame * 0.01 + i) * 0.2;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0 || p.y < -10) { particles.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = `hsl(${p.hue}, 90%, 60%)`; ctx.shadowColor = `hsl(${p.hue}, 90%, 60%)`; ctx.shadowBlur = 6; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener("resize", resize);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">

      {/* Minimal header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "oklch(0.22 0.015 50 / 0.5)", background: "oklch(0.07 0.008 30 / 0.9)" }}>
        <span className="font-cinzel-decorative text-base font-bold tracking-wider" style={{ color: "oklch(0.78 0.18 55)" }}>
          D3 Guide
        </span>
        <div className="flex items-center gap-4">
          <Link href="/class/barbarian">
            <span className="text-xs font-cinzel tracking-wide transition-colors" style={{ color: "oklch(0.50 0.010 60)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLSpanElement).style.color = "oklch(0.78 0.18 55)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLSpanElement).style.color = "oklch(0.50 0.010 60)"; }}
            >
              Browse Classes
            </span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative flex-1 flex flex-col items-center justify-center text-center overflow-hidden px-4"
        style={{
          minHeight: "85vh",
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/hero-main-AAoTc8i4BvSwg2BjJRkJbT.webp'), linear-gradient(180deg, oklch(0.05 0.010 30) 0%, oklch(0.08 0.012 30) 60%, oklch(0.07 0.008 30) 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundBlendMode: "overlay",
          paddingTop: "4rem",
          paddingBottom: "4rem",
        }}
      >
        <EmberCanvas />

        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-xs font-cinzel tracking-[0.3em] mb-4" style={{ color: "oklch(0.72 0.18 55 / 0.8)" }}>
            THE NEPHALEM'S COMPENDIUM
          </p>

          <h1
            className="font-cinzel-decorative font-black mb-5 leading-tight"
            style={{
              fontSize: "clamp(2.2rem, 7vw, 4.5rem)",
              background: "linear-gradient(180deg, oklch(0.95 0.03 60) 0%, oklch(0.78 0.18 55) 55%, oklch(0.55 0.15 50) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Diablo III<br />Strategy Guide
          </h1>

          <p className="text-base leading-relaxed mb-8" style={{ color: "oklch(0.65 0.010 60)" }}>
            Answer three quick questions and get a personalized guide tailored to your class, your level, and exactly what you need to know.
          </p>

          {/* Primary CTA */}
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded font-cinzel font-bold text-base tracking-wide transition-all duration-200 mb-4"
            style={{ background: "oklch(0.72 0.18 55)", color: "oklch(0.08 0 0)", boxShadow: "0 0 30px oklch(0.72 0.18 55 / 0.4)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.80 0.18 55)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px oklch(0.72 0.18 55 / 0.6)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.72 0.18 55)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px oklch(0.72 0.18 55 / 0.4)";
            }}
          >
            Build My Guide
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-xs" style={{ color: "oklch(0.40 0.010 60)" }}>
            3 steps · Takes under 30 seconds
          </p>
        </div>

        {/* Step preview */}
        <div className="relative z-10 flex flex-wrap justify-center gap-6 mt-12">
          {[
            { step: "01", label: "Pick Your Class" },
            { step: "02", label: "Set Your Level" },
            { step: "03", label: "Choose Your Focus" },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2">
              <span className="font-cinzel-decorative text-xs font-bold" style={{ color: "oklch(0.72 0.18 55 / 0.6)" }}>{item.step}</span>
              <span className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.50 0.010 60)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Class preview strip */}
      <section
        className="border-t py-8 px-4 overflow-x-auto"
        style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.09 0.010 30)" }}
      >
        <div className="flex gap-3 min-w-max mx-auto justify-center flex-wrap">
          {classes.map((cls) => (
            <Link key={cls.id} href={`/class/${cls.id}`}>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded border transition-all duration-200 cursor-pointer"
                style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = cls.color + "88";
                  (e.currentTarget as HTMLDivElement).style.background = cls.color + "10";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.22 0.015 50)";
                  (e.currentTarget as HTMLDivElement).style.background = "oklch(0.10 0.010 30)";
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: cls.color }} />
                <span className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.70 0.010 60)" }}>{cls.name}</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-center text-xs mt-3" style={{ color: "oklch(0.38 0.010 60)" }}>
          Or browse directly by class
        </p>
      </section>

      {/* Feature highlights */}
      <section className="py-12 px-4 border-t" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Sword, label: "Abilities & Keybindings", color: "#c89b3c" },
            { icon: Trophy, label: "Meta Builds & Tiers", color: "#ef5350" },
            { icon: Gem, label: "Gems & Crafting", color: "#4fc3f7" },
            { icon: Flame, label: "Kanai's Cube & Systems", color: "#ff7043" },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: `${f.color}15`, border: `1px solid ${f.color}33` }}>
                <f.icon size={18} color={f.color} />
              </div>
              <span className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.55 0.010 60)" }}>{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-4 text-center" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
        <p className="text-xs" style={{ color: "oklch(0.35 0.010 60)" }}>
          Fan-made guide · Diablo 3 is a trademark of Blizzard Entertainment
        </p>
      </footer>
    </div>
  );
}
