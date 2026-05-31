// Sanctuary Grimoire — Skills & Builds (Mobalytics-style)
// Build cards are the primary UI. Class/tier/playstyle filters on the left.
// Click a build to expand full detail: skill bar, rotation, gear tips.
// Level slider gates which builds are fully available.

import { useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { classMap, classes } from "@/data/classes";
import { ALL_CLASS_SKILLS, getAvailableRunes } from "@/data/skills";
import { ALL_PRESETS, SKILL_POWER_RATINGS, SkillPreset } from "@/data/skillPresets";
import { CLASS_PORTRAITS } from "@/components/Icons";
import { getSkillIconStyle } from "@/data/skillIcons";
import {
  ChevronLeft, ChevronDown, ChevronUp, X, Zap, Star, Trophy,
  Sword, Shield, Users, Sparkles, Lock, Check, Filter
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const SLOT_KEYS = ["LMB", "RMB", "1", "2", "3", "4"] as const;
type SlotKey = typeof SLOT_KEYS[number];

const ELEMENT_COLORS: Record<string, string> = {
  Physical: "#c0c0c0", Fire: "#ff6b35", Lightning: "#7eb8f7",
  Cold: "#7ecef7", Holy: "#ffe082", Poison: "#81c784",
  Arcane: "#ce93d8", Bone: "#a5d6a7",
};

const TIER_COLORS: Record<string, string> = {
  S: "#ffd54f", A: "#66bb6a", B: "#42a5f5", C: "#9e9e9e", D: "#ef5350"
};

const PLAYSTYLE_CONFIG = [
  { id: "All",           label: "All Builds",    icon: <Sparkles size={12} />, color: "#d4a843" },
  { id: "GR Pushing",   label: "GR Pushing",    icon: <Trophy size={12} />,   color: "#ce93d8" },
  { id: "Speed Farming",label: "Speed Farming", icon: <Zap size={12} />,      color: "#ffd54f" },
  { id: "PvP",          label: "PvP",           icon: <Sword size={12} />,    color: "#ef5350" },
  { id: "Leveling",     label: "Leveling",      icon: <Shield size={12} />,   color: "#66bb6a" },
  { id: "Group",        label: "Group Play",    icon: <Users size={12} />,    color: "#42a5f5" },
];

const LEVEL_PHASES = [
  { min: 1,  max: 19,  label: "Early Game",   color: "#66bb6a" },
  { min: 20, max: 39,  label: "Mid Game",     color: "#ffd54f" },
  { min: 40, max: 59,  label: "Late Game",    color: "#ff9800" },
  { min: 60, max: 69,  label: "Pre-Endgame",  color: "#ff7043" },
  { min: 70, max: 71,  label: "Endgame",      color: "#ce93d8" },
];

function getLevelPhase(level: number) {
  return LEVEL_PHASES.find((p) => level >= p.min && level <= p.max) || LEVEL_PHASES[4];
}

// ─── Mini Skill Bar ───────────────────────────────────────────────────────────
function MiniSkillBar({ preset, classId, level, accentColor }: {
  preset: SkillPreset; classId: string; level: number; accentColor: string;
}) {
  const skillData = ALL_CLASS_SKILLS[classId];
  return (
    <div className="flex items-center gap-1">
      {SLOT_KEYS.map((slot) => {
        const { skillId } = preset.slots[slot] || { skillId: "" };
        const skill = skillData?.skills.find((s) => s.id === skillId);
        const isLocked = skill ? skill.unlockLevel > level : false;
        const elemColor = skill ? (ELEMENT_COLORS[skill.element] || "#888") : "#333";
        return (
          <div key={slot} className="flex flex-col items-center gap-0.5">
            <div className="rounded overflow-hidden relative"
              style={{
                ...getSkillIconStyle(classId, skillId, 32),
                border: `1px solid ${isLocked ? "oklch(0.22 0.015 50)" : `${elemColor}55`}`,
                filter: isLocked ? "grayscale(1) brightness(0.35)" : "brightness(0.9)",
                flexShrink: 0,
              }}>
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)" }}>
                  <Lock size={8} color="oklch(0.55 0.010 60)" />
                </div>
              )}
            </div>
            <p className="font-mono font-bold"
              style={{ color: isLocked ? "oklch(0.38 0.010 60)" : "oklch(0.58 0.010 60)", fontSize: "0.42rem" }}>
              {slot}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Build Card ───────────────────────────────────────────────────────────────
function BuildCard({ preset, classId, level, accentColor, isExpanded, onToggle }: {
  preset: SkillPreset; classId: string; level: number; accentColor: string;
  isExpanded: boolean; onToggle: () => void;
}) {
  const skillData = ALL_CLASS_SKILLS[classId];
  const tierColor = TIER_COLORS[preset.tier] || "#9e9e9e";
  const playstyleCfg = PLAYSTYLE_CONFIG.find((p) => p.id === preset.playstyle);
  const psColor = playstyleCfg?.color || accentColor;

  // Count locked skills
  const lockedCount = SLOT_KEYS.filter((slot) => {
    const { skillId } = preset.slots[slot] || { skillId: "" };
    const skill = skillData?.skills.find((s) => s.id === skillId);
    return skill && skill.unlockLevel > level;
  }).length;

  const isFullyAvailable = lockedCount === 0;

  return (
    <div className="rounded-lg border overflow-hidden transition-all duration-200"
      style={{
        background: isExpanded ? "oklch(0.11 0.010 30)" : "oklch(0.10 0.010 30)",
        borderColor: isExpanded ? `${tierColor}55` : isFullyAvailable ? `${tierColor}33` : "oklch(0.20 0.015 50)",
        boxShadow: isExpanded ? `0 0 20px ${tierColor}15` : "none",
      }}>

      {/* Tier stripe */}
      <div style={{ height: "3px", background: `linear-gradient(90deg, ${tierColor}, ${tierColor}44, transparent)` }} />

      {/* Card header — always visible */}
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start gap-3">
          {/* Tier badge */}
          <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 font-cinzel-decorative font-black text-lg"
            style={{ background: `${tierColor}18`, border: `2px solid ${tierColor}55`, color: tierColor }}>
            {preset.tier}
          </div>

          {/* Build info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-cinzel-decorative font-bold text-base" style={{ color: "oklch(0.92 0.01 60)" }}>
                {preset.name}
              </h3>
              {!isFullyAvailable && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded font-cinzel"
                  style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.60 0.010 60)", fontSize: "0.55rem", border: "1px solid oklch(0.22 0.015 50)" }}>
                  <Lock size={8} /> {lockedCount} locked
                </span>
              )}
              {isFullyAvailable && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded font-cinzel"
                  style={{ background: "#66bb6a18", color: "#66bb6a", fontSize: "0.55rem", border: "1px solid #66bb6a33" }}>
                  <Check size={8} /> Available
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-2 py-0.5 rounded font-cinzel font-bold"
                style={{ background: `${psColor}15`, color: psColor, border: `1px solid ${psColor}33`, fontSize: "0.6rem" }}>
                {preset.playstyle}
              </span>
              <span className="px-2 py-0.5 rounded font-cinzel"
                style={{ background: `${tierColor}12`, color: tierColor, border: `1px solid ${tierColor}33`, fontSize: "0.6rem" }}>
                {preset.tier}-Tier
              </span>
            </div>

            <p className="text-sm leading-relaxed mb-3" style={{ color: "oklch(0.74 0.010 60)", fontSize: "0.72rem" }}>
              {preset.description}
            </p>

            {/* Mini skill bar */}
            <MiniSkillBar preset={preset} classId={classId} level={level} accentColor={accentColor} />
          </div>

          {/* Expand toggle */}
          <div className="flex-shrink-0" style={{ color: "oklch(0.55 0.010 60)" }}>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="border-t px-4 pb-4" style={{ borderColor: "oklch(0.18 0.012 50)" }}>

          {/* Full skill bar with labels */}
          <div className="mt-4 mb-4">
            <p className="font-cinzel tracking-widest mb-2" style={{ color: accentColor, fontSize: "0.55rem" }}>SKILL LOADOUT</p>
            <div className="flex items-end gap-3 flex-wrap">
              {SLOT_KEYS.map((slot) => {
                const { skillId } = preset.slots[slot] || { skillId: "" };
                const skill = skillData?.skills.find((s) => s.id === skillId);
                const isLocked = skill ? skill.unlockLevel > level : false;
                const elemColor = skill ? (ELEMENT_COLORS[skill.element] || "#888") : "#444";
                const runes = skill ? getAvailableRunes(skill, level) : [];
                return (
                  <div key={slot} className="flex flex-col items-center gap-1">
                    <div className="rounded overflow-hidden relative"
                      style={{
                        ...getSkillIconStyle(classId, skillId, 52),
                        border: `2px solid ${isLocked ? "oklch(0.22 0.015 50)" : `${elemColor}66`}`,
                        filter: isLocked ? "grayscale(1) brightness(0.35)" : "brightness(0.95)",
                        boxShadow: !isLocked ? `0 0 8px ${elemColor}33` : "none",
                      }}>
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center"
                          style={{ background: "rgba(0,0,0,0.7)" }}>
                          <Lock size={12} color="oklch(0.55 0.010 60)" />
                        </div>
                      )}
                    </div>
                    <div className="px-1.5 py-0.5 rounded-sm text-center"
                      style={{ background: isLocked ? "oklch(0.12 0.010 30)" : `${elemColor}18`, border: `1px solid ${isLocked ? "oklch(0.20 0.015 50)" : `${elemColor}33`}` }}>
                      <p className="font-mono font-bold" style={{ color: isLocked ? "oklch(0.45 0.010 60)" : elemColor, fontSize: "0.55rem" }}>{slot}</p>
                    </div>
                    <p className="text-center font-cinzel font-bold leading-tight" style={{ color: isLocked ? "oklch(0.40 0.010 60)" : "oklch(0.82 0.010 60)", fontSize: "0.55rem", maxWidth: "60px" }}>
                      {skill ? (skill.name.length > 12 ? skill.name.slice(0, 11) + "…" : skill.name) : "—"}
                    </p>
                    {runes[0] && !isLocked && (
                      <p className="text-center font-cinzel" style={{ color: accentColor, fontSize: "0.48rem", maxWidth: "60px" }}>
                        ◆ {runes[0].name.length > 10 ? runes[0].name.slice(0, 9) + "…" : runes[0].name}
                      </p>
                    )}
                    {isLocked && skill && (
                      <p className="font-cinzel" style={{ color: "oklch(0.50 0.010 60)", fontSize: "0.48rem" }}>Lv {skill.unlockLevel}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key synergies */}
          {preset.synergyNotes && preset.synergyNotes.length > 0 && (
            <div className="mb-4">
              <p className="font-cinzel tracking-widest mb-2" style={{ color: accentColor, fontSize: "0.55rem" }}>KEY SYNERGIES</p>
              <div className="space-y-1.5">
                {preset.synergyNotes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded"
                    style={{ background: "oklch(0.12 0.010 30)", border: "1px solid oklch(0.18 0.012 50)" }}>
                    <span style={{ color: accentColor, fontSize: "0.7rem", marginTop: "1px", flexShrink: 0 }}>⚡</span>
                    <p style={{ color: "oklch(0.76 0.010 60)", fontSize: "0.68rem" }}>{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Power tips */}
          {preset.powerTips && preset.powerTips.length > 0 && (
            <div className="mb-4">
              <p className="font-cinzel tracking-widest mb-2" style={{ color: accentColor, fontSize: "0.55rem" }}>POWER TIPS</p>
              <div className="space-y-1.5">
                {preset.powerTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded"
                    style={{ background: `${tierColor}08`, border: `1px solid ${tierColor}22` }}>
                    <span style={{ color: "#ffd54f", fontSize: "0.7rem", marginTop: "1px", flexShrink: 0 }}>★</span>
                    <p style={{ color: "oklch(0.78 0.010 60)", fontSize: "0.68rem" }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GR ceiling — shown for S/A tier builds */}
          {(preset.tier === "S" || preset.tier === "A") && (
            <div className="flex items-center gap-2 p-2 rounded"
              style={{ background: `${tierColor}10`, border: `1px solid ${tierColor}33` }}>
              <Trophy size={14} color={tierColor} />
              <p className="font-cinzel font-bold" style={{ color: tierColor, fontSize: "0.72rem" }}>
                {preset.tier === "S" ? "GR 140–150 capable" : "GR 120–139 capable"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Skills Page ─────────────────────────────────────────────────────────
export default function SkillsLoadoutPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  // State
  const [selectedClassId, setSelectedClassId] = useState(params.id || classes[0].id);
  const [level, setLevel] = useState(1);
  const [activePlaystyle, setActivePlaystyle] = useState("All");
  const [activeTier, setActiveTier] = useState("All");
  const [expandedBuild, setExpandedBuild] = useState<string | null>(null);
  const [showLevelSlider, setShowLevelSlider] = useState(true);

  const cls = classMap[selectedClassId];
  const allPresets = ALL_PRESETS[selectedClassId] || [];
  const ac = cls?.color || "#d4a843";
  const portrait = CLASS_PORTRAITS[selectedClassId];
  const phase = getLevelPhase(level);

  // Filter builds
  const filteredPresets = useMemo(() => {
    return allPresets.filter((p) => {
      if (activePlaystyle !== "All" && p.playstyle !== activePlaystyle) return false;
      if (activeTier !== "All" && p.tier !== activeTier) return false;
      return true;
    });
  }, [allPresets, activePlaystyle, activeTier]);

  // Tier counts
  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allPresets.length };
    allPresets.forEach((p) => { counts[p.tier] = (counts[p.tier] || 0) + 1; });
    return counts;
  }, [allPresets]);

  // Playstyle counts
  const playstyleCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allPresets.length };
    allPresets.forEach((p) => { counts[p.playstyle] = (counts[p.playstyle] || 0) + 1; });
    return counts;
  }, [allPresets]);

  if (!cls) return null;

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(ellipse at 50% 0%, ${ac}06 0%, oklch(0.06 0.008 30) 50%)` }}>

      {/* ── Top Header ── */}
      <div className="sticky top-[88px] z-30 border-b"
        style={{ background: "oklch(0.07 0.008 30 / 0.97)", borderColor: "oklch(0.18 0.012 50)", backdropFilter: "blur(12px)" }}>

        {/* Class selector row */}
        <div className="px-4 py-2 flex items-center gap-3 border-b overflow-x-auto"
          style={{ borderColor: "oklch(0.16 0.010 50)" }}>
          <button onClick={() => navigate("/")}
            className="flex items-center gap-1.5 font-cinzel text-sm flex-shrink-0"
            style={{ color: "oklch(0.65 0.010 60)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = ac; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.65 0.010 60)"; }}>
            <ChevronLeft size={14} /> Back
          </button>

          <div className="w-px h-5 flex-shrink-0" style={{ background: "oklch(0.22 0.015 50)" }} />

          <p className="font-cinzel text-xs flex-shrink-0" style={{ color: "oklch(0.55 0.010 60)" }}>CLASS:</p>

          {classes.map((c) => (
            <button key={c.id}
              onClick={() => { setSelectedClassId(c.id); setExpandedBuild(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border font-cinzel font-bold text-xs flex-shrink-0 transition-all"
              style={{
                background: selectedClassId === c.id ? `${c.color}18` : "transparent",
                borderColor: selectedClassId === c.id ? `${c.color}55` : "oklch(0.20 0.015 50)",
                color: selectedClassId === c.id ? c.color : "oklch(0.68 0.010 60)",
              }}>
              {c.name}
            </button>
          ))}
        </div>

        {/* Level slider row */}
        <div className="px-4 py-2">
          <div className="flex items-center gap-4">
            {/* Level display */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-cinzel-decorative font-black text-2xl" style={{ color: ac }}>
                {level >= 71 ? "70+" : level}
              </span>
              <div>
                <p className="font-cinzel font-bold" style={{ color: phase.color, fontSize: "0.65rem" }}>{phase.label}</p>
                <p className="font-cinzel" style={{ color: "oklch(0.60 0.010 60)", fontSize: "0.52rem" }}>
                  {filteredPresets.filter((p) => {
                    const skillData = ALL_CLASS_SKILLS[selectedClassId];
                    return SLOT_KEYS.every((slot) => {
                      const { skillId } = p.slots[slot] || { skillId: "" };
                      const skill = skillData?.skills.find((s) => s.id === skillId);
                      return !skill || skill.unlockLevel <= level;
                    });
                  }).length} / {filteredPresets.length} builds available
                </p>
              </div>
            </div>

            {/* Slider */}
            <div className="flex-1 flex items-center gap-2">
              <div className="flex gap-1 flex-shrink-0">
                {[1, 20, 40, 60, 70].map((l) => (
                  <button key={l} onClick={() => setLevel(l)}
                    className="px-1.5 py-0.5 rounded font-cinzel font-bold transition-all"
                    style={{ background: level === l ? ac : "oklch(0.12 0.010 30)", color: level === l ? "oklch(0.08 0 0)" : "oklch(0.60 0.010 60)", border: `1px solid ${level === l ? ac : "oklch(0.20 0.015 50)"}`, fontSize: "0.52rem" }}>
                    {l}
                  </button>
                ))}
                <button onClick={() => setLevel(71)}
                  className="px-1.5 py-0.5 rounded font-cinzel font-bold transition-all"
                  style={{ background: level === 71 ? ac : "oklch(0.12 0.010 30)", color: level === 71 ? "oklch(0.08 0 0)" : "oklch(0.60 0.010 60)", border: `1px solid ${level === 71 ? ac : "oklch(0.20 0.015 50)"}`, fontSize: "0.52rem" }}>
                  70+
                </button>
              </div>
              <input type="range" min={1} max={71} step={1} value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="flex-1 cursor-pointer"
                style={{ WebkitAppearance: "none", appearance: "none", height: "5px", borderRadius: "9999px", outline: "none", background: `linear-gradient(to right, ${ac} 0%, ${ac} ${((level - 1) / 70) * 100}%, oklch(0.22 0.015 50) ${((level - 1) / 70) * 100}%, oklch(0.22 0.015 50) 100%)`, accentColor: ac }} />
            </div>

            {/* Class portrait */}
            <img src={portrait} alt={cls.name}
              className="w-10 h-12 rounded object-cover object-top flex-shrink-0"
              style={{ border: `1px solid ${ac}44` }} />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex" style={{ minHeight: "calc(100vh - 180px)" }}>

        {/* ── Left Filter Sidebar ── */}
        <div className="w-56 flex-shrink-0 border-r p-3 sticky top-[180px] self-start"
          style={{ borderColor: "oklch(0.18 0.012 50)", background: "oklch(0.08 0.010 30)" }}>

          {/* Playstyle filter */}
          <div className="mb-4">
            <p className="font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.50 0.010 60)", fontSize: "0.5rem" }}>PLAYSTYLE</p>
            <div className="space-y-0.5">
              {PLAYSTYLE_CONFIG.map((ps) => {
                const count = playstyleCounts[ps.id] || 0;
                if (count === 0 && ps.id !== "All") return null;
                const isActive = activePlaystyle === ps.id;
                return (
                  <button key={ps.id} onClick={() => setActivePlaystyle(ps.id)}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded border text-left transition-all"
                    style={{ background: isActive ? `${ps.color}15` : "transparent", borderColor: isActive ? `${ps.color}44` : "transparent" }}>
                    <span style={{ color: isActive ? ps.color : "oklch(0.45 0.010 60)" }}>{ps.icon}</span>
                    <span className="font-cinzel flex-1" style={{ color: isActive ? "oklch(0.88 0.01 60)" : "oklch(0.65 0.010 60)", fontSize: "0.72rem" }}>{ps.label}</span>
                    <span className="font-cinzel rounded-full px-1.5 py-0.5"
                      style={{ background: isActive ? `${ps.color}20` : "oklch(0.12 0.010 30)", color: isActive ? ps.color : "oklch(0.45 0.010 60)", fontSize: "0.5rem" }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier filter */}
          <div>
            <p className="font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.50 0.010 60)", fontSize: "0.5rem" }}>TIER</p>
            <div className="space-y-0.5">
              {["All", "S", "A", "B", "C", "D"].map((tier) => {
                const count = tierCounts[tier] || 0;
                if (count === 0 && tier !== "All") return null;
                const isActive = activeTier === tier;
                const color = tier === "All" ? ac : (TIER_COLORS[tier] || "#9e9e9e");
                return (
                  <button key={tier} onClick={() => setActiveTier(tier)}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded border text-left transition-all"
                    style={{ background: isActive ? `${color}15` : "transparent", borderColor: isActive ? `${color}44` : "transparent" }}>
                    <span className="w-5 h-5 rounded flex items-center justify-center font-cinzel-decorative font-black flex-shrink-0"
                      style={{ background: `${color}20`, color, fontSize: "0.7rem" }}>
                      {tier}
                    </span>
                    <span className="font-cinzel flex-1" style={{ color: isActive ? "oklch(0.88 0.01 60)" : "oklch(0.65 0.010 60)", fontSize: "0.72rem" }}>
                      {tier === "All" ? "All Tiers" : `${tier}-Tier`}
                    </span>
                    <span className="font-cinzel rounded-full px-1.5 py-0.5"
                      style={{ background: isActive ? `${color}20` : "oklch(0.12 0.010 30)", color: isActive ? color : "oklch(0.45 0.010 60)", fontSize: "0.5rem" }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Build Cards ── */}
        <div className="flex-1 p-4">
          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-cinzel-decorative font-bold text-lg" style={{ color: ac }}>
                {cls.name} Builds
              </h2>
              <p className="font-cinzel text-sm" style={{ color: "oklch(0.65 0.010 60)" }}>
                {filteredPresets.length} build{filteredPresets.length !== 1 ? "s" : ""} · Level {level >= 71 ? "70+" : level} · {phase.label}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} color="oklch(0.55 0.010 60)" />
              <span className="font-cinzel text-xs" style={{ color: "oklch(0.55 0.010 60)" }}>
                {activePlaystyle !== "All" ? activePlaystyle : ""}{activeTier !== "All" ? ` · ${activeTier}-Tier` : ""}
                {activePlaystyle === "All" && activeTier === "All" ? "All builds" : ""}
              </span>
            </div>
          </div>

          {filteredPresets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Sparkles size={32} color="oklch(0.35 0.010 60)" className="mb-3" />
              <p className="font-cinzel font-bold text-lg mb-1" style={{ color: "oklch(0.55 0.010 60)" }}>No builds found</p>
              <p className="font-cinzel text-sm" style={{ color: "oklch(0.45 0.010 60)" }}>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPresets.map((preset) => (
                <BuildCard
                  key={preset.id}
                  preset={preset}
                  classId={selectedClassId}
                  level={level}
                  accentColor={ac}
                  isExpanded={expandedBuild === preset.id}
                  onToggle={() => setExpandedBuild(expandedBuild === preset.id ? null : preset.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
