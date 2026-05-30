// Sanctuary Grimoire — Class Page
// Design: Class-specific color theme, tabbed content, atmospheric hero
import { useState } from "react";
import { useParams, Link } from "wouter";
import { classMap } from "@/data/classes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft, Shield, Zap, Trophy, Sword, Star, BookOpen } from "lucide-react";

type TabId = "leveling" | "abilities" | "meta" | "weapons" | "mastery";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "leveling", label: "Leveling Guide", icon: BookOpen },
  { id: "abilities", label: "Abilities", icon: Zap },
  { id: "meta", label: "Meta Builds", icon: Trophy },
  { id: "weapons", label: "Weapons", icon: Sword },
  { id: "mastery", label: "Mastery", icon: Star },
];

const ELEMENT_COLORS: Record<string, string> = {
  Physical: "#a0a0a0",
  Fire: "#ff6b35",
  Lightning: "#7eb8f7",
  Cold: "#7ecef7",
  Holy: "#ffe082",
  Poison: "#81c784",
  Arcane: "#ce93d8",
  None: "#888",
};

const ABILITY_TYPE_COLORS: Record<string, string> = {
  Primary: "#66bb6a",
  Secondary: "#42a5f5",
  "Fury Spender": "#ef5350",
  "Arcane Power Spender": "#ce93d8",
  "Spirit Spender": "#ffb74d",
  "Mana Spender": "#4db6ac",
  "Hatred Spender": "#ab47bc",
  Technique: "#78909c",
  Shout: "#ffd54f",
  Warcry: "#ffd54f",
  Conviction: "#ffe082",
  Laws: "#fff176",
  Defensive: "#4fc3f7",
  Utility: "#80cbc4",
  Archery: "#ff8a65",
  Discipline: "#9575cd",
  Devices: "#78909c",
  Focus: "#ffcc02",
  Mantras: "#fff9c4",
  Corpses: "#a5d6a7",
  Reanimation: "#c8e6c9",
  "Blood & Bone": "#ef9a9a",
  Terror: "#b39ddb",
  Voodoo: "#80deea",
  Decay: "#a5d6a7",
  Techniques: "#ffb74d",
};

