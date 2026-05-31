// Sanctuary Grimoire — Landing Page + Class Picker
// Proper front page: hero section → feature highlights → class picker → guide entry
import { useState, useRef } from "react";
import { useLocation, Link } from "wouter";
import { classes } from "@/data/classes";
import { useWizard, FocusArea } from "@/contexts/WizardContext";
import { CLASS_PORTRAITS, CLASS_SIGILS } from "@/components/Icons";
import { ChevronRight, Map, Zap, Trophy, Shield, Sword, BookOpen, Hammer, Star } from "lucide-react";
import { ALL_PRESETS } from "@/data/skillPresets";

// ─── Journey defaults ─────────────────────────────────────────────────────────
const JOURNEY_DEFAULTS: Record<string, { level: number; focuses: FocusArea[] }> = {
  endgame: { level: 70, focuses: ["builds", "combat", "crafting-blacksmith", "crafting-jeweler", "kanais-cube"] },
};

const CLASS_BATTLE_CRIES: Record<string, string> = {
  barbarian:      "Rage incarnate. The battlefield is your altar.",
  crusader:       "Heaven's wrath made flesh. Judgment is absolute.",
  "demon-hunter": "Shadows are your armor. Death is your art.",
  monk:           "Spirit and steel, perfectly balanced. Strike without mercy.",
  necromancer:    "Life and death bend to your will. Command the fallen.",
  "witch-doctor": "The spirits answer. Your enemies will not.",
  wizard:         "Reality is a suggestion. You rewrite the rules.",
};

// ─── Hero section ─────────────────────────────────────────────────────────────
function HeroSection({ onScrollToClasses }: { onScrollToClasses: () => void }) {
  return (
    <div className="relative overflow-hidden" style={{ minHeight: "520px" }}>
      {/* Dark atmospheric background */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139,0,0,0.18) 0%, oklch(0.06 0.008 30) 65%)",
      }} />
      {/* Subtle ember particles via CSS */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 20% 80%, rgba(200,80,0,0.06) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(100,0,200,0.05) 0%, transparent 40%)",
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
        {/* Eyebrow */}
        <p className="font-cinzel tracking-widest mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border"
          style={{ color: "oklch(0.72 0.18 55)", borderColor: "oklch(0.72 0.18 55 / 0.3)", background: "oklch(0.72 0.18 55 / 0.06)", fontSize: "0.62rem", letterSpacing: "0.2em" }}>
          <span style={{ color: "#c0392b" }}>🔥</span> THE DEFINITIVE STRATEGY RESOURCE
        </p>

        {/* Main headline */}
        <h1 className="font-cinzel-decorative font-black mb-4 leading-none"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", color: "oklch(0.90 0.01 60)", textShadow: "0 0 60px rgba(139,0,0,0.4)" }}>
          DIABLO III
        </h1>
        <h2 className="font-cinzel font-bold mb-6 tracking-widest"
          style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)", color: "oklch(0.72 0.18 55)", letterSpacing: "0.25em" }}>
          STRATEGY GUIDE
        </h2>

        {/* Subheadline */}
        <p className="text-base leading-relaxed mb-8 max-w-2xl mx-auto"
          style={{ color: "oklch(0.82 0.010 60)", fontFamily: "'Cinzel', serif" }}>
          Push the absolute ceiling of Sanctuary. Class guides, meta builds, interactive maps,
          skill loadouts, and everything you need to dominate — from level 1 to Greater Rift 150.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <button
            onClick={onScrollToClasses}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded font-cinzel font-bold text-sm tracking-wide transition-all duration-200"
            style={{ background: "oklch(0.72 0.18 55)", color: "oklch(0.08 0 0)", boxShadow: "0 0 24px oklch(0.72 0.18 55 / 0.35)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 36px oklch(0.72 0.18 55 / 0.55)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px oklch(0.72 0.18 55 / 0.35)"; }}
          >
            <Sword size={15} /> Choose Your Class
          </button>
          <Link href="/maps"
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded border font-cinzel font-bold text-sm tracking-wide transition-all duration-200"
            style={{ borderColor: "oklch(0.72 0.18 55 / 0.4)", color: "oklch(0.72 0.18 55)", background: "oklch(0.72 0.18 55 / 0.06)" }}>
            <Map size={15} /> Interactive Maps
          </Link>
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { value: "7", label: "Classes" },
            { value: "35+", label: "Meta Builds" },
            { value: "5", label: "Acts Mapped" },
            { value: "150+", label: "GR Ceiling" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-cinzel-decorative font-black text-2xl" style={{ color: "oklch(0.78 0.18 55)" }}>{stat.value}</p>
              <p className="font-cinzel text-xs tracking-widest" style={{ color: "oklch(0.72 0.010 60)", fontSize: "0.55rem" }}>{stat.label.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, oklch(0.07 0.008 30))" }} />
    </div>
  );
}

