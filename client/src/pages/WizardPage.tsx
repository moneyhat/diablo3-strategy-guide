// Sanctuary Grimoire — Cinematic Guided Wizard
// One question at a time. Large visual choices. Instant feedback. No forms.
// Flow: Pick Class → Pick Journey Stage → Guide loads
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { classes } from "@/data/classes";
import { useWizard, FocusArea } from "@/contexts/WizardContext";
import { CLASS_PORTRAITS, CLASS_SIGILS } from "@/components/Icons";
import { ChevronRight, Map, ArrowLeft } from "lucide-react";

// ─── Journey stages ───────────────────────────────────────────────────────────
const JOURNEY_STAGES = [
  {
    id: "fresh",
    label: "Just Started",
    sublabel: "Levels 1 – 30",
    desc: "New to the class. Learning skills and finding your footing in Sanctuary.",
    level: 15,
    focuses: ["leveling", "combat"] as FocusArea[],
    accentColor: "#66bb6a",
    icon: "🌱",
  },
  {
    id: "building",
    label: "Building Up",
    sublabel: "Levels 31 – 69",
    desc: "Progressing through the acts. Skills unlocked. Starting to feel powerful.",
    level: 50,
    focuses: ["leveling", "combat", "builds"] as FocusArea[],
    accentColor: "#42a5f5",
    icon: "⚔️",
  },
  {
    id: "endgame",
    label: "Hit Level 70",
    sublabel: "Fresh Endgame",
    desc: "Just hit the cap. Time to gear up, unlock Kanai's Cube, and push Greater Rifts.",
    level: 70,
    focuses: ["builds", "combat", "crafting-blacksmith", "crafting-jeweler", "kanais-cube"] as FocusArea[],
    accentColor: "#ffd54f",
    icon: "🔥",
  },
  {
    id: "pushing",
    label: "Deep Endgame",
    sublabel: "Paragon & Beyond",
    desc: "Fully geared. Augmenting ancients, pushing high GRs, and chasing Primals.",
    level: 71,
    focuses: ["builds", "combat", "crafting-mystic", "crafting-jeweler", "kanais-cube", "paragon", "seasons"] as FocusArea[],
    accentColor: "#ce93d8",
    icon: "💎",
  },
];

