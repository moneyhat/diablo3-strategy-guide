// Sanctuary Grimoire — Skills & Builds Page
// Standalone branded build planner: PvE | PvP | Speed | Group
// Pushes the absolute ceiling of what's possible in Diablo 3
import { useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { classMap } from "@/data/classes";
import { ALL_CLASS_SKILLS, ClassSkill, SkillRune, getAvailableRunes } from "@/data/skills";
import { ALL_PRESETS, SKILL_POWER_RATINGS, SKILL_SYNERGIES, SkillPreset } from "@/data/skillPresets";
import { CLASS_PORTRAITS } from "@/components/Icons";
import { getSkillIconStyle } from "@/data/skillIcons";
import {
  ChevronLeft, Check, X, Zap, Star, ChevronDown, ChevronUp,
  Sparkles, AlertTriangle, Trophy, Sword, Shield, Users, Lock
} from "lucide-react";

// ─── Playstyle config ─────────────────────────────────────────────────────────
const PLAYSTYLES = [
  { id: "All",           label: "All Builds",     icon: <Sparkles size={13} />, color: "#d4a843" },
  { id: "PvP",          label: "PvP",            icon: <Sword size={13} />,    color: "#ef5350" },
  { id: "GR Pushing",   label: "GR Pushing",     icon: <Trophy size={13} />,   color: "#ce93d8" },
  { id: "Speed Farming",label: "Speed Farming",  icon: <Zap size={13} />,      color: "#ffd54f" },
  { id: "Leveling",     label: "Leveling",       icon: <Shield size={13} />,   color: "#66bb6a" },
  { id: "Group",        label: "Group Play",     icon: <Users size={13} />,    color: "#42a5f5" },
];

const PLAYSTYLE_DESCRIPTIONS: Record<string, string> = {
  "PvP":           "Dominate other players in town duels. Every skill choice is optimized for burst, crowd control, and survivability against human opponents.",
  "GR Pushing":    "Push the highest possible Greater Rift tiers. Maximum single-target damage, cooldown management, and elite pack efficiency.",
  "Speed Farming": "Clear content as fast as possible. High mobility, AoE damage, and builds that never stop moving.",
  "Leveling":      "Reach level 70 efficiently. Skills that scale well through all difficulty levels and keep you moving forward.",
  "Group":         "Optimized for 4-player groups. Support, crowd control, and builds that amplify your team's damage.",
  "All":           "Every build for every situation. Browse the complete meta for your class.",
};

// ─── Element colors ───────────────────────────────────────────────────────────
const ELEMENT_COLORS: Record<string, string> = {
  Physical: "#a0a0a0", Fire: "#ff6b35", Lightning: "#7eb8f7",
  Cold: "#7ecef7", Holy: "#ffe082", Poison: "#81c784",
  Arcane: "#ce93d8", Bone: "#a5d6a7",
};

// ─── Tier config ──────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  S: { color: "#ffd54f", label: "S Tier — Meta Defining", desc: "The absolute ceiling. These builds push the highest GR tiers and dominate every content type." },
  A: { color: "#66bb6a", label: "A Tier — High Performance", desc: "Excellent builds that clear high-end content with strong efficiency." },
  B: { color: "#42a5f5", label: "B Tier — Solid Choice", desc: "Reliable builds that perform well across most content." },
};

// ─── Slot keys ────────────────────────────────────────────────────────────────
const SLOT_KEYS = ["LMB", "RMB", "1", "2", "3", "4"] as const;
type SlotKey = typeof SLOT_KEYS[number];
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