// ─── Feature highlights ───────────────────────────────────────────────────────
function FeatureHighlights() {
  const features = [
    {
      icon: <Sword size={20} />,
      color: "#c0392b",
      title: "Class Guides",
      desc: "Deep dives for all 7 classes — leveling tips, skill rotations, keybindings, and mastery advice from level 1 to Paragon.",
      href: null,
    },
    {
      icon: <Trophy size={20} />,
      color: "#ffd54f",
      title: "Meta Builds",
      desc: "S-Tier builds for PvE, PvP, Speed Farming, and Group play. Named, branded, and explained with synergy notes and power tips.",
      href: null,
    },
    {
      icon: <Map size={20} />,
      color: "#80cbc4",
      title: "Interactive Maps",
      desc: "ArcGIS-quality maps for all 5 Acts with 12 toggleable data layers — zone boundaries, density heat maps, boss locations, farming routes, and more.",
      href: "/maps",
    },
    {
      icon: <Zap size={20} />,
      color: "#ce93d8",
      title: "Skill Loadouts",
      desc: "Level-aware skill builder with meta presets, power ratings, synergy hints, rune selection, and Max Power auto-fill.",
      href: null,
    },
    {
      icon: <Hammer size={20} />,
      color: "#c89b3c",
      title: "Crafting Systems",
      desc: "Complete guides for the Blacksmith, Jeweler, Mystic, and Kanai's Cube — including Augmenting, Enchanting, and gem upgrade priority.",
      href: "/crafting/blacksmith",
    },
    {
      icon: <BookOpen size={20} />,
      color: "#66bb6a",
      title: "Endgame Systems",
      desc: "Paragon allocation, Season Journey chapters, Greater Rift progression, and everything you need to push the game's limits.",
      href: "/systems/paragon",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <p className="font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.72 0.18 55)", fontSize: "0.6rem", letterSpacing: "0.2em" }}>
          WHAT'S INSIDE
        </p>
        <h3 className="font-cinzel-decorative font-black text-2xl" style={{ color: "oklch(0.88 0.01 60)" }}>
          Everything You Need to Dominate
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => {
          const inner = (
            <div className="h-full p-5 rounded border transition-all duration-200 group"
              style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${f.color}55`; (e.currentTarget as HTMLDivElement).style.background = `${f.color}08`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.22 0.015 50)"; (e.currentTarget as HTMLDivElement).style.background = "oklch(0.10 0.010 30)"; }}>
              <div className="w-10 h-10 rounded flex items-center justify-center mb-3 flex-shrink-0"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}33`, color: f.color }}>
                {f.icon}
              </div>
              <h4 className="font-cinzel font-bold text-sm mb-2" style={{ color: "oklch(0.88 0.01 60)" }}>{f.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.78 0.010 60)" }}>{f.desc}</p>
              {f.href && (
                <p className="text-xs mt-3 font-cinzel flex items-center gap-1" style={{ color: f.color, fontSize: "0.6rem" }}>
                  Open <ChevronRight size={10} />
                </p>
              )}
            </div>
          );
          return f.href ? (
            <Link key={f.title} href={f.href}
              className="h-full p-5 rounded border transition-all duration-200 group block"
              style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${f.color}55`; (e.currentTarget as HTMLAnchorElement).style.background = `${f.color}08`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "oklch(0.22 0.015 50)"; (e.currentTarget as HTMLAnchorElement).style.background = "oklch(0.10 0.010 30)"; }}
            >
              <div className="w-10 h-10 rounded flex items-center justify-center mb-3 flex-shrink-0"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}33`, color: f.color }}>
                {f.icon}
              </div>
              <h4 className="font-cinzel font-bold text-sm mb-2" style={{ color: "oklch(0.88 0.01 60)" }}>{f.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.78 0.010 60)" }}>{f.desc}</p>
              <p className="text-xs mt-3 font-cinzel flex items-center gap-1" style={{ color: f.color, fontSize: "0.6rem" }}>
                Open <ChevronRight size={10} />
              </p>
            </Link>
          ) : (
            <div key={f.title}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Class picker section ─────────────────────────────────────────────────────
function ClassPickerSection({ onSelect }: { onSelect: (id: string) => void }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setSelectedId(id);
    setTimeout(() => onSelect(id), 320);
  };

  const featured = hoveredId ? classes.find((c) => c.id === hoveredId) : null;

  return (
    <div className="relative" style={{ background: "oklch(0.07 0.008 30)" }}>
      {/* Subtle class color backdrop on hover */}
      {featured && (
        <div className="absolute inset-0 pointer-events-none transition-all duration-500" style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${featured.color}10 0%, transparent 70%)`,
        }} />
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Section header */}
        <div className="text-center mb-8">
          <p className="font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.72 0.18 55)", fontSize: "0.6rem", letterSpacing: "0.2em" }}>
            STEP 1
          </p>
          <h3 className="font-cinzel-decorative font-black text-2xl mb-2" style={{ color: "oklch(0.88 0.01 60)" }}>
            Choose Your Class
          </h3>
          <p className="text-sm" style={{ color: "oklch(0.78 0.010 60)", fontFamily: "'Cinzel', serif" }}>
            Your guide is built entirely around this choice.
          </p>
        </div>

        {/* Class grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {classes.map((cls) => {
            const isHovered = hoveredId === cls.id;
            const isSelected = selectedId === cls.id;
            const portrait = CLASS_PORTRAITS[cls.id];
            const Sigil = CLASS_SIGILS[cls.id];
            const presets = ALL_PRESETS[cls.id] || [];
            const topBuild = presets.find((p) => p.tier === "S") || presets[0];

            return (
              <button
                key={cls.id}
                onClick={() => handleClick(cls.id)}
                onMouseEnter={() => setHoveredId(cls.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative rounded overflow-hidden text-left transition-all duration-250 group"
                style={{
                  border: `2px solid ${isHovered || isSelected ? cls.color : "oklch(0.20 0.012 30)"}`,
                  boxShadow: isSelected
                    ? `0 0 32px ${cls.color}55, 0 8px 24px rgba(0,0,0,0.6)`
                    : isHovered
                      ? `0 0 18px ${cls.color}33, 0 4px 16px rgba(0,0,0,0.4)`
                      : "0 2px 8px rgba(0,0,0,0.3)",
                  transform: isSelected ? "scale(1.04)" : isHovered ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Portrait */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "2/3", maxHeight: "200px" }}>
                  <img src={portrait} alt={cls.name}
                    className="w-full h-full object-cover object-top transition-all duration-400"
                    style={{ filter: isHovered || isSelected ? "brightness(0.88)" : "brightness(0.5) saturate(0.65)" }} />
                  <div className="absolute inset-0 transition-all duration-300" style={{
                    background: isHovered || isSelected
                      ? `linear-gradient(to top, ${cls.color}cc 0%, ${cls.color}11 55%, transparent 100%)`
                      : "linear-gradient(to top, oklch(0.07 0.008 30) 0%, oklch(0.07 0.008 30 / 0.2) 60%, transparent 100%)",
                  }} />
                  {/* Class name */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center gap-2">
                      {Sigil && <Sigil size={16} color={isHovered || isSelected ? cls.color : "oklch(0.70 0.01 60)"} />}
                      <div>
                        <p className="font-cinzel font-bold text-sm leading-tight"
                          style={{ color: isHovered || isSelected ? cls.color : "oklch(0.88 0.01 60)" }}>
                          {cls.name}
                        </p>
                        <p className="text-xs" style={{ color: "oklch(0.78 0.010 60)" }}>{cls.resource.name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info strip */}
                <div className="px-3 py-2 transition-colors duration-250"
                  style={{ background: isHovered || isSelected ? `${cls.color}10` : "oklch(0.10 0.010 30)" }}>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "oklch(0.76 0.010 60)" }}>
                    {cls.tagline}
                  </p>
                  {topBuild && (
                    <p className="text-xs mt-1 font-cinzel" style={{ color: isHovered ? cls.color : "oklch(0.70 0.010 60)", fontSize: "0.52rem" }}>
                      Top: {topBuild.name}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Hover preview */}
        {featured && (
          <div className="rounded border p-4 transition-all duration-300"
            style={{ background: `${featured.color}08`, borderColor: `${featured.color}33` }}>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-cinzel-decorative font-black text-xl mb-1" style={{ color: featured.color }}>
                  {featured.name}
                </p>
                <p className="text-sm italic mb-3" style={{ color: "oklch(0.60 0.010 60)", fontFamily: "'Cinzel', serif" }}>
                  {CLASS_BATTLE_CRIES[featured.id]}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-sm" style={{ background: `${featured.color}15`, color: featured.color, border: `1px solid ${featured.color}30`, fontFamily: "'Cinzel', serif", fontSize: "0.58rem" }}>
                    {featured.primaryStat}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-sm" style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.78 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.58rem" }}>
                    {featured.resource.name}
                  </span>
                  {(ALL_PRESETS[featured.id] || []).slice(0, 3).map((p) => (
                    <span key={p.id} className="text-xs px-2 py-1 rounded-sm" style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.76 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.52rem" }}>
                      {p.playstyle}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleClick(featured.id)}
                className="flex items-center gap-2 px-6 py-2.5 rounded font-cinzel font-bold text-sm tracking-wide flex-shrink-0 transition-all duration-200"
                style={{ background: featured.color, color: "oklch(0.08 0 0)" }}>
                Enter as {featured.name} <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {!featured && (
          <p className="text-center text-xs font-cinzel" style={{ color: "oklch(0.65 0.010 60)" }}>
            Hover a class to preview · Click to enter your guide
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Maps CTA strip ───────────────────────────────────────────────────────────
function MapsCta() {
  return (
    <div className="border-t border-b" style={{ borderColor: "oklch(0.72 0.18 55 / 0.15)", background: "oklch(0.08 0.010 30)" }}>
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-cinzel-decorative font-black text-lg mb-1" style={{ color: "oklch(0.78 0.18 55)" }}>
            Interactive Maps
          </p>
          <p className="text-sm" style={{ color: "oklch(0.78 0.010 60)", fontFamily: "'Cinzel', serif" }}>
            All 5 Acts with 12 data layers — zone boundaries, density heat maps, boss locations, farming routes, and more.
          </p>
        </div>
        <Link href="/maps"
          className="flex items-center gap-2 px-6 py-3 rounded border font-cinzel font-bold text-sm tracking-wide flex-shrink-0 transition-all duration-200"
          style={{ borderColor: "oklch(0.72 0.18 55 / 0.4)", color: "oklch(0.72 0.18 55)", background: "oklch(0.72 0.18 55 / 0.07)" }}>
          <Map size={14} /> Open Maps
        </Link>
      </div>
    </div>
  );
}

// ─── Main WizardPage ──────────────────────────────────────────────────────────
export default function WizardPage() {
  const [, navigate] = useLocation();
  const { state, setClass, setLevel, toggleFocus } = useWizard();
  const classPickerRef = useRef<HTMLDivElement>(null);

  const scrollToClasses = () => {
    classPickerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleClassSelect = (id: string) => {
    setClass(id);
    const defaults = JOURNEY_DEFAULTS.endgame;
    setLevel(defaults.level);
    state.focusAreas.forEach((f) => toggleFocus(f));
    defaults.focuses.forEach((f) => toggleFocus(f));
    navigate(`/guide/${id}`);
  };

  return (
    <div style={{ background: "oklch(0.07 0.008 30)" }}>
      {/* Hero */}
      <HeroSection onScrollToClasses={scrollToClasses} />

      {/* Feature highlights */}
      <FeatureHighlights />

      {/* Divider */}
      <div className="border-t" style={{ borderColor: "oklch(0.72 0.18 55 / 0.12)" }} />

      {/* Class picker */}
      <div ref={classPickerRef} id="class-picker">
        <ClassPickerSection onSelect={handleClassSelect} />
      </div>

      {/* Maps CTA */}
      <MapsCta />
    </div>
  );
}
