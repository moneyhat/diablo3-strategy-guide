// Sanctuary Grimoire — Personalized Guide Output Page
// Renders a tailored guide based on class, level, and focus selections from the wizard
import { useParams, useLocation } from "wouter";
import { classMap } from "@/data/classes";
import { blacksmithGuide, jewelerGuide, mysticGuide, kanaisCubeGuide, seasonsGuide, paragonGuide } from "@/data/systems";
import { useWizard, FocusArea } from "@/contexts/WizardContext";
import { ChevronLeft, RotateCcw, Sword, Gem, Star, Flame, Calendar, BookOpen, Zap, Trophy, Shield, Check } from "lucide-react";

const ELEMENT_COLORS: Record<string, string> = {
  Physical: "#a0a0a0", Fire: "#ff6b35", Lightning: "#7eb8f7",
  Cold: "#7ecef7", Holy: "#ffe082", Poison: "#81c784",
  Arcane: "#ce93d8", None: "#888",
};
const ABILITY_TYPE_COLORS: Record<string, string> = {
  Primary: "#66bb6a", Secondary: "#42a5f5", "Fury Spender": "#ef5350",
  "Arcane Power Spender": "#ce93d8", "Spirit Spender": "#ffb74d",
  "Mana Spender": "#4db6ac", "Hatred Spender": "#ab47bc",
  Technique: "#78909c", Shout: "#ffd54f", Warcry: "#ffd54f",
  Conviction: "#ffe082", Laws: "#fff176", Defensive: "#4fc3f7",
  Utility: "#80cbc4", Archery: "#ff8a65", Discipline: "#9575cd",
  Devices: "#78909c", Focus: "#ffcc02", Mantras: "#fff9c4",
  Corpses: "#a5d6a7", Reanimation: "#c8e6c9", "Blood & Bone": "#ef9a9a",
  Terror: "#b39ddb", Voodoo: "#80deea", Decay: "#a5d6a7", Techniques: "#ffb74d",
};

// Determine which leveling phase applies to the current level
function getLevelPhase(level: number): "early" | "mid" | "late" | "endgame" {
  if (level <= 30) return "early";
  if (level <= 60) return "mid";
  if (level < 70) return "late";
  return "endgame";
}

function getLevelLabel(level: number) {
  if (level <= 30) return "Levels 1–30";
  if (level <= 60) return "Levels 31–60";
  if (level < 70) return "Levels 61–69";
  if (level === 70) return "Level 70";
  return "Level 70+ (Paragon)";
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon: Icon, accentColor, children }: {
  title: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}44` }}
        >
          <Icon size={15} color={accentColor} />
        </div>
        <h2 className="font-cinzel font-bold text-lg" style={{ color: "oklch(0.90 0.01 60)" }}>
          {title}
        </h2>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accentColor}44, transparent)` }} />
      </div>
      {children}
    </section>
  );
}

// ─── Tip card ─────────────────────────────────────────────────────────────────
function TipCard({ tip, index, accentColor }: { tip: string; index: number; accentColor: string }) {
  return (
    <div
      className="flex gap-3 p-4 rounded border"
      style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
    >
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
        style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
      >
        {index + 1}
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "oklch(0.75 0.010 60)" }}>{tip}</p>
    </div>
  );
}

