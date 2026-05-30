// Sanctuary Grimoire — Skills Loadout Builder
// Level-aware interactive skill builder: assign skills to 6 slots, pick runes
// Shows unlocked/locked skills based on player level
import { useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { classMap } from "@/data/classes";
import { ALL_CLASS_SKILLS, ClassSkill, SkillRune, getAvailableSkills, getLockedSkills, getAvailableRunes } from "@/data/skills";
import { CLASS_PORTRAITS } from "@/components/Icons";
import { ChevronLeft, Lock, Check, X, Zap, Info, ChevronDown, ChevronUp } from "lucide-react";

// ─── Slot keys and labels ─────────────────────────────────────────────────────
const SLOT_KEYS = ["LMB", "RMB", "1", "2", "3", "4"] as const;
type SlotKey = typeof SLOT_KEYS[number];

const SLOT_LABELS: Record<SlotKey, string> = {
  LMB: "Left Click", RMB: "Right Click",
  "1": "Skill 1", "2": "Skill 2", "3": "Skill 3", "4": "Skill 4",
};

const SLOT_ROLES: Record<SlotKey, string> = {
  LMB: "Primary / Generator",
  RMB: "Main Damage",
  "1": "Utility / Escape",
  "2": "Buff / Debuff",
  "3": "AoE / Crowd Control",
  "4": "Ultimate / Cooldown",
};

// ─── Element colors ───────────────────────────────────────────────────────────
const ELEMENT_COLORS: Record<string, string> = {
  Physical: "#a0a0a0", Fire: "#ff6b35", Lightning: "#7eb8f7",
  Cold: "#7ecef7", Holy: "#ffe082", Poison: "#81c784",
  Arcane: "#ce93d8",
};

// ─── Category colors ──────────────────────────────────────────────────────────
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

// ─── Loadout slot assignment ──────────────────────────────────────────────────
interface SlotAssignment {
  skill: ClassSkill | null;
  rune: SkillRune | null;
}

type Loadout = Record<SlotKey, SlotAssignment>;

function emptyLoadout(): Loadout {
  return Object.fromEntries(
    SLOT_KEYS.map((k) => [k, { skill: null, rune: null }])
  ) as Loadout;
}

// ─── Skill Card (in the picker list) ─────────────────────────────────────────
function SkillCard({
  skill, level, isAssigned, onAssign, accentColor,
}: {
  skill: ClassSkill;
  level: number;
  isAssigned: boolean;
  onAssign: () => void;
  accentColor: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLocked = skill.unlockLevel > level;
  const elemColor = ELEMENT_COLORS[skill.element] || "#888";
  const catColor = CATEGORY_COLORS[skill.category] || "#888";
  const availableRunes = getAvailableRunes(skill, level);

  return (
    <div
      className="rounded border transition-all duration-200"
      style={{
        background: isLocked ? "oklch(0.08 0.008 30)" : isAssigned ? `${accentColor}12` : "oklch(0.10 0.010 30)",
        borderColor: isLocked ? "oklch(0.16 0.010 30)" : isAssigned ? `${accentColor}55` : "oklch(0.22 0.015 50)",
        opacity: isLocked ? 0.5 : 1,
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 p-3">
        {/* Lock icon or assign button */}
        {isLocked ? (
          <div className="flex-shrink-0 w-7 h-7 rounded flex items-center justify-center"
            style={{ background: "oklch(0.14 0.012 30)", border: "1px solid oklch(0.20 0.012 30)" }}>
            <Lock size={11} color="oklch(0.40 0.010 60)" />
          </div>
        ) : (
          <button
            onClick={onAssign}
            className="flex-shrink-0 w-7 h-7 rounded flex items-center justify-center transition-all duration-150"
            style={{
              background: isAssigned ? accentColor : `${accentColor}18`,
              border: `1px solid ${accentColor}55`,
              color: isAssigned ? "oklch(0.08 0 0)" : accentColor,
            }}
            title={isAssigned ? "Assigned" : "Assign to slot"}
          >
            {isAssigned ? <Check size={11} /> : <Zap size={11} />}
          </button>
        )}

        {/* Skill name + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-cinzel font-bold text-xs"
              style={{ color: isLocked ? "oklch(0.40 0.010 60)" : "oklch(0.88 0.01 60)" }}>
              {skill.name}
            </span>
            {isLocked && (
              <span className="text-xs px-1.5 py-0.5 rounded-sm"
                style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.45 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
                Unlocks {skill.unlockLevel}
              </span>
            )}
          </div>
          <div className="flex gap-1 mt-0.5 flex-wrap">
            <span className="text-xs px-1.5 py-0.5 rounded-sm"
              style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}33`, fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
              {skill.category}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded-sm"
              style={{ background: `${elemColor}18`, color: elemColor, border: `1px solid ${elemColor}33`, fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
              {skill.element}
            </span>
            {availableRunes.length > 0 && !isLocked && (
              <span className="text-xs px-1.5 py-0.5 rounded-sm"
                style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.45 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
                {availableRunes.length} rune{availableRunes.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        {!isLocked && (
          <button onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
            style={{ color: "oklch(0.45 0.010 60)", background: "oklch(0.14 0.012 30)" }}>
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        )}
      </div>

      {/* Expanded: description + runes */}
      {expanded && !isLocked && (
        <div className="px-3 pb-3 border-t" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
          <p className="text-xs leading-relaxed mt-2 mb-2" style={{ color: "oklch(0.62 0.010 60)" }}>
            {skill.description}
          </p>
          {availableRunes.length > 0 && (
            <div>
              <p className="text-xs font-cinzel tracking-widest mb-1.5" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.55rem" }}>
                AVAILABLE RUNES
              </p>
              <div className="space-y-1">
                {availableRunes.map((rune) => (
                  <div key={rune.name} className="flex gap-2 text-xs p-1.5 rounded"
                    style={{ background: "oklch(0.12 0.010 30)" }}>
                    <span className="font-cinzel font-bold flex-shrink-0" style={{ color: accentColor, fontSize: "0.6rem" }}>
                      {rune.name}
                    </span>
                    <span style={{ color: "oklch(0.55 0.010 60)", fontSize: "0.65rem" }}>{rune.description}</span>
                  </div>
                ))}
                {skill.runes.filter((r) => r.unlockLevel > level).map((rune) => (
                  <div key={rune.name} className="flex gap-2 text-xs p-1.5 rounded opacity-40"
                    style={{ background: "oklch(0.10 0.008 30)" }}>
                    <Lock size={9} color="oklch(0.35 0.010 60)" className="flex-shrink-0 mt-0.5" />
                    <span className="font-cinzel font-bold flex-shrink-0" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.6rem" }}>
                      {rune.name}
                    </span>
                    <span style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.65rem" }}>Unlocks at level {rune.unlockLevel}</span>
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

// ─── Slot Display ─────────────────────────────────────────────────────────────
function SlotDisplay({
  slotKey, assignment, isActive, onClick, accentColor, onClear,
}: {
  slotKey: SlotKey;
  assignment: SlotAssignment;
  isActive: boolean;
  onClick: () => void;
  accentColor: string;
  onClear: () => void;
}) {
  const { skill, rune } = assignment;
  const elemColor = skill ? (ELEMENT_COLORS[skill.element] || "#888") : "#444";

  return (
    <div
      className="relative rounded border transition-all duration-200 cursor-pointer"
      onClick={onClick}
      style={{
        background: isActive ? `${accentColor}15` : skill ? "oklch(0.11 0.010 30)" : "oklch(0.09 0.008 30)",
        borderColor: isActive ? accentColor : skill ? `${elemColor}44` : "oklch(0.18 0.012 30)",
        boxShadow: isActive ? `0 0 12px ${accentColor}22` : "none",
      }}
    >
      {/* Key badge */}
      <div className="absolute -top-2 -left-1 z-10 flex items-center justify-center rounded font-bold"
        style={{
          background: skill ? elemColor : "oklch(0.16 0.015 30)",
          color: skill ? "oklch(0.08 0 0)" : "oklch(0.55 0.010 60)",
          border: `1px solid ${skill ? elemColor : "oklch(0.28 0.015 50)"}`,
          fontFamily: "'Courier New', monospace",
          fontSize: "0.6rem",
          minWidth: "1.6rem",
          height: "1.3rem",
          padding: "0 4px",
          boxShadow: skill ? `0 0 6px ${elemColor}55` : "none",
        }}>
        {slotKey}
      </div>

      <div className="p-3 pt-4">
        {skill ? (
          <>
            <div className="flex items-start justify-between gap-1 mb-1">
              <p className="font-cinzel font-bold text-xs leading-tight" style={{ color: "oklch(0.88 0.01 60)" }}>
                {skill.name}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center"
                style={{ background: "oklch(0.18 0.012 30)", color: "oklch(0.45 0.010 60)" }}>
                <X size={8} />
              </button>
            </div>
            {rune && (
              <p className="text-xs" style={{ color: accentColor, fontFamily: "'Cinzel', serif", fontSize: "0.58rem" }}>
                ◆ {rune.name}
              </p>
            )}
            {!rune && (
              <p className="text-xs" style={{ color: "oklch(0.38 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.58rem" }}>
                No rune selected
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: elemColor, fontSize: "0.55rem" }}>{skill.element}</p>
          </>
        ) : (
          <>
            <p className="text-xs font-cinzel" style={{ color: "oklch(0.35 0.010 60)" }}>{SLOT_LABELS[slotKey]}</p>
            <p className="text-xs mt-0.5" style={{ color: "oklch(0.28 0.010 60)", fontSize: "0.6rem" }}>{SLOT_ROLES[slotKey]}</p>
            <p className="text-xs mt-1" style={{ color: "oklch(0.28 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
              — Empty —
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Rune Picker Modal ────────────────────────────────────────────────────────
function RunePicker({
  skill, level, selectedRune, accentColor, onSelect, onClose,
}: {
  skill: ClassSkill;
  level: number;
  selectedRune: SkillRune | null;
  accentColor: string;
  onSelect: (rune: SkillRune | null) => void;
  onClose: () => void;
}) {
  const availableRunes = getAvailableRunes(skill, level);
  const lockedRunes = skill.runes.filter((r) => r.unlockLevel > level);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded border shadow-2xl"
        style={{ background: "oklch(0.09 0.010 30)", borderColor: `${accentColor}44` }}
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "oklch(0.18 0.012 30)" }}>
          <div>
            <p className="font-cinzel font-bold text-sm" style={{ color: accentColor }}>{skill.name}</p>
            <p className="text-xs" style={{ color: "oklch(0.48 0.010 60)" }}>Choose a rune</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.50 0.010 60)" }}>
            <X size={13} />
          </button>
        </div>

        {/* No rune option */}
        <div className="px-4 pt-3 pb-1">
          <button
            onClick={() => { onSelect(null); onClose(); }}
            className="w-full flex items-center gap-3 p-3 rounded border text-left transition-all duration-150 mb-2"
            style={{
              background: !selectedRune ? `${accentColor}12` : "oklch(0.11 0.010 30)",
              borderColor: !selectedRune ? accentColor : "oklch(0.22 0.015 50)",
            }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: !selectedRune ? accentColor : "oklch(0.16 0.012 30)", border: `1px solid ${accentColor}44` }}>
              {!selectedRune && <Check size={10} color="oklch(0.08 0 0)" />}
            </div>
            <div>
              <p className="font-cinzel font-bold text-xs" style={{ color: "oklch(0.75 0.01 60)" }}>No Rune</p>
              <p className="text-xs" style={{ color: "oklch(0.48 0.010 60)" }}>Use the base skill without modification</p>
            </div>
          </button>
        </div>

        {/* Available runes */}
        <div className="px-4 pb-4 space-y-2 max-h-72 overflow-y-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: `${accentColor}44 transparent` }}>
          {availableRunes.map((rune) => {
            const isSelected = selectedRune?.name === rune.name;
            return (
              <button
                key={rune.name}
                onClick={() => { onSelect(rune); onClose(); }}
                className="w-full flex items-start gap-3 p-3 rounded border text-left transition-all duration-150"
                style={{
                  background: isSelected ? `${accentColor}12` : "oklch(0.11 0.010 30)",
                  borderColor: isSelected ? accentColor : "oklch(0.22 0.015 50)",
                }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: isSelected ? accentColor : "oklch(0.16 0.012 30)", border: `1px solid ${accentColor}44` }}>
                  {isSelected && <Check size={10} color="oklch(0.08 0 0)" />}
                </div>
                <div>
                  <p className="font-cinzel font-bold text-xs mb-0.5" style={{ color: isSelected ? accentColor : "oklch(0.82 0.01 60)" }}>
                    {rune.name}
                    {rune.element && rune.element !== skill.element && (
                      <span className="ml-1.5 text-xs" style={{ color: ELEMENT_COLORS[rune.element] || "#888", fontWeight: "normal", fontSize: "0.6rem" }}>
                        ({rune.element})
                      </span>
                    )}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.010 60)" }}>{rune.description}</p>
                </div>
              </button>
            );
          })}

          {/* Locked runes */}
          {lockedRunes.length > 0 && (
            <>
              <p className="text-xs font-cinzel tracking-widest pt-1" style={{ color: "oklch(0.35 0.010 60)", fontSize: "0.55rem" }}>
                LOCKED RUNES
              </p>
              {lockedRunes.map((rune) => (
                <div key={rune.name} className="flex items-start gap-3 p-3 rounded border opacity-40"
                  style={{ background: "oklch(0.09 0.008 30)", borderColor: "oklch(0.16 0.010 30)" }}>
                  <Lock size={11} color="oklch(0.35 0.010 60)" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-cinzel font-bold text-xs mb-0.5" style={{ color: "oklch(0.40 0.010 60)" }}>
                      {rune.name} <span style={{ fontWeight: "normal", fontSize: "0.6rem" }}>— Level {rune.unlockLevel}</span>
                    </p>
                    <p className="text-xs" style={{ color: "oklch(0.35 0.010 60)" }}>{rune.description}</p>
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

// ─── Main Skills Loadout Page ─────────────────────────────────────────────────
export default function SkillsLoadoutPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const classId = params.id || "";
  const cls = classMap[classId];
  const skillData = ALL_CLASS_SKILLS[classId];

  // Get level from URL query param or default to 70
  const urlLevel = parseInt(new URLSearchParams(window.location.search).get("level") || "70");
  const [level, setLevel] = useState(Math.min(71, Math.max(1, urlLevel)));

  const [loadout, setLoadout] = useState<Loadout>(emptyLoadout);
  const [activeSlot, setActiveSlot] = useState<SlotKey | null>(null);
  const [runePickerSkill, setRunePickerSkill] = useState<{ skill: ClassSkill; slot: SlotKey } | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  if (!cls || !skillData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.07 0.008 30)" }}>
        <div className="text-center">
          <p className="font-cinzel text-xl mb-4" style={{ color: "oklch(0.78 0.18 55)" }}>Class not found</p>
          <button onClick={() => navigate("/")} className="text-sm font-cinzel" style={{ color: "oklch(0.55 0.010 60)" }}>← Home</button>
        </div>
      </div>
    );
  }

  const ac = cls.color;
  const portrait = CLASS_PORTRAITS[cls.id];
  const availableSkills = useMemo(() => skillData.skills.filter((s) => s.unlockLevel <= level), [level]);
  const lockedSkills = useMemo(() => skillData.skills.filter((s) => s.unlockLevel > level), [level]);
  const categories = ["All", ...skillData.categories];
  const filteredSkills = filterCategory === "All" ? skillData.skills : skillData.skills.filter((s) => s.category === filterCategory);

  const assignSkillToSlot = (skill: ClassSkill, slot: SlotKey) => {
    const availableRunes = getAvailableRunes(skill, level);
    setLoadout((prev) => ({
      ...prev,
      [slot]: { skill, rune: availableRunes.length > 0 ? availableRunes[0] : null },
    }));
    setActiveSlot(null);
  };

  const clearSlot = (slot: SlotKey) => {
    setLoadout((prev) => ({ ...prev, [slot]: { skill: null, rune: null } }));
  };

  const isSkillAssigned = (skill: ClassSkill) =>
    Object.values(loadout).some((s) => s.skill?.id === skill.id);

  const getSkillSlot = (skill: ClassSkill): SlotKey | null => {
    const entry = Object.entries(loadout).find(([, v]) => v.skill?.id === skill.id);
    return entry ? (entry[0] as SlotKey) : null;
  };

  const filledSlots = Object.values(loadout).filter((s) => s.skill !== null).length;

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
        <span className="font-cinzel-decorative text-sm font-bold" style={{ color: "oklch(0.78 0.18 55)" }}>
          Skills Loadout
        </span>
        <div className="text-xs font-cinzel" style={{ color: "oklch(0.45 0.010 60)" }}>
          {filledSlots}/6 slots filled
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Class + Level bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 rounded border"
          style={{ background: `${ac}0d`, borderColor: `${ac}30` }}>
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0"
              style={{ border: `2px solid ${ac}55` }}>
              <img src={portrait} alt={cls.name} className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="font-cinzel-decorative font-black text-lg" style={{ color: ac }}>{cls.name}</p>
              <p className="text-xs" style={{ color: "oklch(0.50 0.010 60)" }}>{cls.tagline}</p>
              <p className="text-xs mt-0.5" style={{ color: "oklch(0.42 0.010 60)" }}>
                {availableSkills.length} skills unlocked · {lockedSkills.length} locked
              </p>
            </div>
          </div>

          {/* Level selector */}
          <div className="flex flex-col gap-2 min-w-48">
            <div className="flex items-center justify-between">
              <span className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.50 0.010 60)" }}>
                Current Level
              </span>
              <span className="font-cinzel-decorative font-black text-lg" style={{ color: ac }}>
                {level >= 71 ? "70+" : level}
              </span>
            </div>
            <input type="range" min={1} max={71} step={1} value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full cursor-pointer"
              style={{
                WebkitAppearance: "none", appearance: "none",
                height: "6px", borderRadius: "9999px", outline: "none",
                background: `linear-gradient(to right, ${ac} 0%, ${ac} ${((level - 1) / 70) * 100}%, oklch(0.22 0.015 50) ${((level - 1) / 70) * 100}%, oklch(0.22 0.015 50) 100%)`,
                accentColor: ac,
              }} />
            <div className="flex justify-between text-xs" style={{ color: "oklch(0.35 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
              <span>1</span><span>20</span><span>40</span><span>60</span><span>70+</span>
            </div>
          </div>
        </div>

        {/* Active slot hint */}
        {activeSlot && (
          <div className="mb-4 p-3 rounded border flex items-center gap-3"
            style={{ background: `${ac}12`, borderColor: `${ac}55` }}>
            <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center font-bold"
              style={{ background: ac, color: "oklch(0.08 0 0)", fontFamily: "'Courier New', monospace", fontSize: "0.75rem" }}>
              {activeSlot}
            </div>
            <div className="flex-1">
              <p className="text-xs font-cinzel font-bold" style={{ color: ac }}>Assigning to {SLOT_LABELS[activeSlot]}</p>
              <p className="text-xs" style={{ color: "oklch(0.55 0.010 60)" }}>Click a skill below to assign it to this slot</p>
            </div>
            <button onClick={() => setActiveSlot(null)}
              className="flex-shrink-0 text-xs font-cinzel px-2 py-1 rounded border"
              style={{ borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.50 0.010 60)" }}>
              Cancel
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Skill Bar + Loadout */}
          <div className="lg:col-span-1">
            <h2 className="font-cinzel font-bold text-sm mb-3" style={{ color: "oklch(0.88 0.01 60)" }}>
              Skill Bar
            </h2>
            <p className="text-xs mb-4" style={{ color: "oklch(0.48 0.010 60)" }}>
              Click a slot to select it, then click a skill from the list to assign it.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {SLOT_KEYS.map((slot) => (
                <SlotDisplay
                  key={slot}
                  slotKey={slot}
                  assignment={loadout[slot]}
                  isActive={activeSlot === slot}
                  onClick={() => setActiveSlot(activeSlot === slot ? null : slot)}
                  accentColor={ac}
                  onClear={() => clearSlot(slot)}
                />
              ))}
            </div>

            {/* Rune picker buttons for assigned skills */}
            {Object.entries(loadout).some(([, v]) => v.skill !== null) && (
              <div>
                <p className="text-xs font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.6rem" }}>
                  RUNE SELECTION
                </p>
                <div className="space-y-1.5">
                  {SLOT_KEYS.filter((slot) => loadout[slot].skill !== null).map((slot) => {
                    const { skill, rune } = loadout[slot];
                    if (!skill) return null;
                    return (
                      <button key={slot}
                        onClick={() => setRunePickerSkill({ skill, slot })}
                        className="w-full flex items-center gap-2 p-2.5 rounded border text-left transition-all duration-150"
                        style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                        <span className="flex-shrink-0 font-bold text-xs"
                          style={{ background: "oklch(0.16 0.015 30)", color: ac, border: `1px solid ${ac}44`, fontFamily: "'Courier New', monospace", padding: "1px 5px", borderRadius: "3px", fontSize: "0.6rem" }}>
                          {slot}
                        </span>
                        <span className="font-cinzel text-xs flex-1 min-w-0 truncate" style={{ color: "oklch(0.78 0.01 60)" }}>
                          {skill.name}
                        </span>
                        <span className="text-xs flex-shrink-0" style={{ color: rune ? ac : "oklch(0.35 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
                          {rune ? rune.name : "No rune"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Loadout summary */}
            {filledSlots === 6 && (
              <div className="mt-4 p-3 rounded border"
                style={{ background: `${ac}08`, borderColor: `${ac}44` }}>
                <p className="font-cinzel font-bold text-xs mb-2" style={{ color: ac }}>✓ Loadout Complete</p>
                <p className="text-xs" style={{ color: "oklch(0.55 0.010 60)" }}>
                  All 6 slots filled. Head back to your guide to see the full rotation and tips for this build.
                </p>
              </div>
            )}
          </div>

          {/* Right: Skill Browser */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.88 0.01 60)" }}>
                Available Skills
              </h2>
              <div className="flex gap-1 flex-wrap">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setFilterCategory(cat)}
                    className="text-xs px-2 py-1 rounded-sm transition-colors font-cinzel"
                    style={{
                      background: filterCategory === cat ? `${ac}22` : "oklch(0.12 0.010 30)",
                      color: filterCategory === cat ? ac : "oklch(0.50 0.010 60)",
                      border: `1px solid ${filterCategory === cat ? `${ac}44` : "oklch(0.20 0.012 30)"}`,
                      fontSize: "0.6rem",
                    }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-screen overflow-y-auto pr-1"
              style={{ scrollbarWidth: "thin", scrollbarColor: `${ac}44 transparent` }}>
              {filteredSkills.map((skill) => {
                const assigned = isSkillAssigned(skill);
                const skillSlot = getSkillSlot(skill);
                return (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    level={level}
                    isAssigned={assigned}
                    accentColor={ac}
                    onAssign={() => {
                      if (assigned) {
                        // Clear from current slot
                        const slot = skillSlot;
                        if (slot) clearSlot(slot);
                      } else if (activeSlot) {
                        assignSkillToSlot(skill, activeSlot);
                      } else {
                        // Find first empty slot
                        const emptySlot = SLOT_KEYS.find((k) => !loadout[k].skill);
                        if (emptySlot) assignSkillToSlot(skill, emptySlot);
                        else setActiveSlot(SLOT_KEYS[0]);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Rune picker modal */}
      {runePickerSkill && (
        <RunePicker
          skill={runePickerSkill.skill}
          level={level}
          selectedRune={loadout[runePickerSkill.slot].rune}
          accentColor={ac}
          onSelect={(rune) => {
            setLoadout((prev) => ({
              ...prev,
              [runePickerSkill.slot]: { ...prev[runePickerSkill.slot], rune },
            }));
          }}
          onClose={() => setRunePickerSkill(null)}
        />
      )}
    </div>
  );
}
