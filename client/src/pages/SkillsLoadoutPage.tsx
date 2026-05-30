// Sanctuary Grimoire — Skills Loadout Builder (Enhanced)
// Level-aware, suggestive, power-focused skill builder
// Features: meta presets, power ratings, synergy hints, icon thumbnails, Max Power auto-fill
import { useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { classMap } from "@/data/classes";
import { ALL_CLASS_SKILLS, ClassSkill, SkillRune, getAvailableSkills, getAvailableRunes } from "@/data/skills";
import { ALL_PRESETS, SKILL_POWER_RATINGS, SKILL_SYNERGIES, SkillPreset } from "@/data/skillPresets";
import { CLASS_PORTRAITS } from "@/components/Icons";
import { ChevronLeft, Lock, Check, X, Zap, Star, ChevronDown, ChevronUp, Sparkles, AlertTriangle, Trophy } from "lucide-react";

// ─── Skill icon sprite sheets by element ─────────────────────────────────────
// Each sheet is a 2×3 grid of 6 icons — we use CSS background-position to crop individual icons
const ELEMENT_ICON_SHEETS: Record<string, string> = {
  Physical: "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/skill-icons-physical-3WaGPZMDdcEnoeyk2NxR67.webp",
  Fire:     "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/skill-icons-fire-cx5NRvhNyXsPx7pFxuyXWR.webp",
  Lightning:"https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/skill-icons-lightning-b7P9ryZLFZAyvTieHUMrHW.webp",
  Cold:     "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/skill-icons-cold-Q7KnDZiabJAX3cKytSSikZ.webp",
  Poison:   "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/skill-icons-poison-7mn3VGeskrn35Ps2orjbCw.webp",
  Holy:     "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/skill-icons-holy-bqxViXUhkLxw3aW95xy5XQ.webp",
  Arcane:   "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/skill-icons-arcane-QN4zfPDhkbqqbpi7MUTSsN.webp",
  Bone:     "https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/skill-icons-bone-6qZvg8qTQWJRy6MCmb7B4h.webp",
};

// Map skill IDs to icon positions in their sprite sheet (col 0-2, row 0-1)
const SKILL_ICON_POSITIONS: Record<string, { sheet: string; col: number; row: number }> = {
  // Barbarian
  bash:                   { sheet: "Physical", col: 0, row: 0 },
  cleave:                 { sheet: "Physical", col: 1, row: 0 },
  whirlwind:              { sheet: "Physical", col: 2, row: 0 },
  "furious-charge":       { sheet: "Physical", col: 0, row: 1 },
  "ground-stomp":         { sheet: "Physical", col: 1, row: 1 },
  leap:                   { sheet: "Physical", col: 2, row: 1 },
  "hammer-of-ancients":   { sheet: "Physical", col: 0, row: 0 },
  rend:                   { sheet: "Physical", col: 1, row: 0 },
  earthquake:             { sheet: "Fire",     col: 3 % 3, row: Math.floor(3 / 3) },
  "wrath-of-the-berserker":{ sheet: "Physical", col: 2, row: 1 },
  "battle-rage":          { sheet: "Physical", col: 0, row: 1 },
  "war-cry":              { sheet: "Physical", col: 1, row: 1 },
  "threatening-shout":    { sheet: "Physical", col: 2, row: 1 },
  "ancient-spear":        { sheet: "Physical", col: 0, row: 0 },
  frenzy:                 { sheet: "Physical", col: 1, row: 0 },
  "call-of-the-ancients": { sheet: "Physical", col: 2, row: 0 },
  // Wizard
  "magic-missile":        { sheet: "Arcane",   col: 2, row: 0 },
  "shock-pulse":          { sheet: "Lightning",col: 0, row: 0 },
  "spectral-blade":       { sheet: "Arcane",   col: 0, row: 1 },
  "arcane-torrent":       { sheet: "Arcane",   col: 2, row: 1 },
  disintegrate:           { sheet: "Arcane",   col: 0, row: 1 },
  hydra:                  { sheet: "Fire",     col: 1, row: 1 },
  "mirror-image":         { sheet: "Arcane",   col: 1, row: 0 },
  teleport:               { sheet: "Arcane",   col: 0, row: 0 },
  "black-hole":           { sheet: "Arcane",   col: 0, row: 0 },
  "slow-time":            { sheet: "Arcane",   col: 1, row: 1 },
  // Demon Hunter
  "hungering-arrow":      { sheet: "Physical", col: 0, row: 0 },
  "entangling-shot":      { sheet: "Physical", col: 1, row: 0 },
  strafe:                 { sheet: "Physical", col: 2, row: 0 },
  multishot:              { sheet: "Physical", col: 0, row: 1 },
  "smoke-screen":         { sheet: "Physical", col: 1, row: 1 },
  vault:                  { sheet: "Physical", col: 2, row: 1 },
  companion:              { sheet: "Physical", col: 0, row: 0 },
  vengeance:              { sheet: "Cold",     col: 2, row: 1 },
  preparation:            { sheet: "Physical", col: 1, row: 1 },
  // Monk
  "fists-of-thunder":     { sheet: "Lightning",col: 0, row: 0 },
  "deadly-reach":         { sheet: "Physical", col: 0, row: 0 },
  "tempest-rush":         { sheet: "Physical", col: 2, row: 0 },
  "wave-of-light":        { sheet: "Holy",     col: 5 % 3, row: Math.floor(5 / 3) },
  "dashing-strike":       { sheet: "Physical", col: 0, row: 1 },
  "sweeping-wind":        { sheet: "Fire",     col: 0, row: 1 },
  "cyclone-strike":       { sheet: "Cold",     col: 1, row: 1 },
  epiphany:               { sheet: "Fire",     col: 0, row: 0 },
  "mantra-of-salvation":  { sheet: "Holy",     col: 2, row: 0 },
  // Necromancer
  "grim-scythe":          { sheet: "Bone",     col: 0, row: 0 },
  "bone-spear":           { sheet: "Bone",     col: 1, row: 0 },
  "corpse-explosion":     { sheet: "Bone",     col: 2, row: 0 },
  "bone-armor":           { sheet: "Bone",     col: 0, row: 1 },
  "blood-rush":           { sheet: "Bone",     col: 1, row: 1 },
  "land-of-the-dead":     { sheet: "Bone",     col: 2, row: 1 },
  frailty:                { sheet: "Bone",     col: 0, row: 0 },
  // Witch Doctor
  "poison-dart":          { sheet: "Poison",   col: 0, row: 0 },
  haunt:                  { sheet: "Cold",     col: 0, row: 1 },
  "locust-swarm":         { sheet: "Poison",   col: 1, row: 0 },
  "soul-harvest":         { sheet: "Poison",   col: 3 % 3, row: Math.floor(3 / 3) },
  "spirit-walk":          { sheet: "Poison",   col: 2, row: 1 },
  piranhas:               { sheet: "Poison",   col: 2, row: 0 },
  hex:                    { sheet: "Poison",   col: 0, row: 1 },
  // Crusader
  punish:                 { sheet: "Holy",     col: 0, row: 0 },
  slash:                  { sheet: "Holy",     col: 0, row: 0 },
  "fist-of-the-heavens":  { sheet: "Lightning",col: 0, row: 0 },
  "heavens-fury":         { sheet: "Fire",     col: 0, row: 0 },
  "iron-skin":            { sheet: "Holy",     col: 2, row: 0 },
  "steed-charge":         { sheet: "Holy",     col: 1, row: 0 },
  "laws-of-valor":        { sheet: "Holy",     col: 0, row: 1 },
  "akarats-champion":     { sheet: "Holy",     col: 1, row: 1 },
};

function getIconStyle(skillId: string, size = 40): React.CSSProperties {
  const pos = SKILL_ICON_POSITIONS[skillId];
  if (!pos) return { background: "oklch(0.14 0.012 30)" };
  const sheet = ELEMENT_ICON_SHEETS[pos.sheet];
  if (!sheet) return { background: "oklch(0.14 0.012 30)" };
  const pct = 50; // each icon is 1/3 of the sheet width/height
  const xPct = pos.col * 50;
  const yPct = pos.row * 100;
  return {
    backgroundImage: `url(${sheet})`,
    backgroundSize: "300% 200%",
    backgroundPosition: `${xPct}% ${yPct}%`,
    backgroundRepeat: "no-repeat",
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SLOT_KEYS = ["LMB", "RMB", "1", "2", "3", "4"] as const;
type SlotKey = typeof SLOT_KEYS[number];

const SLOT_LABELS: Record<SlotKey, string> = {
  LMB: "Left Click", RMB: "Right Click",
  "1": "Skill 1", "2": "Skill 2", "3": "Skill 3", "4": "Skill 4",
};

const ELEMENT_COLORS: Record<string, string> = {
  Physical: "#a0a0a0", Fire: "#ff6b35", Lightning: "#7eb8f7",
  Cold: "#7ecef7", Holy: "#ffe082", Poison: "#81c784",
  Arcane: "#ce93d8", Bone: "#a5d6a7",
};

const CATEGORY_COLORS: Record<string, string> = {
  Primary: "#66bb6a", Secondary: "#42a5f5", Defensive: "#4fc3f7",
  Offensive: "#ef5350", Utility: "#80cbc4", Might: "#ffd54f",
  Tactics: "#ffb74d", Rage: "#ff7043", Signature: "#ce93d8",
  Conjuration: "#7eb8f7", Mastery: "#ff8a65", Focus: "#ffcc02",
  Techniques: "#80cbc4", Mantras: "#fff9c4", Hunting: "#a5d6a7",
  Devices: "#78909c", Archery: "#ff8a65", "Blood & Bone": "#ef9a9a",
  Reanimation: "#c8e6c9", Curses: "#b39ddb", Corpses: "#a5d6a7",
  Terror: "#b39ddb", Decay: "#81c784", Voodoo: "#80deea",
  Conviction: "#ffe082", Laws: "#fff176",
};

const TIER_COLORS = { S: "#ffd54f", A: "#66bb6a", B: "#42a5f5" };

interface SlotAssignment { skill: ClassSkill | null; rune: SkillRune | null; }
type Loadout = Record<SlotKey, SlotAssignment>;
function emptyLoadout(): Loadout {
  return Object.fromEntries(SLOT_KEYS.map((k) => [k, { skill: null, rune: null }])) as Loadout;
}

// ─── Power Stars ──────────────────────────────────────────────────────────────
function PowerStars({ skillId, color }: { skillId: string; color: string }) {
  const rating = SKILL_POWER_RATINGS[skillId] || 1;
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={8} fill={i <= rating ? color : "transparent"}
          style={{ color: i <= rating ? color : "oklch(0.28 0.010 60)" }} />
      ))}
    </div>
  );
}