// ─── Branded Build Card ───────────────────────────────────────────────────────
function BuildCard({
  preset, accentColor, level, onLoad, isLoaded,
}: {
  preset: SkillPreset; accentColor: string; level: number;
  onLoad: () => void; isLoaded: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const tc = TIER_CONFIG[preset.tier];
  const isAvailable = level >= preset.minLevel;
  const playstyleColor = PLAYSTYLES.find((p) => p.id === preset.playstyle)?.color || accentColor;

  return (
    <div className="rounded border overflow-hidden transition-all duration-200"
      style={{
        background: isLoaded ? `${accentColor}10` : "oklch(0.10 0.010 30)",
        borderColor: isLoaded ? accentColor : `${tc.color}33`,
        boxShadow: isLoaded ? `0 0 20px ${accentColor}18` : "none",
        opacity: isAvailable ? 1 : 0.55,
      }}>

      {/* Tier stripe */}
      <div style={{ height: "3px", background: `linear-gradient(90deg, ${tc.color}, ${tc.color}44, transparent)` }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center font-black text-base"
            style={{ background: `${tc.color}18`, color: tc.color, border: `1px solid ${tc.color}44`, fontFamily: "'Cinzel', serif" }}>
            {preset.tier}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="font-cinzel-decorative font-black text-base leading-tight"
                style={{ color: isLoaded ? accentColor : "oklch(0.90 0.01 60)" }}>
                {preset.name}
              </h3>
              {isLoaded && (
                <span className="text-xs px-1.5 py-0.5 rounded-sm"
                  style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44`, fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
                  ACTIVE
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-sm flex items-center gap-1"
                style={{ background: `${playstyleColor}15`, color: playstyleColor, border: `1px solid ${playstyleColor}33`, fontFamily: "'Cinzel', serif", fontSize: "0.58rem" }}>
                {PLAYSTYLES.find((p) => p.id === preset.playstyle)?.icon}
                {preset.playstyle}
              </span>
              {!isAvailable && (
                <span className="text-xs px-1.5 py-0.5 rounded-sm flex items-center gap-1"
                  style={{ background: "#ff704308", color: "#ff7043", border: "1px solid #ff704333", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
                  <Lock size={8} /> Lv {preset.minLevel}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs leading-relaxed mb-4" style={{ color: "oklch(0.60 0.010 60)" }}>
          {preset.description}
        </p>

        {/* Skill bar preview */}
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {SLOT_KEYS.map((slot) => {
            const slotData = preset.slots[slot];
            const skillName = slotData.skillId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <div key={slot} className="flex flex-col items-center gap-0.5">
                <div className="w-11 h-11 rounded flex items-center justify-center text-xs font-mono font-bold transition-all duration-200"
                  style={{
                    background: isLoaded ? `${accentColor}22` : "oklch(0.14 0.012 30)",
                    border: `2px solid ${isLoaded ? accentColor : "oklch(0.22 0.015 50)"}`,
                    color: isLoaded ? accentColor : "oklch(0.55 0.010 60)",
                    boxShadow: isLoaded ? `0 0 8px ${accentColor}33` : "none",
                  }}>
                  {slot}
                </div>
                <span className="text-center font-cinzel"
                  style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.42rem", maxWidth: "44px", lineHeight: 1.3, wordBreak: "break-word" }}>
                  {skillName.length > 12 ? skillName.slice(0, 11) + "…" : skillName}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-3">
          {isAvailable && (
            <button onClick={onLoad}
              className="flex items-center gap-1.5 px-4 py-2 rounded font-cinzel font-bold text-xs tracking-wide transition-all duration-150 flex-1 justify-center"
              style={{
                background: isLoaded ? `${accentColor}22` : accentColor,
                color: isLoaded ? accentColor : "oklch(0.08 0 0)",
                border: isLoaded ? `1px solid ${accentColor}55` : "none",
              }}>
              {isLoaded ? <><Check size={11} /> Build Loaded</> : <><Sparkles size={11} /> Load This Build</>}
            </button>
          )}
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-3 py-2 rounded border text-xs font-cinzel transition-colors"
            style={{ borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.50 0.010 60)", background: "transparent" }}>
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            {expanded ? "Less" : "Details"}
          </button>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="border-t pt-3 space-y-3" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
            <div>
              <p className="text-xs font-cinzel tracking-widest mb-1.5" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>
                SYNERGIES
              </p>
              <div className="space-y-1">
                {preset.synergyNotes.map((note, i) => (
                  <div key={i} className="flex gap-2 text-xs">
                    <Zap size={10} color={accentColor} className="flex-shrink-0 mt-0.5" />
                    <span style={{ color: "oklch(0.60 0.010 60)" }}>{note}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-cinzel tracking-widest mb-1.5" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>
                POWER TIPS
              </p>
              <div className="space-y-1">
                {preset.powerTips.map((tip, i) => (
                  <div key={i} className="flex gap-2 text-xs">
                    <Trophy size={10} color="#ffd54f" className="flex-shrink-0 mt-0.5" />
                    <span style={{ color: "oklch(0.60 0.010 60)" }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skill Browser Card ───────────────────────────────────────────────────────
function SkillBrowserCard({
  skill, level, isAssigned, onAssign, accentColor, loadout, classId,
}: {
  skill: ClassSkill; level: number; isAssigned: boolean;
  onAssign: () => void; accentColor: string; loadout: Loadout; classId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLocked = skill.unlockLevel > level;
  const elemColor = ELEMENT_COLORS[skill.element] || "#888";
  const availableRunes = getAvailableRunes(skill, level);
  const synergies = SKILL_SYNERGIES[skill.id] || [];
  const assignedIds = Object.values(loadout).map((s) => s.skill?.id).filter(Boolean) as string[];
  const synergyMatches = synergies.filter((s) => assignedIds.includes(s)).length;

  return (
    <div className="rounded border transition-all duration-200"
      style={{
        background: isLocked ? "oklch(0.08 0.008 30)" : isAssigned ? `${accentColor}10` : "oklch(0.10 0.010 30)",
        borderColor: isLocked ? "oklch(0.16 0.010 30)" : isAssigned ? `${accentColor}44` : "oklch(0.22 0.015 50)",
        opacity: isLocked ? 0.45 : 1,
      }}>
      <div className="flex items-center gap-2.5 p-2.5">
        {/* Element color bar */}
        <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: elemColor, opacity: isLocked ? 0.3 : 0.8 }} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span className="font-cinzel font-bold text-xs" style={{ color: isLocked ? "oklch(0.40 0.010 60)" : "oklch(0.88 0.01 60)" }}>
              {skill.name}
            </span>
            {(SKILL_POWER_RATINGS[skill.id] || 1) >= 4 && !isLocked && (
              <span style={{ background: "#ffd54f18", color: "#ffd54f", border: "1px solid #ffd54f33", fontFamily: "'Cinzel', serif", fontSize: "0.48rem", padding: "1px 5px", borderRadius: "3px" }}>
                META
              </span>
            )}
            {isLocked && (
              <span style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.40 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.48rem", padding: "1px 5px", borderRadius: "3px" }}>
                Lv {skill.unlockLevel}
              </span>
            )}
            {synergyMatches > 0 && (
              <span style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}33`, fontFamily: "'Cinzel', serif", fontSize: "0.48rem", padding: "1px 5px", borderRadius: "3px" }}>
                ⚡ ×{synergyMatches}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <PowerStars skillId={skill.id} color={elemColor} />
            <span style={{ color: elemColor, fontFamily: "'Cinzel', serif", fontSize: "0.5rem" }}>{skill.element}</span>
            <span style={{ color: "oklch(0.40 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.5rem" }}>{skill.category}</span>
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0">
          {!isLocked && (
            <button onClick={onAssign}
              className="w-7 h-7 rounded flex items-center justify-center transition-all duration-150"
              style={{ background: isAssigned ? accentColor : `${accentColor}15`, border: `1px solid ${accentColor}44`, color: isAssigned ? "oklch(0.08 0 0)" : accentColor }}>
              {isAssigned ? <Check size={10} /> : <Zap size={10} />}
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
        <div className="px-3 pb-3 border-t" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
          <p className="text-xs leading-relaxed mt-2 mb-2" style={{ color: "oklch(0.58 0.010 60)" }}>{skill.description}</p>
          {availableRunes.length > 0 && (
            <div className="space-y-1">
              {availableRunes.map((rune) => (
                <div key={rune.name} className="flex gap-2 text-xs p-1.5 rounded" style={{ background: "oklch(0.12 0.010 30)" }}>
                  <span className="font-cinzel font-bold flex-shrink-0" style={{ color: accentColor, fontSize: "0.58rem" }}>{rune.name}</span>
                  <span style={{ color: "oklch(0.52 0.010 60)", fontSize: "0.62rem" }}>{rune.description}</span>
                </div>
              ))}
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
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded border shadow-2xl"
        style={{ background: "oklch(0.09 0.010 30)", borderColor: `${accentColor}44` }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
          <div>
            <p className="font-cinzel font-bold text-sm" style={{ color: accentColor }}>{skill.name}</p>
            <p className="text-xs" style={{ color: "oklch(0.45 0.010 60)" }}>Select a rune</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.50 0.010 60)" }}>
            <X size={13} />
          </button>
        </div>
        <div className="p-4 space-y-2 max-h-80 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          <button onClick={() => { onSelect(null); onClose(); }}
            className="w-full flex items-center gap-3 p-3 rounded border text-left"
            style={{ background: !selectedRune ? `${accentColor}12` : "oklch(0.11 0.010 30)", borderColor: !selectedRune ? accentColor : "oklch(0.22 0.015 50)" }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: !selectedRune ? accentColor : "oklch(0.16 0.012 30)", border: `1px solid ${accentColor}44` }}>
              {!selectedRune && <Check size={10} color="oklch(0.08 0 0)" />}
            </div>
            <div>
              <p className="font-cinzel font-bold text-xs" style={{ color: "oklch(0.72 0.01 60)" }}>No Rune</p>
              <p className="text-xs" style={{ color: "oklch(0.45 0.010 60)" }}>Base skill</p>
            </div>
          </button>
          {available.map((rune) => {
            const isSelected = selectedRune?.name === rune.name;
            return (
              <button key={rune.name} onClick={() => { onSelect(rune); onClose(); }}
                className="w-full flex items-start gap-3 p-3 rounded border text-left"
                style={{ background: isSelected ? `${accentColor}12` : "oklch(0.11 0.010 30)", borderColor: isSelected ? accentColor : "oklch(0.22 0.015 50)" }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: isSelected ? accentColor : "oklch(0.16 0.012 30)", border: `1px solid ${accentColor}44` }}>
                  {isSelected && <Check size={10} color="oklch(0.08 0 0)" />}
                </div>
                <div>
                  <p className="font-cinzel font-bold text-xs mb-0.5" style={{ color: isSelected ? accentColor : "oklch(0.82 0.01 60)" }}>{rune.name}</p>
                  <p className="text-xs" style={{ color: "oklch(0.55 0.010 60)" }}>{rune.description}</p>
                </div>
              </button>
            );
          })}
          {locked.length > 0 && locked.map((rune) => (
            <div key={rune.name} className="flex items-start gap-3 p-3 rounded border opacity-35"
              style={{ background: "oklch(0.09 0.008 30)", borderColor: "oklch(0.16 0.010 30)" }}>
              <Lock size={11} color="oklch(0.35 0.010 60)" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-cinzel font-bold text-xs mb-0.5" style={{ color: "oklch(0.38 0.010 60)" }}>{rune.name} — Level {rune.unlockLevel}</p>
                <p className="text-xs" style={{ color: "oklch(0.32 0.010 60)" }}>{rune.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Skills Page ─────────────────────────────────────────────────────────
export default function SkillsLoadoutPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const classId = params.id || "";
  const cls = classMap[classId];
  const skillData = ALL_CLASS_SKILLS[classId];
  const allPresets = ALL_PRESETS[classId] || [];

  const urlLevel = parseInt(new URLSearchParams(window.location.search).get("level") || "1");
  const [level, setLevel] = useState(Math.min(71, Math.max(1, urlLevel)));
  const [activePlaystyle, setActivePlaystyle] = useState("All");
  const [activeTab, setActiveTab] = useState<"builds" | "builder">("builds");
  const [loadout, setLoadout] = useState<Loadout>(emptyLoadout);
  const [loadedPresetId, setLoadedPresetId] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<SlotKey | null>(null);
  const [runePickerSkill, setRunePickerSkill] = useState<{ skill: ClassSkill; slot: SlotKey } | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");

  if (!cls || !skillData) return null;

  const ac = cls.color;
  const portrait = CLASS_PORTRAITS[cls.id];

  const filteredPresets = activePlaystyle === "All"
    ? allPresets
    : allPresets.filter((p) => p.playstyle === activePlaystyle);

  const pvpPresets = allPresets.filter((p) => p.playstyle === "PvP");
  const pvePresets = allPresets.filter((p) => p.playstyle !== "PvP");

  const filledSlots = Object.values(loadout).filter((s) => s.skill !== null).length;
  const assignedIds = Object.values(loadout).map((s) => s.skill?.id).filter(Boolean) as string[];

  const synergyWarnings: string[] = [];
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

  // Smart preset loader: if a skill is locked at current level, auto-swap with best available alternative
  const loadPreset = (preset: SkillPreset) => {
    const newLoadout = emptyLoadout();
    const usedSkillIds = new Set<string>();

    for (const [slot, { skillId, runeIndex }] of Object.entries(preset.slots)) {
      const skill = skillData.skills.find((s) => s.id === skillId);

      if (skill && skill.unlockLevel <= level && !usedSkillIds.has(skill.id)) {
        // Skill is available — use it
        const runes = getAvailableRunes(skill, level);
        newLoadout[slot as SlotKey] = { skill, rune: runes[runeIndex] || runes[0] || null };
        usedSkillIds.add(skill.id);
      } else {
        // Skill is locked — find the best available alternative in the same category
        const lockedSkill = skillData.skills.find((s) => s.id === skillId);
        const category = lockedSkill?.category || "";
        const available = skillData.skills
          .filter((s) => s.unlockLevel <= level && !usedSkillIds.has(s.id))
          .sort((a, b) => {
            // Prefer same category, then highest power rating
            const catA = a.category === category ? 0 : 1;
            const catB = b.category === category ? 0 : 1;
            if (catA !== catB) return catA - catB;
            return (SKILL_POWER_RATINGS[b.id] || 1) - (SKILL_POWER_RATINGS[a.id] || 1);
          });
        const best = available[0];
        if (best) {
          const runes = getAvailableRunes(best, level);
          newLoadout[slot as SlotKey] = { skill: best, rune: runes[0] || null };
          usedSkillIds.add(best.id);
        }
      }
    }
    setLoadout(newLoadout);
    setLoadedPresetId(preset.id);
    setActiveTab("builder");
  };

  const clearSlot = (slot: SlotKey) => setLoadout((prev) => ({ ...prev, [slot]: { skill: null, rune: null } }));
  const isSkillAssigned = (skill: ClassSkill) => Object.values(loadout).some((s) => s.skill?.id === skill.id);
  const getSkillSlot = (skill: ClassSkill): SlotKey | null => {
    const entry = Object.entries(loadout).find(([, v]) => v.skill?.id === skill.id);
    return entry ? (entry[0] as SlotKey) : null;
  };

  const assignSkillToSlot = (skill: ClassSkill, slot: SlotKey) => {
    const runes = getAvailableRunes(skill, level);
    setLoadout((prev) => ({ ...prev, [slot]: { skill, rune: runes[0] || null } }));
    setActiveSlot(null);
    setLoadedPresetId(null);
  };

  const loadMaxPower = () => {
    const available = skillData.skills.filter((s) => s.unlockLevel <= level);
    const sorted = [...available].sort((a, b) => (SKILL_POWER_RATINGS[b.id] || 1) - (SKILL_POWER_RATINGS[a.id] || 1));
    const newLoadout = emptyLoadout();
    const used = new Set<string>();
    let idx = 0;
    for (const skill of sorted) {
      if (idx >= 6 || used.has(skill.id)) continue;
      const runes = getAvailableRunes(skill, level);
      newLoadout[SLOT_KEYS[idx]] = { skill, rune: runes[0] || null };
      used.add(skill.id);
      idx++;
    }
    setLoadout(newLoadout);
    setLoadedPresetId(null);
    setActiveTab("builder");
  };

  const categories = ["All", ...skillData.categories];
  const [showLocked, setShowLocked] = useState(false);

  const unlockedCount = skillData.skills.filter((s) => s.unlockLevel <= level).length;
  const lockedCount = skillData.skills.length - unlockedCount;

  const filteredSkills = useMemo(() => {
    const base = filterCategory === "All" ? skillData.skills : skillData.skills.filter((s) => s.category === filterCategory);
    // By default, only show unlocked skills. Show locked only if toggled.
    const visible = showLocked ? base : base.filter((s) => s.unlockLevel <= level);
    return [...visible].sort((a, b) => {
      if (a.unlockLevel <= level && b.unlockLevel > level) return -1;
      if (b.unlockLevel <= level && a.unlockLevel > level) return 1;
      return (SKILL_POWER_RATINGS[b.id] || 1) - (SKILL_POWER_RATINGS[a.id] || 1);
    });
  }, [filterCategory, level, skillData.skills, showLocked]);

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(ellipse at 50% 0%, ${ac}07 0%, oklch(0.06 0.008 30) 55%)` }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b px-4 py-3 flex items-center justify-between"
        style={{ borderColor: "oklch(0.20 0.015 50)", background: "oklch(0.06 0.008 30 / 0.97)", backdropFilter: "blur(12px)" }}>
        <button onClick={() => navigate(`/guide/${classId}`)}
          className="flex items-center gap-1.5 text-xs font-cinzel tracking-wide"
          style={{ color: "oklch(0.50 0.010 60)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = ac; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.50 0.010 60)"; }}>
          <ChevronLeft size={13} /> Guide
        </button>
        <div className="flex items-center gap-2">
          <Sword size={14} color={ac} />
          <span className="font-cinzel-decorative text-sm font-bold" style={{ color: "oklch(0.78 0.18 55)" }}>
            Skills & Builds
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="font-cinzel-decorative font-black text-sm" style={{ color: ac }}>{unlockedCount}</p>
            <p className="font-cinzel" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.48rem" }}>SKILLS</p>
          </div>
          <div className="text-center">
            <p className="font-cinzel-decorative font-black text-sm" style={{ color: "oklch(0.60 0.010 60)" }}>{filledSlots}/6</p>
            <p className="font-cinzel" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.48rem" }}>SLOTS</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-5">

        {/* ── Class hero bar ── */}
        <div className="flex flex-col md:flex-row gap-4 mb-5 p-4 rounded border"
          style={{ background: `${ac}0a`, borderColor: `${ac}2a` }}>
          <div className="flex items-center gap-4 flex-1">
            <div className="w-14 h-20 rounded overflow-hidden flex-shrink-0"
              style={{ border: `2px solid ${ac}55`, boxShadow: `0 0 16px ${ac}33` }}>
              <img src={portrait} alt={cls.name} className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="text-xs font-cinzel tracking-widest" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.55rem" }}>
                PLAYING AS
              </p>
              <p className="font-cinzel-decorative font-black text-2xl" style={{ color: ac }}>
                {cls.name}
              </p>
              <p className="text-xs" style={{ color: "oklch(0.48 0.010 60)" }}>{cls.tagline}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-1.5 py-0.5 rounded-sm"
                  style={{ background: `${ac}15`, color: ac, border: `1px solid ${ac}30`, fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
                  {cls.primaryStat}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-sm"
                  style={{ background: "oklch(0.12 0.010 30)", color: "oklch(0.50 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
                  {cls.resource.name}
                </span>
              </div>
            </div>
          </div>

          {/* Level slider — prominent, always visible */}
          <div className="flex flex-col gap-2 min-w-64 p-3 rounded border" style={{ background: `${ac}08`, borderColor: `${ac}33` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-cinzel tracking-widest" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>YOUR LEVEL</p>
                <p className="text-xs font-cinzel mt-0.5" style={{ color: "oklch(0.48 0.010 60)", fontSize: "0.58rem" }}>Adjusts available skills in real time</p>
              </div>
              <div className="text-right">
                <span className="font-cinzel-decorative font-black text-3xl" style={{ color: ac }}>
                  {level >= 71 ? "70+" : level}
                </span>
                <p className="text-xs font-cinzel" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>
                  {level < 20 ? "Early Game" : level < 40 ? "Mid Game" : level < 60 ? "Late Game" : level < 70 ? "Pre-Endgame" : "Endgame"}
                </p>
              </div>
            </div>
            <input type="range" min={1} max={71} step={1} value={level}
              onChange={(e) => {
                const newLevel = Number(e.target.value);
                setLevel(newLevel);
                // Auto-clear slots with skills that are now locked
                setLoadout((prev) => {
                  const updated = { ...prev };
                  for (const slot of SLOT_KEYS) {
                    if (updated[slot].skill && updated[slot].skill!.unlockLevel > newLevel) {
                      updated[slot] = { skill: null, rune: null };
                    }
                  }
                  return updated;
                });
              }}
              className="w-full cursor-pointer"
              style={{ WebkitAppearance: "none", appearance: "none", height: "8px", borderRadius: "9999px", outline: "none", background: `linear-gradient(to right, ${ac} 0%, ${ac} ${((level - 1) / 70) * 100}%, oklch(0.22 0.015 50) ${((level - 1) / 70) * 100}%, oklch(0.22 0.015 50) 100%)`, accentColor: ac }} />
            <div className="flex justify-between" style={{ color: "oklch(0.30 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.5rem" }}>
              <span>1</span><span>20</span><span>40</span><span>60</span><span>70+</span>
            </div>
            {/* Quick level presets */}
            <div className="flex gap-1 flex-wrap">
              {[{l:"1",v:1},{l:"20",v:20},{l:"40",v:40},{l:"60",v:60},{l:"70",v:70},{l:"70+",v:71}].map((p) => (
                <button key={p.l} onClick={() => setLevel(p.v)}
                  className="text-xs px-2 py-0.5 rounded font-cinzel transition-all"
                  style={{ background: level === p.v ? ac : "oklch(0.14 0.012 30)", color: level === p.v ? "oklch(0.08 0 0)" : "oklch(0.50 0.010 60)", border: `1px solid ${level === p.v ? ac : "oklch(0.22 0.015 50)"}`, fontSize: "0.55rem" }}>
                  {p.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main tab bar ── */}
        <div className="flex border-b mb-5" style={{ borderColor: "oklch(0.20 0.015 50)" }}>
          {[
            { id: "builds", label: "Meta Builds", icon: <Trophy size={12} /> },
            { id: "builder", label: "Skill Builder", icon: <Zap size={12} /> },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as "builds" | "builder")}
              className="flex items-center gap-2 px-5 py-3 text-xs font-cinzel tracking-wide border-b-2 transition-all duration-200"
              style={{
                borderColor: activeTab === tab.id ? ac : "transparent",
                color: activeTab === tab.id ? ac : "oklch(0.48 0.010 60)",
                background: activeTab === tab.id ? `${ac}08` : "transparent",
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── BUILDS TAB ── */}
        {activeTab === "builds" && (
          <div>
            {/* Playstyle filter */}
            <div className="flex flex-wrap gap-2 mb-5">
              {PLAYSTYLES.map((ps) => {
                const isActive = activePlaystyle === ps.id;
                const count = ps.id === "All" ? allPresets.length : allPresets.filter((p) => p.playstyle === ps.id).length;
                if (count === 0 && ps.id !== "All") return null;
                return (
                  <button key={ps.id} onClick={() => setActivePlaystyle(ps.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded border text-xs font-cinzel tracking-wide transition-all duration-200"
                    style={{
                      background: isActive ? `${ps.color}18` : "oklch(0.10 0.010 30)",
                      borderColor: isActive ? `${ps.color}66` : "oklch(0.22 0.015 50)",
                      color: isActive ? ps.color : "oklch(0.50 0.010 60)",
                      boxShadow: isActive ? `0 0 10px ${ps.color}18` : "none",
                    }}>
                    {ps.icon} {ps.label}
                    <span className="ml-1 text-xs rounded-full px-1.5 py-0.5"
                      style={{ background: isActive ? `${ps.color}22` : "oklch(0.14 0.012 30)", color: isActive ? ps.color : "oklch(0.40 0.010 60)", fontSize: "0.55rem" }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Playstyle description */}
            {activePlaystyle !== "All" && (
              <div className="mb-5 p-3 rounded border"
                style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.20 0.015 50)" }}>
                <p className="text-xs" style={{ color: "oklch(0.58 0.010 60)", fontFamily: "'Cinzel', serif" }}>
                  {PLAYSTYLE_DESCRIPTIONS[activePlaystyle]}
                </p>
              </div>
            )}

            {/* Build grid */}
            {filteredPresets.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredPresets.map((preset) => (
                  <BuildCard
                    key={preset.id}
                    preset={preset}
                    accentColor={ac}
                    level={level}
                    isLoaded={loadedPresetId === preset.id}
                    onLoad={() => loadPreset(preset)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded border" style={{ borderColor: "oklch(0.20 0.015 50)" }}>
                <p className="font-cinzel text-sm mb-1" style={{ color: "oklch(0.50 0.010 60)" }}>
                  No {activePlaystyle} builds yet for {cls.name}
                </p>
                <p className="text-xs" style={{ color: "oklch(0.35 0.010 60)" }}>
                  Try a different playstyle or build your own in the Skill Builder
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── BUILDER TAB ── */}
        {activeTab === "builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Left: Skill bar */}
            <div className="lg:col-span-1">
              <div className="flex gap-2 mb-4 flex-wrap">
                <button onClick={loadMaxPower}
                  className="flex items-center gap-1.5 px-3 py-2 rounded font-cinzel font-bold text-xs tracking-wide flex-1 justify-center"
                  style={{ background: `linear-gradient(135deg, ${ac}, oklch(0.72 0.18 55))`, color: "oklch(0.08 0 0)" }}>
                  <Sparkles size={11} /> Max Power
                </button>
                <button onClick={() => { setLoadout(emptyLoadout()); setLoadedPresetId(null); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded border font-cinzel text-xs"
                  style={{ borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.48 0.010 60)", background: "transparent" }}>
                  <X size={10} /> Clear
                </button>
              </div>

              {/* Synergy warnings */}
              {synergyWarnings.length > 0 && (
                <div className="mb-3 p-3 rounded border" style={{ background: "#ff704308", borderColor: "#ff704333" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle size={11} color="#ff7043" />
                    <p className="text-xs font-cinzel font-bold" style={{ color: "#ff7043" }}>Synergy Suggestions</p>
                  </div>
                  {synergyWarnings.slice(0, 2).map((w, i) => (
                    <p key={i} className="text-xs" style={{ color: "oklch(0.58 0.010 60)" }}>• {w}</p>
                  ))}
                </div>
              )}

              {/* Active slot hint */}
              {activeSlot && (
                <div className="mb-3 p-3 rounded border flex items-center gap-2" style={{ background: `${ac}12`, borderColor: `${ac}44` }}>
                  <div className="w-7 h-7 rounded flex items-center justify-center font-bold flex-shrink-0"
                    style={{ background: ac, color: "oklch(0.08 0 0)", fontFamily: "'Courier New', monospace", fontSize: "0.7rem" }}>
                    {activeSlot}
                  </div>
                  <p className="text-xs font-cinzel flex-1" style={{ color: ac }}>Click a skill to assign</p>
                  <button onClick={() => setActiveSlot(null)} className="text-xs" style={{ color: "oklch(0.45 0.010 60)" }}>×</button>
                </div>
              )}

              {/* ── D3-Style Action Bar ── */}
              <p className="text-xs font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>ACTION BAR — Click a slot to assign</p>
              <div className="flex gap-2 mb-4 flex-wrap">
                {SLOT_KEYS.map((slot) => {
                  const { skill, rune } = loadout[slot];
                  const isActive = activeSlot === slot;
                  const elemColor = skill ? (ELEMENT_COLORS[skill.element] || "#888") : "#444";
                  const SLOT_LABELS: Record<string, string> = { LMB: "Left Click", RMB: "Right Click", "1": "Key 1", "2": "Key 2", "3": "Key 3", "4": "Key 4" };
                  return (
                    <div key={slot}
                      onClick={() => setActiveSlot(isActive ? null : slot)}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                      style={{ minWidth: "72px" }}>
                      {/* Large icon tile — the main visual */}
                      <div className="relative rounded transition-all duration-200"
                        style={{
                          width: "72px", height: "72px",
                          border: `2px solid ${isActive ? ac : skill ? `${elemColor}88` : "oklch(0.22 0.015 50)"}`,
                          boxShadow: isActive ? `0 0 16px ${ac}66, inset 0 0 8px ${ac}22` : skill ? `0 0 8px ${elemColor}33` : "none",
                          background: isActive ? `${ac}15` : "oklch(0.09 0.008 30)",
                          overflow: "hidden",
                        }}>
                        {skill ? (
                          <>
                            {/* Skill icon fills the entire tile */}
                            <div style={{
                              ...getSkillIconStyle(classId, skill.id, 72),
                              position: "absolute", inset: 0, width: "72px", height: "72px",
                              filter: isActive ? "brightness(1.1)" : "brightness(0.9)",
                            }} />
                            {/* Clear button — top right on hover */}
                            <button
                              onClick={(e) => { e.stopPropagation(); clearSlot(slot); }}
                              className="absolute top-0.5 right-0.5 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ background: "rgba(5,3,8,0.85)", color: "#ef5350", zIndex: 10 }}>
                              <X size={10} />
                            </button>
                            {/* Element color bar at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: elemColor, opacity: 0.7 }} />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span style={{ color: isActive ? ac : "oklch(0.28 0.010 60)", fontSize: "1.5rem", fontWeight: "bold" }}>+</span>
                          </div>
                        )}
                      </div>
                      {/* Keybind label */}
                      <div className="px-2 py-0.5 rounded-sm text-center"
                        style={{ background: isActive ? ac : skill ? `${elemColor}22` : "oklch(0.12 0.010 30)", border: `1px solid ${isActive ? ac : skill ? `${elemColor}44` : "oklch(0.20 0.015 50)"}` }}>
                        <p className="font-mono font-bold" style={{ color: isActive ? "oklch(0.08 0 0)" : skill ? elemColor : "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>{slot}</p>
                      </div>
                      {/* Skill name */}
                      <p className="text-center font-cinzel font-bold leading-tight" style={{ color: skill ? "oklch(0.85 0.01 60)" : "oklch(0.30 0.010 60)", fontSize: "0.52rem", maxWidth: "72px" }}>
                        {skill ? (skill.name.length > 12 ? skill.name.slice(0, 11) + "…" : skill.name) : SLOT_LABELS[slot]}
                      </p>
                      {/* Rune */}
                      {rune && (
                        <p className="text-center" style={{ color: ac, fontFamily: "'Cinzel', serif", fontSize: "0.45rem", maxWidth: "72px" }}>
                          {rune.name.length > 10 ? rune.name.slice(0, 9) + "…" : rune.name}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Rune selection */}
              {Object.entries(loadout).some(([, v]) => v.skill !== null) && (
                <div>
                  <p className="text-xs font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>RUNE SELECTION</p>
                  <div className="space-y-1.5">
                    {SLOT_KEYS.filter((slot) => loadout[slot].skill !== null).map((slot) => {
                      const { skill, rune } = loadout[slot];
                      if (!skill) return null;
                      return (
                        <button key={slot} onClick={() => setRunePickerSkill({ skill, slot })}
                          className="w-full flex items-center gap-2 p-2 rounded border text-left"
                          style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                          <span className="font-bold text-xs flex-shrink-0"
                            style={{ background: "oklch(0.16 0.015 30)", color: ac, border: `1px solid ${ac}44`, fontFamily: "'Courier New', monospace", padding: "1px 5px", borderRadius: "3px", fontSize: "0.58rem" }}>
                            {slot}
                          </span>
                          <span className="font-cinzel text-xs flex-1 min-w-0 truncate" style={{ color: "oklch(0.72 0.01 60)" }}>{skill.name}</span>
                          <span className="text-xs flex-shrink-0" style={{ color: rune ? ac : "oklch(0.32 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
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
                  <p className="font-cinzel font-bold text-xs mb-1" style={{ color: ac }}>✓ Build Complete</p>
                  <p className="text-xs" style={{ color: "oklch(0.50 0.010 60)" }}>All 6 slots filled. Head back to your guide for the full rotation.</p>
                </div>
              )}
            </div>

            {/* Right: Skill browser */}
            <div className="lg:col-span-2">
              {/* Browser header with live count + locked toggle */}
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex gap-1 flex-wrap">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setFilterCategory(cat)}
                      className="text-xs px-2 py-1 rounded-sm font-cinzel transition-colors"
                      style={{ background: filterCategory === cat ? `${ac}20` : "oklch(0.12 0.010 30)", color: filterCategory === cat ? ac : "oklch(0.46 0.010 60)", border: `1px solid ${filterCategory === cat ? `${ac}44` : "oklch(0.20 0.012 30)"}`, fontSize: "0.58rem" }}>
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-cinzel text-xs" style={{ color: ac, fontSize: "0.6rem" }}>
                    {unlockedCount} unlocked at Lv {level >= 71 ? "70+" : level}
                  </span>
                  <button
                    onClick={() => setShowLocked(!showLocked)}
                    className="flex items-center gap-1 px-2 py-1 rounded border font-cinzel text-xs transition-all"
                    style={{ background: showLocked ? "oklch(0.16 0.012 30)" : "oklch(0.10 0.010 30)", borderColor: showLocked ? "oklch(0.35 0.010 60)" : "oklch(0.20 0.015 50)", color: showLocked ? "oklch(0.65 0.010 60)" : "oklch(0.40 0.010 60)", fontSize: "0.55rem" }}>
                    <Lock size={9} /> {showLocked ? "Hide Locked" : `+${lockedCount} locked`}
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-screen overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: `${ac}44 transparent` }}>
                {filteredSkills.length === 0 && (
                  <div className="text-center py-10 rounded border" style={{ borderColor: "oklch(0.20 0.015 50)", background: "oklch(0.09 0.008 30)" }}>
                    <Lock size={24} color="oklch(0.35 0.010 60)" className="mx-auto mb-3" />
                    <p className="font-cinzel font-bold text-sm mb-1" style={{ color: "oklch(0.55 0.010 60)" }}>No skills unlocked yet</p>
                    <p className="text-xs" style={{ color: "oklch(0.38 0.010 60)" }}>Move the level slider up to unlock skills</p>
                  </div>
                )}
                {filteredSkills.map((skill) => {
                  const assigned = isSkillAssigned(skill);
                  const skillSlot = getSkillSlot(skill);
                  return (
                    <SkillBrowserCard
                      key={skill.id}
                      skill={skill}
                      level={level}
                      isAssigned={assigned}
                      accentColor={ac}
                      loadout={loadout}
                      classId={classId}
                      onAssign={() => {
                        if (assigned) { if (skillSlot) clearSlot(skillSlot); }
                        else if (activeSlot) { assignSkillToSlot(skill, activeSlot); }
                        else { const empty = SLOT_KEYS.find((k) => !loadout[k].skill); if (empty) assignSkillToSlot(skill, empty); else setActiveSlot(SLOT_KEYS[0]); }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {runePickerSkill && (
        <RunePicker
          skill={runePickerSkill.skill}
          level={level}
          selectedRune={loadout[runePickerSkill.slot].rune}
          accentColor={ac}
          onSelect={(rune) => setLoadout((prev) => ({ ...prev, [runePickerSkill.slot]: { ...prev[runePickerSkill.slot], rune } }))}
          onClose={() => setRunePickerSkill(null)}
        />
      )}
    </div>
  );
}