export default function ClassPage() {
  const params = useParams<{ id: string }>();
  const cls = classMap[params.id || ""];
  const [activeTab, setActiveTab] = useState<TabId>("leveling");
  const [levelPhase, setLevelPhase] = useState<"early" | "mid" | "late" | "endgame">("early");

  if (!cls) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-cinzel text-xl mb-4" style={{ color: "oklch(0.78 0.18 55)" }}>Class not found</p>
          <Link href="/">
            <button className="text-sm font-cinzel" style={{ color: "oklch(0.65 0.010 60)" }}>← Return Home</button>
          </Link>
        </div>
      </div>
    );
  }

  const accentColor = cls.color;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        className="relative pt-14 pb-12 overflow-hidden"
        style={{ background: cls.bgGradient }}
      >
        {/* Decorative glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${accentColor}18 0%, transparent 70%)`,
          }}
        />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-8">
          <Link href="/">
            <span
              className="inline-flex items-center gap-1 text-xs font-cinzel tracking-wide mb-6 transition-colors"
              style={{ color: "oklch(0.55 0.010 60)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLSpanElement).style.color = accentColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLSpanElement).style.color = "oklch(0.55 0.010 60)"; }}
            >
              <ChevronLeft size={14} /> All Classes
            </span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Class icon circle */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0"
              style={{
                background: `${accentColor}18`,
                border: `2px solid ${accentColor}55`,
                color: accentColor,
                fontFamily: "'Cinzel Decorative', serif",
                boxShadow: `0 0 30px ${accentColor}33`,
              }}
            >
              {cls.name[0]}
            </div>

            <div className="flex-1">
              <p
                className="section-header mb-1"
                style={{ color: `${accentColor}cc` }}
              >
                {cls.tagline}
              </p>
              <h1
                className="font-cinzel-decorative font-black mb-2"
                style={{
                  fontSize: "clamp(1.8rem, 5vw, 3rem)",
                  color: accentColor,
                  textShadow: `0 0 40px ${accentColor}66`,
                }}
              >
                {cls.name}
              </h1>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 mt-3">
                {[
                  { label: "Primary Stat", value: cls.primaryStat },
                  { label: "Resource", value: cls.resource.name },
                  { label: "Meta Builds", value: `${cls.metaBuilds.length} Builds` },
                  { label: "Key Abilities", value: `${cls.abilities.length} Skills` },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-xs" style={{ color: "oklch(0.45 0.010 60)", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}>
                      {stat.label}
                    </span>
                    <span className="text-sm font-bold" style={{ color: "oklch(0.85 0.01 60)" }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overview */}
          <div
            className="mt-6 p-4 rounded border-l-2 max-w-3xl"
            style={{
              background: `${accentColor}08`,
              borderColor: accentColor,
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>
              {cls.overview}
            </p>
          </div>

          {/* Resource description */}
          <div className="mt-3 max-w-3xl">
            <span className="text-xs font-cinzel tracking-wide" style={{ color: accentColor }}>
              Resource — {cls.resource.name}:
            </span>
            <span className="text-xs ml-2" style={{ color: "oklch(0.55 0.010 60)" }}>
              {cls.resource.description}
            </span>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div
        className="sticky top-14 z-40 border-b"
        style={{ background: "oklch(0.08 0.010 30 / 0.97)", borderColor: "oklch(0.22 0.015 50)", backdropFilter: "blur(12px)" }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-3.5 text-xs font-cinzel tracking-wide whitespace-nowrap border-b-2 transition-all duration-200 flex-shrink-0"
                  style={{
                    borderColor: isActive ? accentColor : "transparent",
                    color: isActive ? accentColor : "oklch(0.55 0.010 60)",
                    background: isActive ? `${accentColor}08` : "transparent",
                  }}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 lg:px-8 py-10">

        {/* ── LEVELING GUIDE ── */}
        {activeTab === "leveling" && (
          <div className="max-w-3xl">
            <h2 className="font-cinzel font-bold text-xl mb-2" style={{ color: "oklch(0.90 0.01 60)" }}>
              Leveling Guide
            </h2>
            <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.010 60)" }}>
              Tips and strategies for every phase of your {cls.name}'s journey from level 1 to endgame mastery.
            </p>

            {/* Phase selector */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { id: "early" as const, label: "Levels 1–30", sublabel: "Early Game" },
                { id: "mid" as const, label: "Levels 31–60", sublabel: "Mid Game" },
                { id: "late" as const, label: "Levels 61–70", sublabel: "Pre-Endgame" },
                { id: "endgame" as const, label: "Level 70+", sublabel: "Endgame" },
              ].map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setLevelPhase(phase.id)}
                  className="px-4 py-2 rounded text-xs font-cinzel tracking-wide border transition-all duration-200"
                  style={{
                    background: levelPhase === phase.id ? `${accentColor}22` : "oklch(0.10 0.010 30)",
                    borderColor: levelPhase === phase.id ? accentColor : "oklch(0.22 0.015 50)",
                    color: levelPhase === phase.id ? accentColor : "oklch(0.60 0.010 60)",
                  }}
                >
                  <div>{phase.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{phase.sublabel}</div>
                </button>
              ))}
            </div>

            {/* Tips list */}
            <div className="space-y-3">
              {(cls.levelingTips[levelPhase] || []).map((tip, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 rounded border"
                  style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
                >
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.75 0.010 60)" }}>
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ABILITIES ── */}
        {activeTab === "abilities" && (
          <div>
            <h2 className="font-cinzel font-bold text-xl mb-2" style={{ color: "oklch(0.90 0.01 60)" }}>
              Key Abilities
            </h2>
            <p className="text-sm mb-4" style={{ color: "oklch(0.55 0.010 60)" }}>
              The most important skills for the {cls.name}. Each card shows the recommended key binding, skill type, element, and a binding rationale.
            </p>

            {/* Keybinding Legend */}
            <div
              className="flex flex-wrap gap-3 mb-6 p-3 rounded border"
              style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.20 0.012 30)" }}
            >
              <span className="text-xs font-cinzel tracking-widest" style={{ color: "oklch(0.45 0.010 60)", alignSelf: "center" }}>KEY LEGEND:</span>
              {[
                { key: "LMB", label: "Left Mouse — Primary skill" },
                { key: "RMB", label: "Right Mouse — Main damage" },
                { key: "1–4", label: "Number slots" },
                { key: "Space", label: "Mobility / Escape" },
                { key: "T", label: "Critical cooldown" },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center justify-center min-w-[2.2rem] h-5 px-1.5 rounded text-xs font-bold"
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
                    className="p-4 rounded border transition-all duration-200"
                    style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = `${accentColor}55`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.22 0.015 50)";
                    }}
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
                              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                              fontSize: "0.65rem",
                              letterSpacing: "0.02em",
                              boxShadow: `0 1px 0 ${accentColor}33, inset 0 -1px 0 oklch(0.08 0 0)`,
                            }}
                            title={ability.keybindNote}
                          >
                            {ability.keybind}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <span
                          className="text-xs px-2 py-0.5 rounded-sm"
                          style={{
                            background: `${typeColor}18`,
                            color: typeColor,
                            border: `1px solid ${typeColor}33`,
                            fontFamily: "'Cinzel', serif",
                            fontSize: "0.6rem",
                            letterSpacing: "0.05em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ability.type}
                        </span>
                        {ability.element && ability.element !== "None" && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-sm"
                            style={{
                              background: `${elemColor}18`,
                              color: elemColor,
                              border: `1px solid ${elemColor}33`,
                              fontFamily: "'Cinzel', serif",
                              fontSize: "0.6rem",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {ability.element}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: "oklch(0.62 0.010 60)" }}>
                      {ability.description}
                    </p>
                    {ability.keybindNote && (
                      <div
                        className="flex items-start gap-1.5 mt-2 pt-2 border-t"
                        style={{ borderColor: "oklch(0.18 0.012 30)" }}
                      >
                        <span
                          className="flex-shrink-0 text-xs font-cinzel tracking-wide"
                          style={{ color: accentColor, fontSize: "0.6rem" }}
                        >
                          BIND:
                        </span>
                        <p className="text-xs leading-relaxed" style={{ color: "oklch(0.50 0.010 60)" }}>
                          {ability.keybindNote}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── META BUILDS ── */}
        {activeTab === "meta" && (
          <div>
            <h2 className="font-cinzel font-bold text-xl mb-2" style={{ color: "oklch(0.90 0.01 60)" }}>
              Meta Builds
            </h2>
            <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.010 60)" }}>
              The top endgame builds for the {cls.name}. Each build is rated by tier (S = top meta, A = strong, B = viable) and includes key items.
            </p>

            <div className="space-y-6">
              {cls.metaBuilds.map((build) => (
                <div
                  key={build.name}
                  className="p-6 rounded border"
                  style={{
                    background: "oklch(0.10 0.010 30)",
                    borderColor: build.tier === "S" ? `${accentColor}55` : "oklch(0.22 0.015 50)",
                    boxShadow: build.tier === "S" ? `0 0 20px ${accentColor}15` : "none",
                  }}
                >
                  <div className="flex flex-wrap items-start gap-3 mb-3">
                    <span
                      className="text-sm font-black px-3 py-1 rounded-sm"
                      style={{
                        background: build.tier === "S" ? `${accentColor}22` : build.tier === "A" ? "oklch(0.65 0.18 145 / 0.15)" : "oklch(0.65 0.18 260 / 0.15)",
                        color: build.tier === "S" ? accentColor : build.tier === "A" ? "oklch(0.70 0.18 145)" : "oklch(0.70 0.18 260)",
                        border: `1px solid ${build.tier === "S" ? accentColor + "55" : build.tier === "A" ? "oklch(0.65 0.18 145 / 0.4)" : "oklch(0.65 0.18 260 / 0.4)"}`,
                        fontFamily: "'Cinzel', serif",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {build.tier} Tier
                    </span>
                    <div>
                      <h3 className="font-cinzel font-bold text-base" style={{ color: "oklch(0.90 0.01 60)" }}>
                        {build.name}
                      </h3>
                      <span
                        className="text-xs font-cinzel tracking-wide"
                        style={{ color: "oklch(0.50 0.010 60)" }}
                      >
                        {build.playstyle}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.68 0.010 60)" }}>
                    {build.description}
                  </p>

                  <div>
                    <p className="section-header mb-2">Key Items</p>
                    <div className="flex flex-wrap gap-2">
                      {build.keyItems.map((item) => (
                        <span
                          key={item}
                          className="text-xs px-3 py-1 rounded-sm"
                          style={{
                            background: "oklch(0.72 0.18 55 / 0.12)",
                            color: "oklch(0.78 0.18 55)",
                            border: "1px solid oklch(0.72 0.18 55 / 0.35)",
                            fontFamily: "'Cinzel', serif",
                            fontSize: "0.65rem",
                            letterSpacing: "0.03em",
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── WEAPONS ── */}
        {activeTab === "weapons" && (
          <div className="max-w-3xl">
            <h2 className="font-cinzel font-bold text-xl mb-2" style={{ color: "oklch(0.90 0.01 60)" }}>
              Weapon Types
            </h2>
            <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.010 60)" }}>
              The {cls.name}'s available weapon types and their strategic value. Class-exclusive weapons almost always have the strongest legendary affixes.
            </p>

            <div className="space-y-3">
              {cls.weaponTypes.map((weapon, i) => {
                const isClassExclusive = weapon.includes("exclusive") || weapon.toLowerCase().includes(cls.name.toLowerCase().split(" ")[0]);
                return (
                  <div
                    key={i}
                    className="flex gap-3 p-4 rounded border"
                    style={{
                      background: "oklch(0.10 0.010 30)",
                      borderColor: isClassExclusive ? `${accentColor}44` : "oklch(0.22 0.015 50)",
                    }}
                  >
                    <Sword
                      size={16}
                      className="flex-shrink-0 mt-0.5"
                      color={isClassExclusive ? accentColor : "oklch(0.45 0.010 60)"}
                    />
                    <div>
                      <p className="text-sm leading-relaxed" style={{ color: "oklch(0.75 0.010 60)" }}>
                        {weapon}
                      </p>
                      {isClassExclusive && (
                        <span
                          className="text-xs font-cinzel tracking-wide mt-1 inline-block"
                          style={{ color: accentColor }}
                        >
                          ★ Class Exclusive
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Item quality reference */}
            <div className="mt-10">
              <h3 className="font-cinzel font-bold text-base mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
                Item Quality Reference
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "Normal", color: "#e0e0e0", desc: "White items — salvage for Reusable Parts" },
                  { name: "Magic", color: "#4fc3f7", desc: "Blue items — salvage for Arcane Dust" },
                  { name: "Rare", color: "#ffd54f", desc: "Yellow items — salvage for Veiled Crystal; upgrade via Kanai's Cube" },
                  { name: "Legendary", color: "#ffb74d", desc: "Orange items — unique Legendary Powers; the foundation of all builds" },
                  { name: "Set Item", color: "#81c784", desc: "Green items — equip multiple pieces for massive set bonuses" },
                  { name: "Ancient", color: "#ffcc02", desc: "Higher stat rolls; only drop at Torment difficulty at level 70" },
                  { name: "Primal Ancient", color: "#ef5350", desc: "Perfect stat rolls on every affix; unlocks after clearing GR70 solo" },
                ].map((tier) => (
                  <div
                    key={tier.name}
                    className="flex items-start gap-3 p-3 rounded border"
                    style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                      style={{ background: tier.color, boxShadow: `0 0 6px ${tier.color}88` }}
                    />
                    <div>
                      <span className="text-xs font-bold font-cinzel" style={{ color: tier.color }}>
                        {tier.name}
                      </span>
                      <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.010 60)" }}>
                        {tier.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MASTERY ── */}
        {activeTab === "mastery" && (
          <div className="max-w-3xl">
            <h2 className="font-cinzel font-bold text-xl mb-2" style={{ color: "oklch(0.90 0.01 60)" }}>
              Mastery Guide
            </h2>
            <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.010 60)" }}>
              Advanced tips for mastering the {cls.name} at the highest level of play.
            </p>

            {/* Mastery Note */}
            <div
              className="p-5 rounded border-l-2 mb-8"
              style={{
                background: `${accentColor}08`,
                borderColor: accentColor,
              }}
            >
              <p className="section-header mb-2">Class Mastery Note</p>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>
                {cls.masteryNote}
              </p>
            </div>

            {/* Mastery Tips */}
            <h3 className="font-cinzel font-bold text-base mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
              Advanced Tips
            </h3>
            <div className="space-y-3 mb-10">
              {cls.masteryTips.map((tip, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-4 rounded border"
                  style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
                >
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.75 0.010 60)" }}>
                    {tip}
                  </p>
                </div>
              ))}
            </div>

            {/* Paragon Allocation */}
            <h3 className="font-cinzel font-bold text-base mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
              Paragon Point Allocation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cls.paragons.map((cat) => (
                <div
                  key={cat.category}
                  className="p-4 rounded border"
                  style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
                >
                  <h4 className="font-cinzel font-bold text-sm mb-3" style={{ color: accentColor }}>
                    {cat.category}
                  </h4>
                  <ol className="space-y-1.5">
                    {cat.priority.map((stat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "oklch(0.65 0.010 60)" }}>
                        <span
                          className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: `${accentColor}22`, color: accentColor, fontSize: "0.55rem" }}
                        >
                          {i + 1}
                        </span>
                        {stat}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Classes */}
      <section
        className="border-t py-10"
        style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.09 0.010 30)" }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <p className="section-header mb-4">Explore Other Classes</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(classMap)
              .filter((c) => c.id !== cls.id)
              .map((c) => (
                <Link key={c.id} href={`/class/${c.id}`}>
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded border text-xs font-cinzel tracking-wide transition-all duration-200"
                    style={{
                      background: "oklch(0.10 0.010 30)",
                      borderColor: "oklch(0.22 0.015 50)",
                      color: "oklch(0.70 0.010 60)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLSpanElement).style.borderColor = c.color + "88";
                      (e.currentTarget as HTMLSpanElement).style.color = c.color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLSpanElement).style.borderColor = "oklch(0.22 0.015 50)";
                      (e.currentTarget as HTMLSpanElement).style.color = "oklch(0.70 0.010 60)";
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    {c.name}
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