// ─── Animated background that reacts to selected class ───────────────────────
function AnimatedBg({ color }: { color: string }) {
  return (
    <div className="fixed inset-0 pointer-events-none transition-all duration-700" style={{ zIndex: 0 }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${color}18 0%, transparent 70%)`,
        transition: "background 0.7s ease",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "oklch(0.07 0.008 30)",
        zIndex: -1,
      }} />
    </div>
  );
}

// ─── Screen: Class Picker ─────────────────────────────────────────────────────
function ScreenClass({ onSelect }: { onSelect: (id: string) => void }) {
  const { state } = useWizard();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(state.classId);

  const handleClick = (id: string) => {
    setSelectedId(id);
    setTimeout(() => onSelect(id), 300);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-start w-full max-w-5xl mx-auto px-4 pt-4 pb-8">
      <h1 className="font-cinzel-decorative font-black text-center mb-2"
        style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", color: "oklch(0.90 0.01 60)" }}>
        Who are you?
      </h1>
      <p className="text-center text-sm mb-8" style={{ color: "oklch(0.48 0.010 60)" }}>
        Choose your class — your entire guide is built around this choice.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full mb-6">
        {classes.map((cls) => {
          const isSelected = selectedId === cls.id;
          const isHovered = hoveredId === cls.id;
          const portrait = CLASS_PORTRAITS[cls.id];
          const Sigil = CLASS_SIGILS[cls.id];
          const active = isSelected || isHovered;
          return (
            <button
              key={cls.id}
              onClick={() => handleClick(cls.id)}
              onMouseEnter={() => setHoveredId(cls.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative rounded overflow-hidden text-left transition-all duration-300"
              style={{
                border: `2px solid ${active ? cls.color : "oklch(0.20 0.012 30)"}`,
                boxShadow: isSelected
                  ? `0 0 32px ${cls.color}55, 0 8px 24px rgba(0,0,0,0.6)`
                  : isHovered
                    ? `0 0 16px ${cls.color}33, 0 4px 16px rgba(0,0,0,0.4)`
                    : "0 2px 8px rgba(0,0,0,0.3)",
                transform: isSelected ? "scale(1.04)" : isHovered ? "scale(1.02)" : "scale(1)",
              }}
            >
              {/* Portrait */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "2/3", maxHeight: "200px" }}>
                <img src={portrait} alt={cls.name}
                  className="w-full h-full object-cover object-top transition-all duration-500"
                  style={{
                    filter: active ? "brightness(0.85) saturate(1)" : "brightness(0.55) saturate(0.7)",
                    transform: isHovered ? "scale(1.06)" : "scale(1)",
                  }} />
                <div className="absolute inset-0 transition-all duration-300" style={{
                  background: active
                    ? `linear-gradient(to top, ${cls.color}cc 0%, ${cls.color}11 55%, transparent 100%)`
                    : "linear-gradient(to top, oklch(0.07 0.008 30) 0%, oklch(0.07 0.008 30 / 0.2) 60%, transparent 100%)",
                }} />
                {/* Selected ring pulse */}
                {isSelected && (
                  <div className="absolute inset-0 rounded"
                    style={{ border: `2px solid ${cls.color}88`, animation: "pulse 1.5s ease-in-out infinite" }} />
                )}
                {/* Name */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-2">
                    {Sigil && <Sigil size={16} color={active ? cls.color : "oklch(0.75 0.01 60)"} />}
                    <div>
                      <p className="font-cinzel font-bold text-sm leading-tight"
                        style={{ color: active ? cls.color : "oklch(0.88 0.01 60)" }}>
                        {cls.name}
                      </p>
                      <p className="text-xs" style={{ color: "oklch(0.55 0.010 60)" }}>{cls.resource.name}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Tagline */}
              <div className="px-3 py-2 transition-colors duration-300"
                style={{ background: active ? `${cls.color}12` : "oklch(0.10 0.010 30)" }}>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "oklch(0.50 0.010 60)" }}>
                  {cls.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-center" style={{ color: "oklch(0.32 0.010 60)" }}>
        Tap a class to continue
      </p>
    </div>
  );
}

// ─── Screen: Journey Stage ────────────────────────────────────────────────────
function ScreenJourney({
  classId, onSelect, onBack,
}: {
  classId: string;
  onSelect: (stage: typeof JOURNEY_STAGES[0]) => void;
  onBack: () => void;
}) {
  const cls = classes.find((c) => c.id === classId)!;
  const portrait = CLASS_PORTRAITS[cls.id];
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = (stage: typeof JOURNEY_STAGES[0]) => {
    setSelectedId(stage.id);
    setTimeout(() => onSelect(stage), 320);
  };

  return (
    <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto px-4 pt-4 pb-8">

      {/* Class identity strip */}
      <div className="flex items-center gap-4 w-full mb-8 p-4 rounded-lg border"
        style={{ background: `${cls.color}0d`, borderColor: `${cls.color}30` }}>
        <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0"
          style={{ border: `2px solid ${cls.color}55`, boxShadow: `0 0 12px ${cls.color}33` }}>
          <img src={portrait} alt={cls.name} className="w-full h-full object-cover object-top" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-cinzel tracking-widest" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.6rem" }}>PLAYING AS</p>
          <p className="font-cinzel-decorative font-black text-lg" style={{ color: cls.color }}>{cls.name}</p>
          <p className="text-xs" style={{ color: "oklch(0.50 0.010 60)" }}>{cls.tagline}</p>
        </div>
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-cinzel px-3 py-1.5 rounded border transition-colors flex-shrink-0"
          style={{ borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.50 0.010 60)", background: "transparent" }}>
          <ArrowLeft size={12} /> Change
        </button>
      </div>

      <h2 className="font-cinzel-decorative font-black text-center mb-2"
        style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)", color: "oklch(0.90 0.01 60)" }}>
        Where are you in your journey?
      </h2>
      <p className="text-center text-sm mb-7" style={{ color: "oklch(0.48 0.010 60)" }}>
        Your guide is built instantly around your answer.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
        {JOURNEY_STAGES.map((stage) => {
          const isSelected = selectedId === stage.id;
          const isHovered = hoveredId === stage.id;
          const active = isSelected || isHovered;
          return (
            <button
              key={stage.id}
              onClick={() => handleClick(stage)}
              onMouseEnter={() => setHoveredId(stage.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex items-start gap-4 p-5 rounded-lg border text-left transition-all duration-250"
              style={{
                background: active ? `${stage.accentColor}12` : "oklch(0.10 0.010 30)",
                borderColor: active ? stage.accentColor : "oklch(0.22 0.015 50)",
                boxShadow: isSelected
                  ? `0 0 24px ${stage.accentColor}30`
                  : isHovered
                    ? `0 0 12px ${stage.accentColor}18`
                    : "none",
                transform: active ? "scale(1.015)" : "scale(1)",
              }}
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-250"
                style={{
                  background: active ? `${stage.accentColor}20` : "oklch(0.14 0.012 30)",
                  border: `1px solid ${active ? stage.accentColor + "55" : "oklch(0.20 0.012 30)"}`,
                  boxShadow: active ? `0 0 12px ${stage.accentColor}33` : "none",
                }}>
                {stage.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <p className="font-cinzel font-bold text-base leading-tight transition-colors duration-200"
                    style={{ color: active ? stage.accentColor : "oklch(0.85 0.01 60)" }}>
                    {stage.label}
                  </p>
                  <span className="text-xs font-mono" style={{ color: `${stage.accentColor}cc` }}>
                    {stage.sublabel}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "oklch(0.55 0.010 60)" }}>
                  {stage.desc}
                </p>
                {/* Included topics */}
                <div className="flex flex-wrap gap-1">
                  {stage.focuses.map((f) => {
                    const labels: Record<string, string> = {
                      combat: "Combat", builds: "Builds", leveling: "Leveling",
                      "crafting-blacksmith": "Blacksmith", "crafting-jeweler": "Gems",
                      "crafting-mystic": "Mystic", "kanais-cube": "Kanai's Cube",
                      paragon: "Paragon", seasons: "Seasons",
                    };
                    return (
                      <span key={f} className="text-xs px-2 py-0.5 rounded-sm transition-all duration-200"
                        style={{
                          background: active ? `${stage.accentColor}18` : "oklch(0.14 0.012 30)",
                          color: active ? stage.accentColor : "oklch(0.45 0.010 60)",
                          border: `1px solid ${active ? stage.accentColor + "33" : "oklch(0.20 0.012 30)"}`,
                          fontFamily: "'Cinzel', serif",
                          fontSize: "0.58rem",
                        }}>
                        {labels[f] || f}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Arrow indicator */}
              <ChevronRight size={16} className="flex-shrink-0 self-center transition-all duration-200"
                style={{ color: active ? stage.accentColor : "oklch(0.28 0.010 60)", opacity: active ? 1 : 0.5 }} />
            </button>
          );
        })}
      </div>

      <p className="text-xs text-center" style={{ color: "oklch(0.32 0.010 60)" }}>
        You can customize further from within your guide
      </p>
    </div>
  );
}

// ─── Wizard Shell ─────────────────────────────────────────────────────────────
export default function WizardPage() {
  const [screen, setScreen] = useState<"class" | "journey">("class");
  const [transitioning, setTransitioning] = useState(false);
  const [, navigate] = useLocation();
  const { state, setClass, setLevel, toggleFocus, reset } = useWizard();
  const cls = state.classId ? classes.find((c) => c.id === state.classId) : null;

  const transitionTo = (next: "class" | "journey") => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(next);
      setTransitioning(false);
    }, 200);
  };

  const handleClassSelect = (id: string) => {
    setClass(id);
    transitionTo("journey");
  };

  const handleJourneySelect = (stage: typeof JOURNEY_STAGES[0]) => {
    setLevel(stage.level);
    // Clear existing and apply smart defaults
    state.focusAreas.forEach((f) => toggleFocus(f));
    stage.focuses.forEach((f) => toggleFocus(f));
    setTimeout(() => navigate(`/guide/${state.classId}`), 100);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: "oklch(0.07 0.008 30)" }}>
      {/* Animated background */}
      <AnimatedBg color={cls?.color || "#c89b3c"} />

      {/* Header */}
      <header className="relative z-20 border-b px-4 py-3 flex items-center justify-between"
        style={{ borderColor: "oklch(0.18 0.012 30)", background: "oklch(0.07 0.008 30 / 0.9)", backdropFilter: "blur(8px)" }}>
        <button onClick={() => { reset(); setScreen("class"); }}
          className="font-cinzel-decorative text-base font-bold tracking-wider"
          style={{ color: "oklch(0.78 0.18 55)" }}>
          D3 Guide
        </button>

        {/* Minimal progress dots */}
        <div className="flex items-center gap-2">
          {["class", "journey"].map((s, i) => (
            <div key={s} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: s === screen ? (cls?.color || "oklch(0.72 0.18 55)") : "oklch(0.22 0.015 50)",
                transform: s === screen ? "scale(1.4)" : "scale(1)",
              }} />
          ))}
        </div>

        <button
          onClick={() => navigate("/maps")}
          className="flex items-center gap-1.5 text-xs font-cinzel tracking-wide px-3 py-1.5 rounded border transition-all duration-200"
          style={{ borderColor: "oklch(0.72 0.18 55 / 0.35)", color: "oklch(0.72 0.18 55)", background: "oklch(0.72 0.18 55 / 0.07)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.72 0.18 55 / 0.16)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.72 0.18 55 / 0.07)"; }}
        >
          <Map size={12} /> Maps
        </button>
      </header>

      {/* Main content with fade transition */}
      <main className="relative z-10 flex-1 flex items-start justify-center overflow-y-auto"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateX(12px)" : "translateX(0)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          paddingTop: "2rem",
          paddingBottom: "1rem",
        }}>
        {screen === "class" && (
          <ScreenClass onSelect={handleClassSelect} />
        )}
        {screen === "journey" && state.classId && (
          <ScreenJourney
            classId={state.classId}
            onSelect={handleJourneySelect}
            onBack={() => transitionTo("class")}
          />
        )}
      </main>

      {/* Maps entry card — shown on class screen */}
      {screen === "class" && (
        <div className="relative z-10 px-4 pb-6 max-w-5xl mx-auto w-full">
          <div
            className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-200"
            style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.72 0.18 55 / 0.25)" }}
            onClick={() => navigate("/maps")}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.72 0.18 55 / 0.55)"; (e.currentTarget as HTMLDivElement).style.background = "oklch(0.72 0.18 55 / 0.05)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.72 0.18 55 / 0.25)"; (e.currentTarget as HTMLDivElement).style.background = "oklch(0.09 0.010 30)"; }}
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "oklch(0.72 0.18 55 / 0.10)", border: "1px solid oklch(0.72 0.18 55 / 0.35)" }}>
              <Map size={16} color="oklch(0.78 0.18 55)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.75 0.18 55)" }}>Interactive Maps</p>
              <p className="text-xs" style={{ color: "oklch(0.48 0.010 60)" }}>All 5 Acts — zones, loot, keywardens, elite packs & farming routes</p>
            </div>
            <ChevronRight size={14} color="oklch(0.45 0.010 60)" className="flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