export default function GuidePage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { state, reset } = useWizard();
  const cls = classMap[params.id || ""];

  if (!cls) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-cinzel text-xl mb-4" style={{ color: "oklch(0.78 0.18 55)" }}>Guide not found</p>
          <button onClick={() => navigate("/")} className="text-sm font-cinzel" style={{ color: "oklch(0.65 0.010 60)" }}>← Return Home</button>
        </div>
      </div>
    );
  }

  // If wizard state is empty (direct URL access), show all sections
  const focusAreas: FocusArea[] = state.focusAreas.length > 0
    ? state.focusAreas
    : ["combat", "builds", "leveling", "crafting-blacksmith", "crafting-jeweler", "crafting-mystic", "kanais-cube", "paragon", "seasons"];

  const level = state.level || 70;
  const phase = getLevelPhase(level);
  const accentColor = cls.color;

  const has = (f: FocusArea) => focusAreas.includes(f);

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(ellipse at 50% 0%, ${accentColor}06 0%, oklch(0.07 0.008 30) 50%)` }}>

      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b px-4 py-3 flex items-center justify-between"
        style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.07 0.008 30 / 0.97)", backdropFilter: "blur(12px)" }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-cinzel tracking-wide transition-colors"
          style={{ color: "oklch(0.55 0.010 60)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = accentColor; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.55 0.010 60)"; }}
        >
          <ChevronLeft size={14} /> Home
        </button>

        <span className="font-cinzel-decorative text-base font-bold" style={{ color: "oklch(0.78 0.18 55)" }}>
          D3 Guide
        </span>

        <button
          onClick={() => { reset(); navigate("/"); }}
          className="flex items-center gap-1.5 text-xs font-cinzel tracking-wide transition-colors"
          style={{ color: "oklch(0.55 0.010 60)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = accentColor; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.55 0.010 60)"; }}
        >
          <RotateCcw size={12} /> New Guide
        </button>
      </header>

      {/* Hero */}
      <div
        className="border-b py-10 px-4"
        style={{
          background: cls.bgGradient,
          borderColor: "oklch(0.22 0.015 50)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Summary chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-cinzel tracking-wide"
              style={{ background: `${accentColor}15`, borderColor: `${accentColor}44`, color: accentColor }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
              {cls.name}
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-cinzel tracking-wide"
              style={{ background: "oklch(0.12 0.012 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.65 0.010 60)" }}
            >
              {getLevelLabel(level)}
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-cinzel tracking-wide"
              style={{ background: "oklch(0.12 0.012 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.65 0.010 60)" }}
            >
              {focusAreas.length} section{focusAreas.length !== 1 ? "s" : ""}
            </span>
          </div>

          <h1
            className="font-cinzel-decorative font-black mb-3"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              color: accentColor,
              textShadow: `0 0 40px ${accentColor}55`,
            }}
          >
            Your {cls.name} Guide
          </h1>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "oklch(0.65 0.010 60)" }}>
            {cls.overview}
          </p>

          {/* Resource */}
          <div className="mt-4 flex flex-wrap gap-4">
            {[
              { label: "Primary Stat", value: cls.primaryStat },
              { label: "Resource", value: cls.resource.name },
              { label: "Your Level", value: level >= 71 ? "70+ (Paragon)" : String(level) },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.45 0.010 60)" }}>{s.label}</div>
                <div className="text-sm font-bold" style={{ color: "oklch(0.85 0.01 60)" }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guide content */}
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* ── LEVELING ── */}
        {has("leveling") && (
          <Section title={`Leveling Guide — ${getLevelLabel(level)}`} icon={Shield} accentColor={accentColor}>
            <div
              className="p-4 rounded border-l-2 mb-4"
              style={{ background: `${accentColor}08`, borderColor: accentColor }}
            >
              <p className="text-xs font-cinzel tracking-wide mb-1" style={{ color: accentColor }}>
                Showing tips for your current phase: {getLevelLabel(level)}
              </p>
              <p className="text-xs" style={{ color: "oklch(0.55 0.010 60)" }}>
                {cls.resource.description}
              </p>
            </div>
            <div className="space-y-3">
              {cls.levelingTips[phase].map((tip, i) => (
                <TipCard key={i} tip={tip} index={i} accentColor={accentColor} />
              ))}
            </div>
          </Section>
        )}

        {/* ── COMBAT & ABILITIES ── */}
        {has("combat") && (
          <Section title="Combat & Abilities" icon={Zap} accentColor={accentColor}>
            {/* Keybinding legend */}
            <div
              className="flex flex-wrap gap-3 mb-5 p-3 rounded border"
              style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.20 0.012 30)" }}
            >
              <span className="text-xs font-cinzel tracking-widest self-center" style={{ color: "oklch(0.45 0.010 60)" }}>KEY LEGEND:</span>
              {[
                { key: "LMB", label: "Primary" },
                { key: "RMB", label: "Main Damage" },
                { key: "1–4", label: "Slots" },
                { key: "Space", label: "Mobility" },
                { key: "T", label: "Cooldown" },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center justify-center min-w-[2rem] h-5 px-1.5 rounded text-xs font-bold"
                    style={{
                      background: "oklch(0.16 0.015 30)",
                      color: accentColor,
                      border: `1px solid ${accentColor}44`,
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.6rem",
                      boxShadow: `0 1px 0 ${accentColor}22`,
                    }}
                  >
                    {item.key}
                  </span>
                  <span className="text-xs" style={{ color: "oklch(0.50 0.010 60)" }}>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cls.abilities.map((ability) => {
                const elemColor = ELEMENT_COLORS[ability.element || "None"] || "#888";
                const typeColor = ABILITY_TYPE_COLORS[ability.type] || "#888";
                return (
                  <div
                    key={ability.name}
                    className="p-4 rounded border"
                    style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h3 className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.90 0.01 60)" }}>
                          {ability.name}
                        </h3>
                        {ability.keybind && (
                          <span
                            className="flex-shrink-0 inline-flex items-center justify-center min-w-[2rem] h-5 px-1.5 rounded text-xs font-bold"
                            style={{
                              background: "oklch(0.16 0.015 30)",
                              color: accentColor,
                              border: `1px solid ${accentColor}55`,
                              fontFamily: "'Courier New', monospace",
                              fontSize: "0.65rem",
                              boxShadow: `0 1px 0 ${accentColor}33`,
                            }}
                          >
                            {ability.keybind}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}33`, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
                          {ability.type}
                        </span>
                        {ability.element && ability.element !== "None" && (
                          <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background: `${elemColor}18`, color: elemColor, border: `1px solid ${elemColor}33`, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
                            {ability.element}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: "oklch(0.62 0.010 60)" }}>
                      {ability.description}
                    </p>
                    {ability.keybindNote && (
                      <div className="flex items-start gap-1.5 pt-2 border-t" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
                        <span className="flex-shrink-0 text-xs font-cinzel tracking-wide" style={{ color: accentColor, fontSize: "0.6rem" }}>BIND:</span>
                        <p className="text-xs leading-relaxed" style={{ color: "oklch(0.50 0.010 60)" }}>{ability.keybindNote}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── META BUILDS ── */}
        {has("builds") && (
          <Section title="Meta Builds" icon={Trophy} accentColor={accentColor}>
            <div className="space-y-5">
              {cls.metaBuilds.map((build) => (
                <div
                  key={build.name}
                  className="p-5 rounded border"
                  style={{
                    background: "oklch(0.10 0.010 30)",
                    borderColor: build.tier === "S" ? `${accentColor}55` : "oklch(0.22 0.015 50)",
                    boxShadow: build.tier === "S" ? `0 0 20px ${accentColor}12` : "none",
                  }}
                >
                  <div className="flex flex-wrap items-start gap-3 mb-3">
                    <span
                      className="text-sm font-black px-3 py-1 rounded-sm"
                      style={{
                        background: build.tier === "S" ? `${accentColor}22` : "oklch(0.65 0.18 145 / 0.15)",
                        color: build.tier === "S" ? accentColor : "oklch(0.70 0.18 145)",
                        border: `1px solid ${build.tier === "S" ? accentColor + "55" : "oklch(0.65 0.18 145 / 0.4)"}`,
                        fontFamily: "'Cinzel', serif",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {build.tier} Tier
                    </span>
                    <div>
                      <h3 className="font-cinzel font-bold text-base" style={{ color: "oklch(0.90 0.01 60)" }}>{build.name}</h3>
                      <span className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.50 0.010 60)" }}>{build.playstyle}</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.68 0.010 60)" }}>{build.description}</p>
                  <div>
                    <p className="text-xs font-cinzel tracking-widest uppercase mb-2" style={{ color: "oklch(0.45 0.010 60)" }}>Key Items</p>
                    <div className="flex flex-wrap gap-2">
                      {build.keyItems.map((item) => (
                        <span key={item} className="text-xs px-3 py-1 rounded-sm" style={{ background: "oklch(0.72 0.18 55 / 0.12)", color: "oklch(0.78 0.18 55)", border: "1px solid oklch(0.72 0.18 55 / 0.35)", fontFamily: "'Cinzel', serif", fontSize: "0.65rem" }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── MASTERY ── */}
        {has("combat") && (
          <Section title="Mastery Tips" icon={Shield} accentColor={accentColor}>
            <div className="p-4 rounded border-l-2 mb-4" style={{ background: `${accentColor}08`, borderColor: accentColor }}>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>{cls.masteryNote}</p>
            </div>
            <div className="space-y-3">
              {cls.masteryTips.map((tip, i) => <TipCard key={i} tip={tip} index={i} accentColor={accentColor} />)}
            </div>
          </Section>
        )}

        {/* ── WEAPONS ── */}
        {has("combat") && (
          <Section title="Weapon Types" icon={Sword} accentColor={accentColor}>
            <div className="space-y-3">
              {cls.weaponTypes.map((weapon, i) => {
                const isExclusive = weapon.toLowerCase().includes("exclusive");
                return (
                  <div key={i} className="flex gap-3 p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: isExclusive ? `${accentColor}44` : "oklch(0.22 0.015 50)" }}>
                    <Sword size={14} color={isExclusive ? accentColor : "oklch(0.40 0.010 60)"} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm leading-relaxed" style={{ color: "oklch(0.75 0.010 60)" }}>{weapon}</p>
                      {isExclusive && <span className="text-xs font-cinzel tracking-wide mt-1 inline-block" style={{ color: accentColor }}>★ Class Exclusive</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── BLACKSMITH ── */}
        {has("crafting-blacksmith") && (
          <Section title="Blacksmith Guide" icon={Sword} accentColor="#c89b3c">
            <p className="text-sm leading-relaxed mb-5" style={{ color: "oklch(0.65 0.010 60)" }}>{blacksmithGuide.overview}</p>
            <div className="space-y-3 mb-6">
              {blacksmithGuide.levelingTips.map((tip, i) => <TipCard key={i} tip={tip} index={i} accentColor="#c89b3c" />)}
            </div>
            <div className="p-4 rounded border-l-2" style={{ background: "#c89b3c08", borderColor: "#c89b3c" }}>
              <p className="text-xs font-cinzel tracking-wide mb-1" style={{ color: "#c89b3c" }}>Salvage Guide</p>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0.010 60)" }}>{blacksmithGuide.salvageGuide}</p>
            </div>
          </Section>
        )}

        {/* ── JEWELER ── */}
        {has("crafting-jeweler") && (
          <Section title="Jeweler & Gems" icon={Gem} accentColor="#4fc3f7">
            <p className="text-sm leading-relaxed mb-5" style={{ color: "oklch(0.65 0.010 60)" }}>{jewelerGuide.overview}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {jewelerGuide.gemTypes.map((gem) => {
                const gemColors: Record<string, string> = { Ruby: "#ef5350", Emerald: "#66bb6a", Amethyst: "#ab47bc", Topaz: "#ffd54f", Diamond: "#e0e0e0" };
                const c = gemColors[gem.name] || "#4fc3f7";
                return (
                  <div key={gem.name} className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: `${c}44` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}88` }} />
                      <h3 className="font-cinzel font-bold text-xs" style={{ color: c }}>{gem.name}</h3>
                    </div>
                    <p className="text-xs mb-1 leading-relaxed" style={{ color: "oklch(0.60 0.010 60)" }}>{gem.primaryEffect}</p>
                    <p className="text-xs" style={{ color: "oklch(0.50 0.010 60)" }}><span style={{ color: "#4fc3f7" }}>Best: </span>{gem.bestUse}</p>
                  </div>
                );
              })}
            </div>
            <h3 className="font-cinzel font-bold text-sm mb-3" style={{ color: "oklch(0.90 0.01 60)" }}>Top Legendary Gems</h3>
            <div className="space-y-3">
              {jewelerGuide.legendaryGems.slice(0, 5).map((gem) => (
                <div key={gem.name} className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.72 0.18 55 / 0.35)" }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-cinzel font-bold text-sm text-legendary">{gem.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-sm flex-shrink-0" style={{ background: "oklch(0.72 0.18 55 / 0.12)", color: "oklch(0.78 0.18 55)", border: "1px solid oklch(0.72 0.18 55 / 0.35)", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
                      Max Rank {gem.rankCap}
                    </span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: "oklch(0.65 0.010 60)" }}><span style={{ color: "oklch(0.78 0.18 55)" }}>Primary: </span>{gem.primaryEffect}</p>
                  <p className="text-xs" style={{ color: "oklch(0.50 0.010 60)" }}><span style={{ color: "#4fc3f7" }}>Best Use: </span>{gem.bestUse}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── MYSTIC ── */}
        {has("crafting-mystic") && (
          <Section title="Mystic & Enchanting" icon={Star} accentColor="#ce93d8">
            <p className="text-sm leading-relaxed mb-5" style={{ color: "oklch(0.65 0.010 60)" }}>{mysticGuide.overview}</p>
            <div className="space-y-3 mb-6">
              {mysticGuide.enchantingGuide.tips.slice(0, 5).map((tip, i) => <TipCard key={i} tip={tip} index={i} accentColor="#ce93d8" />)}
            </div>
            <h3 className="font-cinzel font-bold text-sm mb-3" style={{ color: "oklch(0.90 0.01 60)" }}>Priority Stats by Slot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mysticGuide.enchantingGuide.priorityStats.map((slot) => (
                <div key={slot.slot} className="p-3 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                  <h4 className="font-cinzel font-bold text-xs mb-1" style={{ color: "#ce93d8" }}>{slot.slot}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "oklch(0.62 0.010 60)" }}>{slot.priority}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── KANAI'S CUBE ── */}
        {has("kanais-cube") && (
          <Section title="Kanai's Cube" icon={Flame} accentColor="#ff7043">
            <p className="text-sm leading-relaxed mb-2" style={{ color: "oklch(0.65 0.010 60)" }}>{kanaisCubeGuide.overview}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-xs mb-5" style={{ background: "#ff704312", borderColor: "#ff704344", color: "#ff7043" }}>
              <span className="font-cinzel tracking-wide">Location:</span>
              <span style={{ color: "oklch(0.65 0.010 60)" }}>{kanaisCubeGuide.location}</span>
            </div>
            <div className="space-y-4">
              {kanaisCubeGuide.recipes.map((recipe) => (
                <div key={recipe.name} className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                  <h3 className="font-cinzel font-bold text-sm mb-2" style={{ color: "oklch(0.90 0.01 60)" }}>{recipe.name}</h3>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: "oklch(0.65 0.010 60)" }}>{recipe.effect}</p>
                  <div className="p-2 rounded border-l-2" style={{ background: "#ff704308", borderColor: "#ff7043" }}>
                    <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.010 60)" }}>
                      <span className="font-cinzel text-xs tracking-wide" style={{ color: "#ff7043" }}>Tip: </span>{recipe.tips}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── PARAGON ── */}
        {has("paragon") && (
          <Section title="Paragon System" icon={BookOpen} accentColor="#42a5f5">
            <p className="text-sm leading-relaxed mb-5" style={{ color: "oklch(0.65 0.010 60)" }}>{paragonGuide.overview}</p>
            <h3 className="font-cinzel font-bold text-sm mb-3" style={{ color: "oklch(0.90 0.01 60)" }}>Point Allocation for {cls.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {cls.paragons.map((cat) => {
                const catColors: Record<string, string> = { Core: "#ffb74d", Offense: "#ef5350", Defense: "#42a5f5", Utility: "#66bb6a" };
                const c = catColors[cat.category] || "#42a5f5";
                return (
                  <div key={cat.category} className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: `${c}44` }}>
                    <h4 className="font-cinzel font-bold text-sm mb-3" style={{ color: c }}>{cat.category}</h4>
                    <ol className="space-y-1.5">
                      {cat.priority.map((stat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "oklch(0.65 0.010 60)" }}>
                          <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ background: `${c}22`, color: c, fontSize: "0.55rem" }}>{i + 1}</span>
                          {stat}
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3">
              {paragonGuide.farmingTips.map((tip, i) => <TipCard key={i} tip={tip} index={i} accentColor="#42a5f5" />)}
            </div>
          </Section>
        )}

        {/* ── SEASONS ── */}
        {has("seasons") && (
          <Section title="Seasons & Journey" icon={Calendar} accentColor="#66bb6a">
            <p className="text-sm leading-relaxed mb-5" style={{ color: "oklch(0.65 0.010 60)" }}>{seasonsGuide.overview}</p>
            <h3 className="font-cinzel font-bold text-sm mb-3" style={{ color: "oklch(0.90 0.01 60)" }}>Fast-Start Guide</h3>
            <div className="space-y-3 mb-6">
              {seasonsGuide.fastStartGuide.map((step, i) => <TipCard key={i} tip={step} index={i} accentColor="#66bb6a" />)}
            </div>
            <h3 className="font-cinzel font-bold text-sm mb-3" style={{ color: "oklch(0.90 0.01 60)" }}>Season Journey Chapters</h3>
            <div className="space-y-3">
              {seasonsGuide.journeyChapters.slice(0, 6).map((ch, i) => (
                <div key={ch.chapter} className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: i < 4 ? "#66bb6a44" : "oklch(0.22 0.015 50)" }}>
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <h4 className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.90 0.01 60)" }}>{ch.chapter}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background: "#66bb6a18", color: "#66bb6a", border: "1px solid #66bb6a33", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>{ch.rewards}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "oklch(0.62 0.010 60)" }}>{ch.objectives}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Restart CTA ── */}
        <div
          className="mt-12 p-6 rounded border text-center"
          style={{ background: "oklch(0.10 0.010 30)", borderColor: `${accentColor}33` }}
        >
          <p className="font-cinzel font-bold text-base mb-2" style={{ color: "oklch(0.90 0.01 60)" }}>
            Want a different guide?
          </p>
          <p className="text-sm mb-4" style={{ color: "oklch(0.55 0.010 60)" }}>
            Start over to pick a different class, level, or focus areas.
          </p>
          <button
            onClick={() => { reset(); navigate("/"); }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded font-cinzel font-bold text-sm tracking-wide transition-all duration-200"
            style={{ background: accentColor, color: "oklch(0.08 0 0)" }}
          >
            <RotateCcw size={14} /> Build a New Guide
          </button>
        </div>
      </div>
    </div>
  );
}
