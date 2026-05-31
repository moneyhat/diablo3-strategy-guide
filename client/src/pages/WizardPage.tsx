// Sanctuary Grimoire — Cinematic Entry Flow
// Inspired by D3's character selection diorama: dark atmospheric stage, class transforms the screen
// Flow: Pick Class (cinematic) → Instant guide entry with build preview panel
import { useState } from "react";
import { useLocation } from "wouter";
import { classes } from "@/data/classes";
import { useWizard, FocusArea } from "@/contexts/WizardContext";
import { CLASS_PORTRAITS, CLASS_SIGILS } from "@/components/Icons";
import { ChevronRight, Map, Zap, Trophy, Shield, Sword } from "lucide-react";
import { ALL_PRESETS } from "@/data/skillPresets";

// ─── Journey stages (used for smart defaults only) ────────────────────────────
const JOURNEY_DEFAULTS: Record<string, { level: number; focuses: FocusArea[] }> = {
  fresh:   { level: 15, focuses: ["leveling", "combat"] },
  endgame: { level: 70, focuses: ["builds", "combat", "crafting-blacksmith", "crafting-jeweler", "kanais-cube"] },
  pushing: { level: 71, focuses: ["builds", "combat", "crafting-mystic", "crafting-jeweler", "kanais-cube", "paragon", "seasons"] },
};

// ─── Class taglines for the cinematic stage ───────────────────────────────────
const CLASS_BATTLE_CRIES: Record<string, string> = {
  barbarian:    "Rage incarnate. The battlefield is your altar.",
  crusader:     "Heaven's wrath made flesh. Judgment is absolute.",
  "demon-hunter": "Shadows are your armor. Death is your art.",
  monk:         "Spirit and steel, perfectly balanced. Strike without mercy.",
  necromancer:  "Life and death bend to your will. Command the fallen.",
  "witch-doctor": "The spirits answer. Your enemies will not.",
  wizard:       "Reality is a suggestion. You rewrite the rules.",
};

// ─── Playstyle icons ──────────────────────────────────────────────────────────
const PLAYSTYLE_ICONS: Record<string, React.ReactNode> = {
  "Speed Farming": <Zap size={12} />,
  "GR Pushing":    <Trophy size={12} />,
  "PvP":           <Sword size={12} />,
  "Leveling":      <Shield size={12} />,
};