// ─── Synergy Badge ────────────────────────────────────────────────────────────
function SynergyBadge({ skillId, loadout, accentColor }: { skillId: string; loadout: Loadout; accentColor: string }) {
  const synergies = SKILL_SYNERGIES[skillId] || [];
  const assignedIds = Object.values(loadout).map((s) => s.skill?.id).filter(Boolean) as string[];
  const matches = synergies.filter((s) => assignedIds.includes(s));
  if (matches.length === 0) return null;
  return (
    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm"
      style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}33` }}>
      <Zap size={8} color={accentColor} />
      <span className="text-xs" style={{ color: accentColor, fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
        Synergy ×{matches.length}
      </span>
    </div>
  );
}

// ─── Skill Icon Thumbnail ─────────────────────────────────────────────────────
function SkillIcon({ skillId, element, size = 40, isLocked = false }: {
  skillId: string; element: string; size?: number; isLocked?: boolean;
}) {
  const style = getIconStyle(skillId, size);
  return (
    <div style={{
      width: size, height: size, borderRadius: "6px", overflow: "hidden",
      flexShrink: 0, position: "relative",
      filter: isLocked ? "grayscale(1) brightness(0.4)" : "none",
      ...style,
    }}>
      {isLocked && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock size={size * 0.35} color="oklch(0.55 0.010 60)" />
        </div>
      )}
    </div>
  );
}

// ─── Meta Preset Card ─────────────────────────────────────────────────────────
function PresetCard({ preset, onLoad, accentColor, level }: {
  preset: SkillPreset; onLoad: () => void; accentColor: string; level: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const tc = TIER_COLORS[preset.tier];
  const isAvailable = level >= preset.minLevel;

  return (
    <div className="rounded border transition-all duration-200"
      style={{ background: "oklch(0.10 0.010 30)", borderColor: isAvailable ? `${tc}44` : "oklch(0.18 0.012 30)", opacity: isAvailable ? 1 : 0.5 }}>
      <div className="flex items-start gap-3 p-3">
        {/* Tier badge */}
        <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center font-black text-sm"
          style={{ background: `${tc}22`, color: tc, border: `1px solid ${tc}44`, fontFamily: "'Cinzel', serif" }}>
          {preset.tier}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <p className="font-cinzel font-bold text-sm leading-tight" style={{ color: "oklch(0.88 0.01 60)" }}>{preset.name}</p>
            <span className="text-xs px-1.5 py-0.5 rounded-sm flex-shrink-0"
              style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.50 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
              {preset.playstyle}
            </span>
          </div>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "oklch(0.55 0.010 60)" }}>{preset.description}</p>
          {!isAvailable && (
            <p className="text-xs" style={{ color: "#ff7043", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
              ⚠ Requires level {preset.minLevel}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 px-3 pb-3">
        {isAvailable && (
          <button onClick={onLoad}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded font-cinzel font-bold text-xs transition-all duration-150"
            style={{ background: accentColor, color: "oklch(0.08 0 0)" }}>
            <Sparkles size={11} /> Load Build
          </button>
        )}
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 px-2 py-1.5 rounded border text-xs font-cinzel transition-colors"
          style={{ borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.50 0.010 60)", background: "transparent" }}>
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          {expanded ? "Less" : "Details"}
        </button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t space-y-3" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
          <div className="mt-3">
            <p className="text-xs font-cinzel tracking-widest mb-1.5" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.55rem" }}>SYNERGIES</p>
            <div className="space-y-1">
              {preset.synergyNotes.map((note, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <Zap size={10} color={accentColor} className="flex-shrink-0 mt-0.5" />
                  <span style={{ color: "oklch(0.62 0.010 60)" }}>{note}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-cinzel tracking-widest mb-1.5" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.55rem" }}>POWER TIPS</p>
            <div className="space-y-1">
              {preset.powerTips.map((tip, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <Trophy size={10} color="#ffd54f" className="flex-shrink-0 mt-0.5" />
                  <span style={{ color: "oklch(0.62 0.010 60)" }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Slot Display ─────────────────────────────────────────────────────────────
function SlotDisplay({ slotKey, assignment, isActive, onClick, accentColor, onClear }: {
  slotKey: SlotKey; assignment: SlotAssignment; isActive: boolean;
  onClick: () => void; accentColor: string; onClear: () => void;
}) {
  const { skill, rune } = assignment;
  const elemColor = skill ? (ELEMENT_COLORS[skill.element] || "#888") : "#444";

  return (
    <div onClick={onClick} className="relative rounded border transition-all duration-200 cursor-pointer"
      style={{
        background: isActive ? `${accentColor}15` : skill ? "oklch(0.11 0.010 30)" : "oklch(0.09 0.008 30)",
        borderColor: isActive ? accentColor : skill ? `${elemColor}44` : "oklch(0.18 0.012 30)",
        boxShadow: isActive ? `0 0 12px ${accentColor}22` : "none",
      }}>
      {/* Key badge */}
      <div className="absolute -top-2 -left-1 z-10 flex items-center justify-center rounded font-bold"
        style={{ background: skill ? elemColor : "oklch(0.16 0.015 30)", color: skill ? "oklch(0.08 0 0)" : "oklch(0.55 0.010 60)", border: `1px solid ${skill ? elemColor : "oklch(0.28 0.015 50)"}`, fontFamily: "'Courier New', monospace", fontSize: "0.6rem", minWidth: "1.6rem", height: "1.3rem", padding: "0 4px" }}>
        {slotKey}
      </div>

      <div className="p-2 pt-3 flex gap-2 items-start">
        {skill ? (
          <>
            <SkillIcon skillId={skill.id} element={skill.element} size={36} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <p className="font-cinzel font-bold text-xs leading-tight" style={{ color: "oklch(0.88 0.01 60)" }}>{skill.name}</p>
                <button onClick={(e) => { e.stopPropagation(); onClear(); }}
                  className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center"
                  style={{ background: "oklch(0.18 0.012 30)", color: "oklch(0.45 0.010 60)" }}>
                  <X size={8} />
                </button>
              </div>
              <PowerStars skillId={skill.id} color={elemColor} />
              {rune && <p className="text-xs mt-0.5" style={{ color: accentColor, fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>◆ {rune.name}</p>}
            </div>
          </>
        ) : (
          <div className="flex-1 py-1">
            <p className="text-xs font-cinzel" style={{ color: "oklch(0.35 0.010 60)" }}>{SLOT_LABELS[slotKey]}</p>
            <p className="text-xs mt-0.5" style={{ color: "oklch(0.25 0.010 60)", fontSize: "0.6rem" }}>Click to assign</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skill Card (in browser) ──────────────────────────────────────────────────
function SkillCard({ skill, level, isAssigned, onAssign, accentColor, loadout }: {
  skill: ClassSkill; level: number; isAssigned: boolean;
  onAssign: () => void; accentColor: string; loadout: Loadout;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLocked = skill.unlockLevel > level;
  const elemColor = ELEMENT_COLORS[skill.element] || "#888";
  const catColor = CATEGORY_COLORS[skill.category] || "#888";
  const availableRunes = getAvailableRunes(skill, level);
  const powerRating = SKILL_POWER_RATINGS[skill.id] || 1;
  const isHighPower = powerRating >= 4;

  return (
    <div className="rounded border transition-all duration-200"
      style={{
        background: isLocked ? "oklch(0.08 0.008 30)" : isAssigned ? `${accentColor}12` : isHighPower ? "oklch(0.11 0.010 30)" : "oklch(0.10 0.010 30)",
        borderColor: isLocked ? "oklch(0.16 0.010 30)" : isAssigned ? `${accentColor}55` : isHighPower ? `${elemColor}33` : "oklch(0.22 0.015 50)",
        opacity: isLocked ? 0.45 : 1,
      }}>
      <div className="flex items-center gap-2.5 p-2.5">
        {/* Icon */}
        <SkillIcon skillId={skill.id} element={skill.element} size={44} isLocked={isLocked} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span className="font-cinzel font-bold text-xs" style={{ color: isLocked ? "oklch(0.40 0.010 60)" : "oklch(0.88 0.01 60)" }}>
              {skill.name}
            </span>
            {isHighPower && !isLocked && (
              <span className="text-xs px-1 py-0.5 rounded-sm"
                style={{ background: "#ffd54f18", color: "#ffd54f", border: "1px solid #ffd54f33", fontFamily: "'Cinzel', serif", fontSize: "0.5rem" }}>
                ★ META
              </span>
            )}
            {isLocked && (
              <span className="text-xs px-1 py-0.5 rounded-sm"
                style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.40 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.5rem" }}>
                Lv {skill.unlockLevel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <PowerStars skillId={skill.id} color={elemColor} />
            <span className="text-xs px-1 py-0.5 rounded-sm"
              style={{ background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}30`, fontFamily: "'Cinzel', serif", fontSize: "0.5rem" }}>
              {skill.category}
            </span>
            <span className="text-xs px-1 py-0.5 rounded-sm"
              style={{ background: `${elemColor}15`, color: elemColor, border: `1px solid ${elemColor}30`, fontFamily: "'Cinzel', serif", fontSize: "0.5rem" }}>
              {skill.element}
            </span>
            {!isLocked && <SynergyBadge skillId={skill.id} loadout={loadout} accentColor={accentColor} />}
          </div>
        </div>

        {/* Assign / expand buttons */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          {!isLocked && (
            <button onClick={onAssign}
              className="w-7 h-7 rounded flex items-center justify-center transition-all duration-150"
              style={{ background: isAssigned ? accentColor : `${accentColor}18`, border: `1px solid ${accentColor}55`, color: isAssigned ? "oklch(0.08 0 0)" : accentColor }}
              title={isAssigned ? "Remove" : "Assign"}>
              {isAssigned ? <Check size={11} /> : <Zap size={11} />}
            </button>
          )}
          {!isLocked && (
            <button onClick={() => setExpanded(!expanded)}
              className="w-7 h-7 rounded flex items-center justify-center"
              style={{ color: "oklch(0.45 0.010 60)", background: "oklch(0.14 0.012 30)" }}>
              {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
          )}
        </div>
      </div>

      {expanded && !isLocked && (
        <div className="px-2.5 pb-2.5 border-t" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
          <p className="text-xs leading-relaxed mt-2 mb-2" style={{ color: "oklch(0.60 0.010 60)" }}>{skill.description}</p>
          {availableRunes.length > 0 && (
            <div>
              <p className="text-xs font-cinzel tracking-widest mb-1" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.5rem" }}>RUNES AVAILABLE</p>
              <div className="space-y-1">
                {availableRunes.map((rune) => (
                  <div key={rune.name} className="flex gap-2 text-xs p-1.5 rounded"
                    style={{ background: "oklch(0.12 0.010 30)" }}>
                    <span className="font-cinzel font-bold flex-shrink-0" style={{ color: accentColor, fontSize: "0.58rem" }}>{rune.name}</span>
                    <span style={{ color: "oklch(0.52 0.010 60)", fontSize: "0.62rem" }}>{rune.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Rune Picker Modal ────────────────────────────────────────────────────────
function RunePicker({ skill, level, selectedRune, accentColor, onSelect, onClose }: {
  skill: ClassSkill; level: number; selectedRune: SkillRune | null;
  accentColor: string; onSelect: (rune: SkillRune | null) => void; onClose: () => void;
}) {
  const available = getAvailableRunes(skill, level);
  const locked = skill.runes.filter((r) => r.unlockLevel > level);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded border shadow-2xl"
        style={{ background: "oklch(0.09 0.010 30)", borderColor: `${accentColor}44` }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
          <div className="flex items-center gap-3">
            <SkillIcon skillId={skill.id} element={skill.element} size={36} />
            <div>
              <p className="font-cinzel font-bold text-sm" style={{ color: accentColor }}>{skill.name}</p>
              <p className="text-xs" style={{ color: "oklch(0.45 0.010 60)" }}>Select a rune</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.50 0.010 60)" }}>
            <X size={13} />
          </button>
        </div>
        <div className="p-4 space-y-2 max-h-80 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          <button onClick={() => { onSelect(null); onClose(); }}
            className="w-full flex items-center gap-3 p-3 rounded border text-left transition-all duration-150"
            style={{ background: !selectedRune ? `${accentColor}12` : "oklch(0.11 0.010 30)", borderColor: !selectedRune ? accentColor : "oklch(0.22 0.015 50)" }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: !selectedRune ? accentColor : "oklch(0.16 0.012 30)", border: `1px solid ${accentColor}44` }}>
              {!selectedRune && <Check size={10} color="oklch(0.08 0 0)" />}
            </div>
            <div>
              <p className="font-cinzel font-bold text-xs" style={{ color: "oklch(0.72 0.01 60)" }}>No Rune</p>
              <p className="text-xs" style={{ color: "oklch(0.45 0.010 60)" }}>Base skill, no modification</p>
            </div>
          </button>
          {available.map((rune) => {
            const isSelected = selectedRune?.name === rune.name;
            return (
              <button key={rune.name} onClick={() => { onSelect(rune); onClose(); }}
                className="w-full flex items-start gap-3 p-3 rounded border text-left transition-all duration-150"
                style={{ background: isSelected ? `${accentColor}12` : "oklch(0.11 0.010 30)", borderColor: isSelected ? accentColor : "oklch(0.22 0.015 50)" }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: isSelected ? accentColor : "oklch(0.16 0.012 30)", border: `1px solid ${accentColor}44` }}>
                  {isSelected && <Check size={10} color="oklch(0.08 0 0)" />}
                </div>
                <div>
                  <p className="font-cinzel font-bold text-xs mb-0.5" style={{ color: isSelected ? accentColor : "oklch(0.82 0.01 60)" }}>{rune.name}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "oklch(0.55 0.010 60)" }}>{rune.description}</p>
                </div>
              </button>
            );
          })}
          {locked.length > 0 && (
            <>
              <p className="text-xs font-cinzel tracking-widest pt-1" style={{ color: "oklch(0.32 0.010 60)", fontSize: "0.5rem" }}>LOCKED</p>
              {locked.map((rune) => (
                <div key={rune.name} className="flex items-start gap-3 p-3 rounded border opacity-35"
                  style={{ background: "oklch(0.09 0.008 30)", borderColor: "oklch(0.16 0.010 30)" }}>
                  <Lock size={11} color="oklch(0.35 0.010 60)" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-cinzel font-bold text-xs mb-0.5" style={{ color: "oklch(0.38 0.010 60)" }}>{rune.name} — Level {rune.unlockLevel}</p>
                    <p className="text-xs" style={{ color: "oklch(0.32 0.010 60)" }}>{rune.description}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SkillsLoadoutPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const classId = params.id || "";
  const cls = classMap[classId];
  const skillData = ALL_CLASS_SKILLS[classId];
  const presets = ALL_PRESETS[classId] || [];

  const urlLevel = parseInt(new URLSearchParams(window.location.search).get("level") || "70");
  const [level, setLevel] = useState(Math.min(71, Math.max(1, urlLevel)));
  const [loadout, setLoadout] = useState<Loadout>(emptyLoadout);
  const [activeSlot, setActiveSlot] = useState<SlotKey | null>(null);
  const [runePickerSkill, setRunePickerSkill] = useState<{ skill: ClassSkill; slot: SlotKey } | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"builder" | "presets">("presets");

  if (!cls || !skillData) return null;

  const ac = cls.color;
  const portrait = CLASS_PORTRAITS[cls.id];
  const categories = ["All", ...skillData.categories];
  const filteredSkills = filterCategory === "All" ? skillData.skills : skillData.skills.filter((s) => s.category === filterCategory);
  const filledSlots = Object.values(loadout).filter((s) => s.skill !== null).length;

  // Sort: meta skills first, then by unlock level
  const sortedSkills = [...filteredSkills].sort((a, b) => {
    const pa = SKILL_POWER_RATINGS[a.id] || 1;
    const pb = SKILL_POWER_RATINGS[b.id] || 1;
    if (a.unlockLevel <= level && b.unlockLevel > level) return -1;
    if (b.unlockLevel <= level && a.unlockLevel > level) return 1;
    return pb - pa;
  });

  const assignSkillToSlot = (skill: ClassSkill, slot: SlotKey) => {
    const availableRunes = getAvailableRunes(skill, level);
    setLoadout((prev) => ({ ...prev, [slot]: { skill, rune: availableRunes[0] || null } }));
    setActiveSlot(null);
  };

  const clearSlot = (slot: SlotKey) => setLoadout((prev) => ({ ...prev, [slot]: { skill: null, rune: null } }));

  const isSkillAssigned = (skill: ClassSkill) => Object.values(loadout).some((s) => s.skill?.id === skill.id);
  const getSkillSlot = (skill: ClassSkill): SlotKey | null => {
    const entry = Object.entries(loadout).find(([, v]) => v.skill?.id === skill.id);
    return entry ? (entry[0] as SlotKey) : null;
  };

  const loadPreset = (preset: SkillPreset) => {
    const newLoadout = emptyLoadout();
    for (const [slot, { skillId, runeIndex }] of Object.entries(preset.slots)) {
      const skill = skillData.skills.find((s) => s.id === skillId);
      if (skill) {
        const runes = getAvailableRunes(skill, level);
        newLoadout[slot as SlotKey] = { skill, rune: runes[runeIndex] || runes[0] || null };
      }
    }
    setLoadout(newLoadout);
    setActiveTab("builder");
  };

  const loadMaxPower = () => {
    const available = skillData.skills.filter((s) => s.unlockLevel <= level);
    const sorted = [...available].sort((a, b) => (SKILL_POWER_RATINGS[b.id] || 1) - (SKILL_POWER_RATINGS[a.id] || 1));
    const newLoadout = emptyLoadout();
    const used = new Set<string>();
    let slotIdx = 0;
    for (const skill of sorted) {
      if (slotIdx >= 6) break;
      if (used.has(skill.id)) continue;
      const slot = SLOT_KEYS[slotIdx];
      const runes = getAvailableRunes(skill, level);
      newLoadout[slot] = { skill, rune: runes[0] || null };
      used.add(skill.id);
      slotIdx++;
    }
    setLoadout(newLoadout);
    setActiveTab("builder");
  };

  // Synergy warnings
  const synergyWarnings: string[] = [];
  const assignedIds = Object.values(loadout).map((s) => s.skill?.id).filter(Boolean) as string[];
  for (const id of assignedIds) {
    const synergies = SKILL_SYNERGIES[id] || [];
    const missing = synergies.filter((s) => !assignedIds.includes(s));
    if (missing.length > 0 && synergies.length >= 2) {
      const skillName = skillData.skills.find((s) => s.id === id)?.name;
      const missingNames = missing.slice(0, 2).map((m) => skillData.skills.find((s) => s.id === m)?.name).filter(Boolean);
      if (skillName && missingNames.length > 0) {
        synergyWarnings.push(`${skillName} synergizes with ${missingNames.join(", ")}`);
      }
    }
  }

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(ellipse at 50% 0%, ${ac}06 0%, oklch(0.07 0.008 30) 50%)` }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b px-4 py-3 flex items-center justify-between"
        style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.07 0.008 30 / 0.97)", backdropFilter: "blur(12px)" }}>
        <button onClick={() => navigate(`/guide/${classId}`)}
          className="flex items-center gap-1.5 text-xs font-cinzel tracking-wide"
          style={{ color: "oklch(0.55 0.010 60)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = ac; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.55 0.010 60)"; }}>
          <ChevronLeft size={13} /> Guide
        </button>
        <span className="font-cinzel-decorative text-sm font-bold" style={{ color: "oklch(0.78 0.18 55)" }}>Skills Loadout</span>
        <div className="text-xs font-cinzel" style={{ color: "oklch(0.45 0.010 60)" }}>{filledSlots}/6 filled</div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Class + Level bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-5 p-4 rounded border"
          style={{ background: `${ac}0d`, borderColor: `${ac}30` }}>
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0" style={{ border: `2px solid ${ac}55` }}>
              <img src={portrait} alt={cls.name} className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="font-cinzel-decorative font-black text-lg" style={{ color: ac }}>{cls.name}</p>
              <p className="text-xs" style={{ color: "oklch(0.50 0.010 60)" }}>{cls.tagline}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-w-52">
            <div className="flex items-center justify-between">
              <span className="text-xs font-cinzel" style={{ color: "oklch(0.50 0.010 60)" }}>Level</span>
              <span className="font-cinzel-decorative font-black text-lg" style={{ color: ac }}>{level >= 71 ? "70+" : level}</span>
            </div>
            <input type="range" min={1} max={71} step={1} value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full cursor-pointer"
              style={{ WebkitAppearance: "none", appearance: "none", height: "6px", borderRadius: "9999px", outline: "none", background: `linear-gradient(to right, ${ac} 0%, ${ac} ${((level - 1) / 70) * 100}%, oklch(0.22 0.015 50) ${((level - 1) / 70) * 100}%, oklch(0.22 0.015 50) 100%)`, accentColor: ac }} />
            <div className="flex justify-between" style={{ color: "oklch(0.32 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.5rem" }}>
              <span>1</span><span>20</span><span>40</span><span>60</span><span>70+</span>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button onClick={loadMaxPower}
            className="flex items-center gap-2 px-4 py-2 rounded font-cinzel font-bold text-xs tracking-wide transition-all duration-200"
            style={{ background: `linear-gradient(135deg, ${ac}, oklch(0.72 0.18 55))`, color: "oklch(0.08 0 0)" }}>
            <Sparkles size={13} /> Max Power Auto-Fill
          </button>
          <button onClick={() => setLoadout(emptyLoadout())}
            className="flex items-center gap-2 px-4 py-2 rounded border font-cinzel text-xs transition-colors"
            style={{ borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.50 0.010 60)", background: "transparent" }}>
            <X size={11} /> Clear All
          </button>
          <button onClick={() => setActiveTab("presets")}
            className="flex items-center gap-2 px-4 py-2 rounded border font-cinzel text-xs transition-colors"
            style={{ borderColor: `${ac}44`, color: ac, background: `${ac}08` }}>
            <Trophy size={11} /> Meta Presets
          </button>
        </div>

        {/* Synergy warnings */}
        {synergyWarnings.length > 0 && (
          <div className="mb-4 p-3 rounded border" style={{ background: "#ff704308", borderColor: "#ff704344" }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={12} color="#ff7043" />
              <p className="text-xs font-cinzel font-bold" style={{ color: "#ff7043" }}>Synergy Suggestions</p>
            </div>
            {synergyWarnings.slice(0, 3).map((w, i) => (
              <p key={i} className="text-xs" style={{ color: "oklch(0.60 0.010 60)" }}>• {w}</p>
            ))}
          </div>
        )}

        {/* Active slot hint */}
        {activeSlot && (
          <div className="mb-4 p-3 rounded border flex items-center gap-3" style={{ background: `${ac}12`, borderColor: `${ac}55` }}>
            <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center font-bold"
              style={{ background: ac, color: "oklch(0.08 0 0)", fontFamily: "'Courier New', monospace", fontSize: "0.75rem" }}>
              {activeSlot}
            </div>
            <div className="flex-1">
              <p className="text-xs font-cinzel font-bold" style={{ color: ac }}>Assigning to {SLOT_LABELS[activeSlot]}</p>
              <p className="text-xs" style={{ color: "oklch(0.52 0.010 60)" }}>Click a skill below to assign it</p>
            </div>
            <button onClick={() => setActiveSlot(null)} className="text-xs font-cinzel px-2 py-1 rounded border"
              style={{ borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.50 0.010 60)" }}>Cancel</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Skill bar */}
          <div className="lg:col-span-1">
            <h2 className="font-cinzel font-bold text-sm mb-3" style={{ color: "oklch(0.88 0.01 60)" }}>Skill Bar</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {SLOT_KEYS.map((slot) => (
                <SlotDisplay key={slot} slotKey={slot} assignment={loadout[slot]}
                  isActive={activeSlot === slot}
                  onClick={() => setActiveSlot(activeSlot === slot ? null : slot)}
                  accentColor={ac} onClear={() => clearSlot(slot)} />
              ))}
            </div>

            {/* Rune selection */}
            {Object.entries(loadout).some(([, v]) => v.skill !== null) && (
              <div>
                <p className="text-xs font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.55rem" }}>RUNE SELECTION</p>
                <div className="space-y-1.5">
                  {SLOT_KEYS.filter((slot) => loadout[slot].skill !== null).map((slot) => {
                    const { skill, rune } = loadout[slot];
                    if (!skill) return null;
                    return (
                      <button key={slot} onClick={() => setRunePickerSkill({ skill, slot })}
                        className="w-full flex items-center gap-2 p-2 rounded border text-left transition-all duration-150"
                        style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                        <SkillIcon skillId={skill.id} element={skill.element} size={28} />
                        <span className="font-cinzel text-xs flex-1 min-w-0 truncate" style={{ color: "oklch(0.75 0.01 60)" }}>{skill.name}</span>
                        <span className="text-xs flex-shrink-0" style={{ color: rune ? ac : "oklch(0.32 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.58rem" }}>
                          {rune ? rune.name : "No rune"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filledSlots === 6 && (
              <div className="mt-4 p-3 rounded border" style={{ background: `${ac}08`, borderColor: `${ac}44` }}>
                <p className="font-cinzel font-bold text-xs mb-1" style={{ color: ac }}>✓ Loadout Complete</p>
                <p className="text-xs" style={{ color: "oklch(0.52 0.010 60)" }}>All 6 slots filled. Head back to your guide for rotation tips.</p>
              </div>
            )}
          </div>

          {/* Right: Presets + Skill Browser */}
          <div className="lg:col-span-2">
            {/* Tab bar */}
            <div className="flex border-b mb-4" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
              {[{ id: "presets", label: "Meta Presets" }, { id: "builder", label: "Skill Browser" }].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as "builder" | "presets")}
                  className="px-4 py-2.5 text-xs font-cinzel tracking-wide border-b-2 transition-all duration-200"
                  style={{ borderColor: activeTab === tab.id ? ac : "transparent", color: activeTab === tab.id ? ac : "oklch(0.50 0.010 60)", background: activeTab === tab.id ? `${ac}08` : "transparent" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "presets" && (
              <div className="space-y-3">
                {presets.map((preset) => (
                  <PresetCard key={preset.id} preset={preset} accentColor={ac} level={level}
                    onLoad={() => loadPreset(preset)} />
                ))}
                {presets.length === 0 && (
                  <div className="p-6 text-center rounded border" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
                    <p className="text-xs font-cinzel" style={{ color: "oklch(0.45 0.010 60)" }}>No presets available yet for this class.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "builder" && (
              <>
                {/* Category filter */}
                <div className="flex gap-1 flex-wrap mb-3">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setFilterCategory(cat)}
                      className="text-xs px-2 py-1 rounded-sm transition-colors font-cinzel"
                      style={{ background: filterCategory === cat ? `${ac}22` : "oklch(0.12 0.010 30)", color: filterCategory === cat ? ac : "oklch(0.48 0.010 60)", border: `1px solid ${filterCategory === cat ? `${ac}44` : "oklch(0.20 0.012 30)"}`, fontSize: "0.58rem" }}>
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="space-y-2 max-h-screen overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: `${ac}44 transparent` }}>
                  {sortedSkills.map((skill) => {
                    const assigned = isSkillAssigned(skill);
                    const skillSlot = getSkillSlot(skill);
                    return (
                      <SkillCard key={skill.id} skill={skill} level={level} isAssigned={assigned}
                        accentColor={ac} loadout={loadout}
                        onAssign={() => {
                          if (assigned) { if (skillSlot) clearSlot(skillSlot); }
                          else if (activeSlot) { assignSkillToSlot(skill, activeSlot); }
                          else { const empty = SLOT_KEYS.find((k) => !loadout[k].skill); if (empty) assignSkillToSlot(skill, empty); else setActiveSlot(SLOT_KEYS[0]); }
                        }} />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {runePickerSkill && (
        <RunePicker skill={runePickerSkill.skill} level={level}
          selectedRune={loadout[runePickerSkill.slot].rune} accentColor={ac}
          onSelect={(rune) => setLoadout((prev) => ({ ...prev, [runePickerSkill.slot]: { ...prev[runePickerSkill.slot], rune } }))}
          onClose={() => setRunePickerSkill(null)} />
      )}
    </div>
  );
}
