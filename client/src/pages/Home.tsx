// Sanctuary Grimoire — Homepage
// Design: Deep obsidian bg, ember particles on hero, class grid with color themes, gold dividers
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { classes } from "@/data/classes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sword, Gem, Flame, Star, BookOpen, Calendar } from "lucide-react";

// Ember particle system
function EmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; decay: number; hue: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 80;

    const spawn = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 1.2 + 0.4),
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.3,
        decay: Math.random() * 0.004 + 0.002,
        hue: Math.random() * 30 + 15, // orange-red range
      });
    };

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (frame % 3 === 0 && particles.length < maxParticles) spawn();
      frame++;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx + Math.sin(frame * 0.01 + i) * 0.2;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0 || p.y < -10) { particles.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `hsl(${p.hue}, 90%, 60%)`;
        ctx.shadowColor = `hsl(${p.hue}, 90%, 60%)`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// Class card component
function ClassCard({ cls }: { cls: typeof classes[0] }) {
  return (
    <Link href={`/class/${cls.id}`}>
      <div
        className="relative group overflow-hidden rounded border transition-all duration-300 cursor-pointer"
        style={{
          background: `linear-gradient(160deg, oklch(0.10 0.010 30) 0%, oklch(0.12 0.015 30) 100%)`,
          borderColor: "oklch(0.22 0.015 50)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = cls.color + "99";
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${cls.color}33, 0 4px 20px rgba(0,0,0,0.5)`;
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.22 0.015 50)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "";
          (e.currentTarget as HTMLDivElement).style.transform = "";
        }}
      >
        {/* Color accent bar */}
        <div className="h-1 w-full" style={{ background: cls.color }} />

        <div className="p-5">
          {/* Class color dot + name */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
              style={{ background: cls.color + "22", border: `1px solid ${cls.color}55`, color: cls.color }}
            >
              {cls.name[0]}
            </div>
            <div>
              <h3
                className="font-cinzel font-bold text-sm tracking-wide"
                style={{ color: cls.color }}
              >
                {cls.name}
              </h3>
              <p className="text-xs" style={{ color: "oklch(0.50 0.010 60)" }}>
                {cls.primaryStat} · {cls.resource.name}
              </p>
            </div>
          </div>

          <p className="text-xs leading-relaxed mb-4" style={{ color: "oklch(0.65 0.010 60)" }}>
            {cls.overview.slice(0, 120)}...
          </p>

          {/* Meta builds preview */}
          <div className="flex flex-wrap gap-1">
            {cls.metaBuilds.slice(0, 2).map((b) => (
              <span
                key={b.name}
                className="text-xs px-2 py-0.5 rounded-sm"
                style={{
                  background: cls.color + "18",
                  color: cls.color,
                  border: `1px solid ${cls.color}33`,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.05em",
                }}
              >
                {b.tier} · {b.name.split(" ").slice(0, 2).join(" ")}
              </span>
            ))}
          </div>
        </div>

        {/* Arrow indicator */}
        <div
          className="absolute bottom-3 right-4 text-xs font-cinzel tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: cls.color }}
        >
          EXPLORE →
        </div>
      </div>
    </Link>
  );
}

// System overview card
function SystemCard({
  icon: Icon,
  title,
  description,
  href,
  color,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <div
        className="group p-5 rounded border transition-all duration-300 cursor-pointer h-full"
        style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = color + "88";
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 16px ${color}22`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.22 0.015 50)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        }}
      >
        <Icon size={22} className="mb-3" color={color} />
        <h3 className="font-cinzel font-bold text-sm tracking-wide mb-2" style={{ color: "oklch(0.90 0.01 60)" }}>
          {title}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "oklch(0.55 0.010 60)" }}>
          {description}
        </p>
        <span
          className="inline-block mt-3 text-xs font-cinzel tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color }}
        >
          READ MORE →
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          minHeight: "80vh",
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/hero-main-AAoTc8i4BvSwg2BjJRkJbT.webp'), linear-gradient(180deg, oklch(0.05 0.010 30) 0%, oklch(0.08 0.012 30) 60%, oklch(0.07 0.008 30) 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        backgroundBlendMode: "overlay",
          paddingTop: "7rem",
          paddingBottom: "5rem",
        }}
      >
        <EmberCanvas />

        {/* Decorative top rule */}
        <div className="divider-gold w-48 mx-auto mb-8" />

        <p
          className="section-header mb-4 tracking-[0.3em]"
          style={{ color: "oklch(0.72 0.18 55 / 0.8)" }}
        >
          The Nephalem's Compendium
        </p>

        <h1
          className="font-cinzel-decorative font-black mb-6 leading-tight"
          style={{
            fontSize: "clamp(2rem, 6vw, 4rem)",
            background: "linear-gradient(180deg, oklch(0.90 0.05 60) 0%, oklch(0.72 0.18 55) 60%, oklch(0.55 0.15 50) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Diablo III
          <br />
          Strategy Guide
        </h1>

        <p
          className="max-w-xl mx-auto text-base leading-relaxed mb-8 px-4"
          style={{ color: "oklch(0.65 0.010 60)" }}
        >
          From your first steps in New Tristram to conquering Greater Rift 150 — a complete guide to every class, crafting skill, and endgame system in Sanctuary.
        </p>

        <div className="flex flex-wrap gap-3 justify-center px-4">
          <Link href="/class/barbarian">
            <button
              className="px-6 py-2.5 rounded text-sm font-cinzel tracking-wide transition-all duration-200"
              style={{
                background: "oklch(0.72 0.18 55)",
                color: "oklch(0.08 0 0)",
                fontWeight: 700,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.80 0.18 55)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.72 0.18 55)"; }}
            >
              Explore Classes
            </button>
          </Link>
          <Link href="/systems/seasons">
            <button
              className="px-6 py-2.5 rounded text-sm font-cinzel tracking-wide transition-all duration-200 border"
              style={{
                background: "transparent",
                color: "oklch(0.78 0.18 55)",
                borderColor: "oklch(0.72 0.18 55 / 0.5)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.72 0.18 55 / 0.1)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.72 0.18 55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.72 0.18 55 / 0.5)";
              }}
            >
              Season Guide
            </button>
          </Link>
        </div>

        <div className="divider-gold w-48 mx-auto mt-8" />
      </section>

      {/* Classes Section */}
      <section
        className="py-16"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/hero-classes-jqQzeRLQzCPicn42Qy3hfx.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div style={{ background: "oklch(0.07 0.008 30 / 0.88)", padding: "0 0 1rem" }}>
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="text-center mb-10">
              <p className="section-header mb-2">Choose Your Path</p>
              <h2
                className="font-cinzel font-bold text-2xl md:text-3xl"
                style={{ color: "oklch(0.90 0.01 60)" }}
              >
                The Seven Classes of Sanctuary
              </h2>
              <p className="text-sm mt-2" style={{ color: "oklch(0.55 0.010 60)" }}>
                Each class guide covers leveling tips (1–70), key abilities, meta builds, weapons, and endgame mastery.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {classes.map((cls) => (
                <ClassCard key={cls.id} cls={cls} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gold container mx-auto px-4 lg:px-8" />

      {/* Crafting Skills Section */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="section-header mb-2">Artisan Skills</p>
          <h2
            className="font-cinzel font-bold text-2xl md:text-3xl"
            style={{ color: "oklch(0.90 0.01 60)" }}
          >
            Crafting & Artisans
          </h2>
          <p className="text-sm mt-2" style={{ color: "oklch(0.55 0.010 60)" }}>
            Master the three Artisans to forge powerful gear, upgrade gems, and enchant your items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SystemCard
            icon={Sword}
            title="Blacksmith"
            description="Craft armor and weapons, salvage items for materials, and level up to unlock powerful endgame recipes. The foundation of all gear crafting."
            href="/crafting/blacksmith"
            color="#c89b3c"
          />
          <SystemCard
            icon={Gem}
            title="Jeweler"
            description="Upgrade gems from Chipped to Flawless Royal, socket items, and manage the 23 Legendary Gems that power your endgame builds."
            href="/crafting/jeweler"
            color="#4fc3f7"
          />
          <SystemCard
            icon={Star}
            title="Mystic"
            description="Enchant items to reroll stats, transmogrify gear for cosmetic appearances, and target the perfect stat combinations for your build."
            href="/crafting/mystic"
            color="#ce93d8"
          />
        </div>
      </section>

      <div className="divider-gold container mx-auto px-4 lg:px-8" />

      {/* Game Systems Section */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-10">
          <p className="section-header mb-2">Core Systems</p>
          <h2
            className="font-cinzel font-bold text-2xl md:text-3xl"
            style={{ color: "oklch(0.90 0.01 60)" }}
          >
            Endgame Systems
          </h2>
          <p className="text-sm mt-2" style={{ color: "oklch(0.55 0.010 60)" }}>
            Understand the systems that define Diablo 3's endgame loop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SystemCard
            icon={Flame}
            title="Kanai's Cube"
            description="Extract Legendary Powers, upgrade Rare items, reforge Legendaries, and augment Ancient gear with the most powerful artifact in Sanctuary."
            href="/systems/kanais-cube"
            color="#ff7043"
          />
          <SystemCard
            icon={Calendar}
            title="Seasons"
            description="Start fresh every 3 months, complete the Season Journey for a free 6-piece class set, earn cosmetic rewards, and compete on leaderboards."
            href="/systems/seasons"
            color="#66bb6a"
          />
          <SystemCard
            icon={BookOpen}
            title="Paragon System"
            description="Earn unlimited Paragon levels after reaching 70. Allocate points across Core, Offense, Defense, and Utility categories for infinite character progression."
            href="/systems/paragon"
            color="#42a5f5"
          />
        </div>
      </section>

      {/* Quick Reference Banner */}
      <section
        className="py-12 border-y"
        style={{
          background: "oklch(0.09 0.010 30)",
          borderColor: "oklch(0.22 0.015 50)",
        }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "7", label: "Playable Classes" },
              { value: "23", label: "Legendary Gems" },
              { value: "150", label: "Max Greater Rift" },
              { value: "20,000", label: "Paragon Cap" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="font-cinzel-decorative text-3xl font-black mb-1"
                  style={{ color: "oklch(0.78 0.18 55)" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs font-cinzel tracking-widest uppercase" style={{ color: "oklch(0.55 0.010 60)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