// ─── Screen: Cinematic Class Picker ──────────────────────────────────────────
function ScreenClass({ onSelect }: { onSelect: (id: string) => void }) {
  const { state } = useWizard();
  const [hoveredId, setHoveredId] = useState<string | null>(state.classId || null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const featured = hoveredId
    ? classes.find((c) => c.id === hoveredId)
    : classes.find((c) => c.id === state.classId) || classes[0];

  const handleClick = (id: string) => {
    setSelectedId(id);
    setTimeout(() => onSelect(id), 340);
  };

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "oklch(0.05 0.008 30)" }}>

      {/* ── Full-bleed cinematic backdrop ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {featured && (
          <>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${CLASS_PORTRAITS[featured.id]})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              filter: "brightness(0.18) saturate(0.5) blur(2px)",
              transform: "scale(1.05)",
              transition: "all 0.6s ease",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse 60% 80% at 50% 30%, ${featured.color}14 0%, transparent 65%)`,
              transition: "background 0.6s ease",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, transparent 40%, oklch(0.05 0.008 30) 100%)",
            }} />
          </>
        )}
      </div>

      {/* ── Header ── */}
      <header className="relative z-20 px-6 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-cinzel-decorative font-black text-xl tracking-wider"
            style={{ color: "oklch(0.78 0.18 55)" }}>
            D3 GUIDE
          </h1>
          <p className="text-xs font-cinzel tracking-widest mt-0.5"
            style={{ color: "oklch(0.35 0.010 60)", fontSize: "0.55rem" }}>
            SANCTUARY STRATEGY COMPENDIUM
          </p>
        </div>
        <button onClick={() => window.location.href = "/maps"}
          className="flex items-center gap-1.5 text-xs font-cinzel tracking-wide px-3 py-1.5 rounded border transition-all duration-200"
          style={{ borderColor: "oklch(0.72 0.18 55 / 0.35)", color: "oklch(0.72 0.18 55)", background: "oklch(0.72 0.18 55 / 0.07)" }}>
          <Map size={12} /> Maps
        </button>
      </header>

      {/* ── Featured class identity ── */}
      {featured && (
        <div className="relative z-10 px-6 pt-4 pb-6 text-center transition-all duration-500">
          <p className="text-xs font-cinzel tracking-widest mb-2"
            style={{ color: featured.color, opacity: 0.7, fontSize: "0.6rem" }}>
            SELECT YOUR CHAMPION
          </p>
          <h2 className="font-cinzel-decorative font-black mb-1 transition-all duration-300"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: featured.color, textShadow: `0 0 40px ${featured.color}55` }}>
            {featured.name.toUpperCase()}
          </h2>
          <p className="text-sm italic max-w-md mx-auto transition-all duration-300"
            style={{ color: "oklch(0.65 0.010 60)", fontFamily: "'Cinzel', serif" }}>
            {CLASS_BATTLE_CRIES[featured.id]}
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="text-xs px-2.5 py-1 rounded-sm"
              style={{ background: `${featured.color}18`, color: featured.color, border: `1px solid ${featured.color}33`, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
              {featured.primaryStat}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-sm"
              style={{ background: "oklch(0.12 0.010 30)", color: "oklch(0.55 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
              {featured.resource.name}
            </span>
          </div>
        </div>
      )}

      {/* ── Class portrait grid ── */}
      <div className="relative z-10 flex-1 px-4 pb-6">
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-w-4xl mx-auto mb-6">
          {classes.map((cls) => {
            const isActive = hoveredId === cls.id || selectedId === cls.id;
            const portrait = CLASS_PORTRAITS[cls.id];
            const Sigil = CLASS_SIGILS[cls.id];
            return (
              <button
                key={cls.id}
                onClick={() => handleClick(cls.id)}
                onMouseEnter={() => setHoveredId(cls.id)}
                onMouseLeave={() => setHoveredId(state.classId || classes[0].id)}
                className="relative rounded overflow-hidden transition-all duration-250 group"
                style={{
                  border: `2px solid ${isActive ? cls.color : "oklch(0.18 0.012 30)"}`,
                  boxShadow: isActive ? `0 0 20px ${cls.color}55, 0 4px 16px rgba(0,0,0,0.6)` : "0 2px 8px rgba(0,0,0,0.4)",
                  transform: isActive ? "scale(1.06) translateY(-2px)" : "scale(1)",
                }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "2/3", maxHeight: "160px" }}>
                  <img src={portrait} alt={cls.name}
                    className="w-full h-full object-cover object-top transition-all duration-400"
                    style={{ filter: isActive ? "brightness(0.9)" : "brightness(0.45) saturate(0.6)" }} />
                  <div className="absolute inset-0 transition-all duration-300" style={{
                    background: isActive
                      ? `linear-gradient(to top, ${cls.color}bb 0%, transparent 60%)`
                      : "linear-gradient(to top, oklch(0.05 0.008 30) 0%, transparent 60%)",
                  }} />
                  {/* Sigil + name */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                    {Sigil && (
                      <div className="flex justify-center mb-0.5">
                        <Sigil size={14} color={isActive ? cls.color : "oklch(0.60 0.01 60)"} />
                      </div>
                    )}
                    <p className="font-cinzel font-bold leading-tight"
                      style={{ color: isActive ? cls.color : "oklch(0.75 0.01 60)", fontSize: "0.58rem" }}>
                      {cls.name}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Top meta build preview for featured class ── */}
        {featured && (() => {
          const presets = ALL_PRESETS[featured.id] || [];
          const topBuild = presets.find((p) => p.tier === "S") || presets[0];
          if (!topBuild) return null;
          return (
            <div className="max-w-4xl mx-auto">
              <div className="rounded border p-4 mb-4"
                style={{ background: `${featured.color}08`, borderColor: `${featured.color}33` }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-cinzel tracking-widest"
                        style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.55rem" }}>
                        TOP META BUILD
                      </span>
                      <span className="font-bold text-xs px-1.5 py-0.5 rounded-sm"
                        style={{ background: "#ffd54f22", color: "#ffd54f", border: "1px solid #ffd54f44", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
                        S TIER
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded-sm"
                        style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.50 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
                        {topBuild.playstyle}
                      </span>
                    </div>
                    <p className="font-cinzel-decorative font-black text-lg"
                      style={{ color: featured.color }}>
                      {topBuild.name}
                    </p>
                    <p className="text-xs leading-relaxed mt-1 max-w-lg"
                      style={{ color: "oklch(0.58 0.010 60)" }}>
                      {topBuild.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleClick(featured.id)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded font-cinzel font-bold text-sm tracking-wide transition-all duration-200"
                      style={{ background: featured.color, color: "oklch(0.08 0 0)" }}>
                      Enter as {featured.name} <ChevronRight size={14} />
                    </button>
                    <a href={`/skills/${featured.id}`}
                      className="flex items-center gap-2 px-5 py-2 rounded border font-cinzel text-xs tracking-wide text-center justify-center transition-all duration-200"
                      style={{ borderColor: `${featured.color}44`, color: featured.color, background: `${featured.color}10` }}>
                      <Zap size={11} /> View All Builds
                    </a>
                  </div>
                </div>
                {/* Skill bar preview */}
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {(["LMB", "RMB", "1", "2", "3", "4"] as const).map((slot) => {
                    const slotData = topBuild.slots[slot];
                    return (
                      <div key={slot} className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded flex items-center justify-center text-xs font-mono font-bold"
                          style={{ background: `${featured.color}18`, border: `1.5px solid ${featured.color}44`, color: featured.color }}>
                          {slot}
                        </div>
                        <span className="text-center font-cinzel"
                          style={{ color: "oklch(0.42 0.010 60)", fontSize: "0.45rem", maxWidth: "40px", lineHeight: 1.2 }}>
                          {slotData.skillId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 10)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Maps entry ── */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-3 rounded border cursor-pointer transition-all duration-200"
            style={{ background: "oklch(0.08 0.010 30)", borderColor: "oklch(0.72 0.18 55 / 0.22)" }}
            onClick={() => window.location.href = "/maps"}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.72 0.18 55 / 0.5)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.72 0.18 55 / 0.22)"; }}>
            <Map size={14} color="oklch(0.72 0.18 55)" />
            <div className="flex-1 min-w-0">
              <p className="font-cinzel font-bold text-xs" style={{ color: "oklch(0.72 0.18 55)" }}>Interactive Maps</p>
              <p className="text-xs" style={{ color: "oklch(0.42 0.010 60)", fontSize: "0.6rem" }}>All 5 Acts — teleport points, bosses, loot, entry/exit</p>
            </div>
            <ChevronRight size={13} color="oklch(0.42 0.010 60)" />
          </div>
        </div>
      </div>

      {/* ── Bottom hint ── */}
      <div className="relative z-10 text-center pb-4">
        <p className="text-xs font-cinzel" style={{ color: "oklch(0.28 0.010 60)" }}>
          Tap a class to begin your journey
        </p>
      </div>
    </div>
  );
}

// ─── Wizard Shell ─────────────────────────────────────────────────────────────
export default function WizardPage() {
  const [, navigate] = useLocation();
  const { state, setClass, setLevel, toggleFocus, reset } = useWizard();

  const handleClassSelect = (id: string) => {
    setClass(id);
    // Apply smart endgame defaults
    const defaults = JOURNEY_DEFAULTS.endgame;
    setLevel(defaults.level);
    state.focusAreas.forEach((f) => toggleFocus(f));
    defaults.focuses.forEach((f) => toggleFocus(f));
    navigate(`/guide/${id}`);
  };

  return <ScreenClass onSelect={handleClassSelect} />;
}
