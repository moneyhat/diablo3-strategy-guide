// Sanctuary Grimoire — Skills Page: TalentCalc-style progressive skill planner
// Level slider is the primary control. Skills unlock row by row as you level up.
// Active recommendations highlight the best next skill for your current level.
import { useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { classMap } from "@/data/classes";
import { ALL_CLASS_SKILLS, ClassSkill, getAvailableRunes } from "@/data/skills";
import { ALL_PRESETS, SKILL_POWER_RATINGS, SkillPreset } from "@/data/skillPresets";
import { CLASS_PORTRAITS } from "@/components/Icons";
import { getSkillIconStyle } from "@/data/skillIcons";
import {
  ChevronLeft, X, Zap, Star, Trophy, Sword, Shield, Users, Lock, Check, Sparkles, ChevronDown, ChevronUp
} from "lucide-react";

// ─── Slot keys ────────────────────────────────────────────────────────────────
const SLOT_KEYS = ["LMB", "RMB", "1", "2", "3", "4"] as const;
type SlotKey = typeof SLOT_KEYS[number];
interface SlotState { skill: ClassSkill | null; rune: ReturnType<typeof getAvailableRunes>[0] | null; }
const emptyLoadout = (): Record<SlotKey, SlotState> => ({
  LMB: { skill: null, rune: null }, RMB: { skill: null, rune: null },
  "1": { skill: null, rune: null }, "2": { skill: null, rune: null },
  "3": { skill: null, rune: null }, "4": { skill: null, rune: null },
});

// ─── Element colors ───────────────────────────────────────────────────────────
const ELEMENT_COLORS: Record<string, string> = {
  Physical: "#c0c0c0", Fire: "#ff6b35", Lightning: "#7eb8f7",
  Cold: "#7ecef7", Holy: "#ffe082", Poison: "#81c784",
  Arcane: "#ce93d8", Bone: "#a5d6a7",
};

// ─── Playstyle presets ────────────────────────────────────────────────────────
const PLAYSTYLES = [
  { id: "All",           label: "All",          icon: <Sparkles size={12} />, color: "#d4a843" },
  { id: "GR Pushing",   label: "GR Push",       icon: <Trophy size={12} />,   color: "#ce93d8" },
  { id: "Speed Farming",label: "Speed Farm",    icon: <Zap size={12} />,      color: "#ffd54f" },
  { id: "PvP",          label: "PvP",           icon: <Sword size={12} />,    color: "#ef5350" },
  { id: "Leveling",     label: "Leveling",      icon: <Shield size={12} />,   color: "#66bb6a" },
  { id: "Group",        label: "Group",         icon: <Users size={12} />,    color: "#42a5f5" },
];

// ─── Skill card in the tree ───────────────────────────────────────────────────
function SkillTreeCard({
  skill, level, isAssigned, isRecommended, accentColor, classId,
  onAssign, onDeselect,
}: {
  skill: ClassSkill; level: number; isAssigned: boolean; isRecommended: boolean;
  accentColor: string; classId: string;
  onAssign: () => void; onDeselect: () => void;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const isLocked = skill.unlockLevel > level;
  const elemColor = ELEMENT_COLORS[skill.element] || "#888";
  const iconStyle = getSkillIconStyle(classId, skill.id, 56);

  return (
    <div className="relative group">
      {/* Recommended glow ring */}
      {isRecommended && !isLocked && !isAssigned && (
        <div className="absolute -inset-1 rounded-lg animate-pulse"
          style={{ background: `${accentColor}22`, border: `2px solid ${accentColor}88`, zIndex: 0 }} />
      )}

      <div
        className="relative rounded-lg border transition-all duration-200 overflow-hidden"
        style={{
          background: isAssigned ? `${elemColor}15` : isLocked ? "oklch(0.08 0.008 30)" : "oklch(0.11 0.010 30)",
          borderColor: isAssigned ? elemColor : isLocked ? "oklch(0.18 0.012 30)" : isRecommended ? `${accentColor}66` : "oklch(0.24 0.015 50)",
          opacity: isLocked ? 0.45 : 1,
          zIndex: 1,
        }}>

        {/* Assigned indicator */}
        {isAssigned && (
          <div className="absolute top-1 right-1 z-10 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: elemColor }}>
            <Check size={9} color="oklch(0.08 0 0)" />
          </div>
        )}

        {/* Lock indicator */}
        {isLocked && (
          <div className="absolute top-1 right-1 z-10">
            <Lock size={11} color="oklch(0.55 0.010 60)" />
          </div>
        )}

        {/* Recommended badge */}
        {isRecommended && !isLocked && !isAssigned && (
          <div className="absolute top-1 left-1 z-10 px-1 rounded-sm"
            style={{ background: accentColor, fontSize: "0.45rem", fontFamily: "'Cinzel', serif", color: "oklch(0.08 0 0)", fontWeight: "bold" }}>
            BEST
          </div>
        )}

        {/* Main clickable area */}
        <div
          className="flex flex-col items-center p-2 gap-1.5 cursor-pointer"
          onClick={() => !isLocked && (isAssigned ? onDeselect() : onAssign())}
        >
          {/* Skill icon */}
          <div className="relative rounded overflow-hidden flex-shrink-0"
            style={{
              ...iconStyle,
              filter: isLocked ? "grayscale(1) brightness(0.4)" : isAssigned ? "brightness(1.1)" : "brightness(0.85)",
              boxShadow: isAssigned ? `0 0 10px ${elemColor}66` : "none",
            }} />

          {/* Skill name */}
          <p className="text-center font-cinzel font-bold leading-tight"
            style={{ color: isLocked ? "oklch(0.45 0.010 60)" : isAssigned ? elemColor : "oklch(0.88 0.01 60)", fontSize: "0.6rem", maxWidth: "72px" }}>
            {skill.name}
          </p>

          {/* Unlock level badge */}
          {isLocked && (
            <span className="px-1.5 py-0.5 rounded-sm font-cinzel font-bold"
              style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.55 0.010 60)", fontSize: "0.5rem", border: "1px solid oklch(0.22 0.015 50)" }}>
              Lv {skill.unlockLevel}
            </span>
          )}

          {/* Element badge when unlocked */}
          {!isLocked && (
            <span className="px-1.5 py-0.5 rounded-sm font-cinzel"
              style={{ background: `${elemColor}18`, color: elemColor, fontSize: "0.48rem", border: `1px solid ${elemColor}33` }}>
              {skill.element}
            </span>
          )}
        </div>

        {/* Detail toggle */}
        {!isLocked && (
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="w-full flex items-center justify-center py-1 border-t"
            style={{ borderColor: "oklch(0.18 0.012 30)", color: "oklch(0.65 0.010 60)" }}>
            {showDetail ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        )}

        {/* Expanded detail */}
        {showDetail && !isLocked && (
          <div className="px-2 pb-2 border-t" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
            <p className="text-xs leading-relaxed mt-1.5 mb-1.5" style={{ color: "oklch(0.78 0.010 60)", fontSize: "0.62rem" }}>
              {skill.description}
            </p>
            {/* Available runes */}
            <div className="space-y-1">
              {getAvailableRunes(skill, level).slice(0, 3).map((rune) => (
                <div key={rune.name} className="px-1.5 py-1 rounded" style={{ background: "oklch(0.12 0.010 30)" }}>
                  <p className="font-cinzel font-bold" style={{ color: accentColor, fontSize: "0.52rem" }}>{rune.name}</p>
                  <p style={{ color: "oklch(0.72 0.010 60)", fontSize: "0.5rem" }}>{rune.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Action Bar ───────────────────────────────────────────────────────────────
function ActionBar({ loadout, classId, accentColor, onSlotClick, activeSlot, onClearSlot, onRunePick }: {
  loadout: Record<SlotKey, SlotState>; classId: string; accentColor: string;
  onSlotClick: (slot: SlotKey) => void; activeSlot: SlotKey | null;
  onClearSlot: (slot: SlotKey) => void; onRunePick: (slot: SlotKey) => void;
}) {
  return (
    <div className="flex items-end gap-2 flex-wrap">
      {SLOT_KEYS.map((slot) => {
        const { skill, rune } = loadout[slot];
        const isActive = activeSlot === slot;
        const elemColor = skill ? (ELEMENT_COLORS[skill.element] || "#888") : "#444";
        return (
          <div key={slot} className="flex flex-col items-center gap-1 cursor-pointer group"
            onClick={() => onSlotClick(slot)}
            style={{ minWidth: "72px" }}>
            {/* Large icon tile */}
            <div className="relative rounded transition-all duration-200"
              style={{
                width: "72px", height: "72px",
                border: `2px solid ${isActive ? accentColor : skill ? `${elemColor}88` : "oklch(0.22 0.015 50)"}`,
                boxShadow: isActive ? `0 0 16px ${accentColor}66, inset 0 0 8px ${accentColor}22` : skill ? `0 0 8px ${elemColor}33` : "none",
                background: isActive ? `${accentColor}15` : "oklch(0.09 0.008 30)",
                overflow: "hidden",
              }}>
              {skill ? (
                <>
                  <div style={{ ...getSkillIconStyle(classId, skill.id, 72), position: "absolute", inset: 0, width: "72px", height: "72px", filter: isActive ? "brightness(1.1)" : "brightness(0.9)" }} />
                  <button onClick={(e) => { e.stopPropagation(); onClearSlot(slot); }}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(5,3,8,0.85)", color: "#ef5350", zIndex: 10 }}>
                    <X size={10} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: elemColor, opacity: 0.7 }} />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span style={{ color: isActive ? accentColor : "oklch(0.28 0.010 60)", fontSize: "1.5rem", fontWeight: "bold" }}>+</span>
                </div>
              )}
            </div>
            {/* Keybind */}
            <div className="px-2 py-0.5 rounded-sm text-center"
              style={{ background: isActive ? accentColor : skill ? `${elemColor}22` : "oklch(0.12 0.010 30)", border: `1px solid ${isActive ? accentColor : skill ? `${elemColor}44` : "oklch(0.20 0.015 50)"}` }}>
              <p className="font-mono font-bold" style={{ color: isActive ? "oklch(0.08 0 0)" : skill ? elemColor : "oklch(0.65 0.010 60)", fontSize: "0.6rem" }}>{slot}</p>
            </div>
            {/* Skill name */}
            <p className="text-center font-cinzel font-bold leading-tight" style={{ color: skill ? "oklch(0.85 0.01 60)" : "oklch(0.40 0.010 60)", fontSize: "0.52rem", maxWidth: "72px" }}>
              {skill ? (skill.name.length > 12 ? skill.name.slice(0, 11) + "…" : skill.name) : slot === "LMB" ? "Left Click" : slot === "RMB" ? "Right Click" : `Key ${slot}`}
            </p>
            {/* Rune */}
            {rune && (
              <button onClick={(e) => { e.stopPropagation(); onRunePick(slot); }}
                className="text-center px-1 rounded"
                style={{ color: accentColor, fontFamily: "'Cinzel', serif", fontSize: "0.45rem", background: `${accentColor}12`, border: `1px solid ${accentColor}33`, maxWidth: "72px" }}>
                ◆ {rune.name.length > 10 ? rune.name.slice(0, 9) + "…" : rune.name}
              </button>
            )}
          </div>
        );
      })}
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
  const [activeTab, setActiveTab] = useState<"tree" | "builds">("tree");
  const [loadout, setLoadout] = useState<Record<SlotKey, SlotState>>(emptyLoadout);
  const [activeSlot, setActiveSlot] = useState<SlotKey | null>(null);
  const [runePickerSlot, setRunePickerSlot] = useState<SlotKey | null>(null);

  if (!cls || !skillData) return null;

  const ac = cls.color;
  const portrait = CLASS_PORTRAITS[cls.id];

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const groups: Record<string, ClassSkill[]> = {};
    skillData.categories.forEach((cat) => { groups[cat] = []; });
    skillData.skills.forEach((s) => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    // Sort each category by unlock level
    Object.keys(groups).forEach((cat) => {
      groups[cat].sort((a, b) => a.unlockLevel - b.unlockLevel);
    });
    return groups;
  }, [skillData]);

  // Compute recommendations: highest power-rated unlocked unassigned skills
  const assignedIds = Object.values(loadout).map((s) => s.skill?.id).filter(Boolean) as string[];
  const recommendations = useMemo(() => {
    return skillData.skills
      .filter((s) => s.unlockLevel <= level && !assignedIds.includes(s.id))
      .sort((a, b) => (SKILL_POWER_RATINGS[b.id] || 1) - (SKILL_POWER_RATINGS[a.id] || 1))
      .slice(0, 3)
      .map((s) => s.id);
  }, [level, assignedIds, skillData.skills]);

  const unlockedCount = skillData.skills.filter((s) => s.unlockLevel <= level).length;
  const filledSlots = Object.values(loadout).filter((s) => s.skill !== null).length;

  const assignSkill = (skill: ClassSkill) => {
    if (skill.unlockLevel > level) return;
    const runes = getAvailableRunes(skill, level);
    if (activeSlot) {
      setLoadout((prev) => ({ ...prev, [activeSlot]: { skill, rune: runes[0] || null } }));
      setActiveSlot(null);
    } else {
      const emptySlot = SLOT_KEYS.find((k) => !loadout[k].skill);
      if (emptySlot) setLoadout((prev) => ({ ...prev, [emptySlot]: { skill, rune: runes[0] || null } }));
    }
  };

  const deassignSkill = (skill: ClassSkill) => {
    const slot = Object.entries(loadout).find(([, v]) => v.skill?.id === skill.id)?.[0] as SlotKey | undefined;
    if (slot) setLoadout((prev) => ({ ...prev, [slot]: { skill: null, rune: null } }));
  };

  const clearSlot = (slot: SlotKey) => setLoadout((prev) => ({ ...prev, [slot]: { skill: null, rune: null } }));

  const loadMaxPower = () => {
    const available = skillData.skills
      .filter((s) => s.unlockLevel <= level)
      .sort((a, b) => (SKILL_POWER_RATINGS[b.id] || 1) - (SKILL_POWER_RATINGS[a.id] || 1));
    const newLoadout = emptyLoadout();
    const used = new Set<string>();
    let idx = 0;
    for (const skill of available) {
      if (idx >= 6) break;
      if (!used.has(skill.id)) {
        const runes = getAvailableRunes(skill, level);
        newLoadout[SLOT_KEYS[idx]] = { skill, rune: runes[0] || null };
        used.add(skill.id);
        idx++;
      }
    }
    setLoadout(newLoadout);
  };

  const loadPreset = (preset: SkillPreset) => {
    const newLoadout = emptyLoadout();
    const usedIds = new Set<string>();
    for (const [slot, { skillId }] of Object.entries(preset.slots)) {
      const skill = skillData.skills.find((s) => s.id === skillId);
      if (skill && skill.unlockLevel <= level && !usedIds.has(skill.id)) {
        const runes = getAvailableRunes(skill, level);
        newLoadout[slot as SlotKey] = { skill, rune: runes[0] || null };
        usedIds.add(skill.id);
      } else {
        // Auto-swap: find best available in same category
        const lockedSkill = skillData.skills.find((s) => s.id === skillId);
        const cat = lockedSkill?.category || "";
        const best = skillData.skills
          .filter((s) => s.unlockLevel <= level && !usedIds.has(s.id))
          .sort((a, b) => {
            const ca = a.category === cat ? 0 : 1;
            const cb = b.category === cat ? 0 : 1;
            if (ca !== cb) return ca - cb;
            return (SKILL_POWER_RATINGS[b.id] || 1) - (SKILL_POWER_RATINGS[a.id] || 1);
          })[0];
        if (best) {
          const runes = getAvailableRunes(best, level);
          newLoadout[slot as SlotKey] = { skill: best, rune: runes[0] || null };
          usedIds.add(best.id);
        }
      }
    }
    setLoadout(newLoadout);
    setActiveTab("tree");
  };

  const filteredPresets = activePlaystyle === "All" ? allPresets : allPresets.filter((p) => p.playstyle === activePlaystyle);

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(ellipse at 50% 0%, ${ac}07 0%, oklch(0.06 0.008 30) 55%)` }}>

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40 border-b px-4 py-2 flex items-center justify-between gap-4"
        style={{ borderColor: "oklch(0.20 0.015 50)", background: "oklch(0.06 0.008 30 / 0.97)", backdropFilter: "blur(12px)" }}>
        <button onClick={() => navigate(`/guide/${classId}`)}
          className="flex items-center gap-1.5 text-sm font-cinzel tracking-wide flex-shrink-0"
          style={{ color: "oklch(0.70 0.010 60)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = ac; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.70 0.010 60)"; }}>
          <ChevronLeft size={14} /> Guide
        </button>

        {/* ── LEVEL SLIDER — THE HERO CONTROL ── */}
        <div className="flex-1 max-w-xl">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-cinzel-decorative font-black text-2xl" style={{ color: ac }}>
                {level >= 71 ? "70+" : level}
              </span>
              <div>
                <p className="font-cinzel font-bold" style={{ color: ac, fontSize: "0.65rem" }}>
                  {level < 10 ? "Novice" : level < 20 ? "Apprentice" : level < 30 ? "Journeyman" : level < 40 ? "Veteran" : level < 50 ? "Expert" : level < 60 ? "Master" : level < 70 ? "Champion" : "Nephalem"}
                </p>
                <p className="font-cinzel" style={{ color: "oklch(0.72 0.010 60)", fontSize: "0.55rem" }}>
                  {unlockedCount} skills unlocked · {filledSlots}/6 slots filled
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 10, 20, 30, 40, 50, 60, 70].map((l) => (
                <button key={l} onClick={() => setLevel(l)}
                  className="px-1.5 py-0.5 rounded font-cinzel font-bold transition-all"
                  style={{ background: level === l ? ac : "oklch(0.14 0.012 30)", color: level === l ? "oklch(0.08 0 0)" : "oklch(0.65 0.010 60)", border: `1px solid ${level === l ? ac : "oklch(0.22 0.015 50)"}`, fontSize: "0.55rem" }}>
                  {l}
                </button>
              ))}
              <button onClick={() => setLevel(71)}
                className="px-1.5 py-0.5 rounded font-cinzel font-bold transition-all"
                style={{ background: level === 71 ? ac : "oklch(0.14 0.012 30)", color: level === 71 ? "oklch(0.08 0 0)" : "oklch(0.65 0.010 60)", border: `1px solid ${level === 71 ? ac : "oklch(0.22 0.015 50)"}`, fontSize: "0.55rem" }}>
                70+
              </button>
            </div>
          </div>
          <input type="range" min={1} max={71} step={1} value={level}
            onChange={(e) => {
              const newLevel = Number(e.target.value);
              setLevel(newLevel);
              // Auto-clear slots with now-locked skills
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
            style={{ WebkitAppearance: "none", appearance: "none", height: "6px", borderRadius: "9999px", outline: "none", background: `linear-gradient(to right, ${ac} 0%, ${ac} ${((level - 1) / 70) * 100}%, oklch(0.22 0.015 50) ${((level - 1) / 70) * 100}%, oklch(0.22 0.015 50) 100%)`, accentColor: ac }} />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <img src={portrait} alt={cls.name} className="w-8 h-10 rounded object-cover object-top"
            style={{ border: `1px solid ${ac}55` }} />
          <div>
            <p className="font-cinzel-decorative font-black text-sm" style={{ color: ac }}>{cls.name}</p>
            <p className="font-cinzel" style={{ color: "oklch(0.72 0.010 60)", fontSize: "0.55rem" }}>{cls.resource.name}</p>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-4">

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 mb-4 border-b pb-3" style={{ borderColor: "oklch(0.20 0.015 50)" }}>
          {[
            { id: "tree",   label: "Skill Tree",   icon: <Zap size={13} /> },
            { id: "builds", label: "Meta Builds",  icon: <Trophy size={13} /> },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as "tree" | "builds")}
              className="flex items-center gap-1.5 px-4 py-2 rounded border font-cinzel font-bold text-sm transition-all"
              style={{ background: activeTab === tab.id ? `${ac}18` : "oklch(0.10 0.010 30)", borderColor: activeTab === tab.id ? `${ac}55` : "oklch(0.22 0.015 50)", color: activeTab === tab.id ? ac : "oklch(0.72 0.010 60)" }}>
              {tab.icon} {tab.label}
            </button>
          ))}

          <div className="ml-auto flex gap-2">
            <button onClick={loadMaxPower}
              className="flex items-center gap-1.5 px-4 py-2 rounded font-cinzel font-bold text-sm"
              style={{ background: `linear-gradient(135deg, ${ac}, oklch(0.72 0.18 55))`, color: "oklch(0.08 0 0)" }}>
              <Sparkles size={13} /> Max Power
            </button>
            <button onClick={() => setLoadout(emptyLoadout())}
              className="flex items-center gap-1.5 px-4 py-2 rounded border font-cinzel text-sm"
              style={{ borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.72 0.010 60)", background: "transparent" }}>
              <X size={12} /> Clear
            </button>
          </div>
        </div>

        {/* ── Action Bar ── */}
        <div className="mb-5 p-4 rounded-lg border" style={{ background: `${ac}06`, borderColor: `${ac}22` }}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-cinzel tracking-widest" style={{ color: ac, fontSize: "0.6rem" }}>
              ACTION BAR — Click a slot, then click a skill to assign
            </p>
            {activeSlot && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded border"
                style={{ background: `${ac}12`, borderColor: `${ac}44` }}>
                <div className="w-6 h-6 rounded flex items-center justify-center font-bold"
                  style={{ background: ac, color: "oklch(0.08 0 0)", fontFamily: "'Courier New', monospace", fontSize: "0.7rem" }}>
                  {activeSlot}
                </div>
                <p className="font-cinzel text-sm" style={{ color: ac }}>Click a skill to assign</p>
                <button onClick={() => setActiveSlot(null)} style={{ color: "oklch(0.65 0.010 60)" }}>×</button>
              </div>
            )}
          </div>
          <ActionBar
            loadout={loadout} classId={classId} accentColor={ac}
            onSlotClick={(slot) => setActiveSlot(activeSlot === slot ? null : slot)}
            activeSlot={activeSlot}
            onClearSlot={clearSlot}
            onRunePick={(slot) => setRunePickerSlot(slot)}
          />
        </div>

        {/* ── SKILL TREE TAB ── */}
        {activeTab === "tree" && (
          <div>
            {/* Recommendations banner */}
            {recommendations.length > 0 && (
              <div className="mb-4 p-3 rounded-lg border flex items-center gap-3 flex-wrap"
                style={{ background: `${ac}08`, borderColor: `${ac}33` }}>
                <Star size={14} color={ac} className="flex-shrink-0" />
                <p className="font-cinzel font-bold text-sm" style={{ color: ac }}>Recommended at Level {level >= 71 ? "70+" : level}:</p>
                {recommendations.map((id) => {
                  const skill = skillData.skills.find((s) => s.id === id);
                  if (!skill) return null;
                  return (
                    <button key={id}
                      onClick={() => assignSkill(skill)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded border font-cinzel font-bold text-sm transition-all"
                      style={{ background: `${ac}15`, borderColor: `${ac}55`, color: ac }}>
                      <div style={{ ...getSkillIconStyle(classId, skill.id, 20), borderRadius: "3px", flexShrink: 0 }} />
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Category columns — TalentCalc style */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${skillData.categories.length}, 1fr)` }}>
              {skillData.categories.map((cat) => {
                const catSkills = skillsByCategory[cat] || [];
                const unlockedInCat = catSkills.filter((s) => s.unlockLevel <= level).length;
                return (
                  <div key={cat} className="flex flex-col">
                    {/* Category header */}
                    <div className="rounded-t-lg px-3 py-2 mb-2 text-center"
                      style={{ background: `${ac}18`, borderTop: `1px solid ${ac}33`, borderLeft: `1px solid ${ac}33`, borderRight: `1px solid ${ac}33`, borderBottom: "none" }}>
                      <p className="font-cinzel-decorative font-bold text-sm" style={{ color: ac }}>{cat}</p>
                      <p className="font-cinzel" style={{ color: "oklch(0.72 0.010 60)", fontSize: "0.55rem" }}>
                        {unlockedInCat}/{catSkills.length} unlocked
                      </p>
                    </div>

                    {/* Skills in this category */}
                    <div className="rounded-b-lg border p-2 flex flex-col gap-2 flex-1"
                      style={{ background: "oklch(0.09 0.008 30)", borderColor: `${ac}22` }}>
                      {catSkills.map((skill) => (
                        <SkillTreeCard
                          key={skill.id}
                          skill={skill}
                          level={level}
                          isAssigned={assignedIds.includes(skill.id)}
                          isRecommended={recommendations.includes(skill.id)}
                          accentColor={ac}
                          classId={classId}
                          onAssign={() => assignSkill(skill)}
                          onDeselect={() => deassignSkill(skill)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── BUILDS TAB ── */}
        {activeTab === "builds" && (
          <div>
            {/* Playstyle filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {PLAYSTYLES.map((ps) => {
                const count = ps.id === "All" ? allPresets.length : allPresets.filter((p) => p.playstyle === ps.id).length;
                if (count === 0 && ps.id !== "All") return null;
                const isActive = activePlaystyle === ps.id;
                return (
                  <button key={ps.id} onClick={() => setActivePlaystyle(ps.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded border text-sm font-cinzel tracking-wide transition-all"
                    style={{ background: isActive ? `${ps.color}18` : "oklch(0.10 0.010 30)", borderColor: isActive ? `${ps.color}66` : "oklch(0.22 0.015 50)", color: isActive ? ps.color : "oklch(0.72 0.010 60)" }}>
                    {ps.icon} {ps.label}
                    <span className="ml-1 rounded-full px-1.5 py-0.5"
                      style={{ background: isActive ? `${ps.color}22` : "oklch(0.14 0.012 30)", color: isActive ? ps.color : "oklch(0.65 0.010 60)", fontSize: "0.55rem" }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Build cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPresets.map((preset) => {
                const tierColors: Record<string, string> = { S: "#ffd54f", A: "#66bb6a", B: "#42a5f5", C: "#9e9e9e", D: "#ef5350" };
                const tc = tierColors[preset.tier] || "#9e9e9e";
                const presetSkills = Object.values(preset.slots).map((s) => skillData.skills.find((sk) => sk.id === s.skillId)).filter(Boolean) as ClassSkill[];
                const lockedCount = presetSkills.filter((s) => s.unlockLevel > level).length;
                const isFullyAvailable = lockedCount === 0;

                return (
                  <div key={preset.id} className="rounded-lg border overflow-hidden"
                    style={{ background: "oklch(0.10 0.010 30)", borderColor: isFullyAvailable ? `${tc}44` : "oklch(0.22 0.015 50)" }}>
                    {/* Tier stripe */}
                    <div style={{ height: "3px", background: `linear-gradient(90deg, ${tc}, ${tc}44, transparent)` }} />

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded font-cinzel font-bold"
                              style={{ background: `${tc}22`, color: tc, border: `1px solid ${tc}44`, fontSize: "0.6rem" }}>
                              {preset.tier} Tier
                            </span>
                            <span className="px-2 py-0.5 rounded font-cinzel"
                              style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.72 0.010 60)", fontSize: "0.6rem" }}>
                              {preset.playstyle}
                            </span>
                          </div>
                          <h3 className="font-cinzel-decorative font-bold text-base" style={{ color: "oklch(0.92 0.01 60)" }}>{preset.name}</h3>
                        </div>
                        {lockedCount > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded"
                            style={{ background: "oklch(0.14 0.012 30)", border: "1px solid oklch(0.22 0.015 50)" }}>
                            <Lock size={10} color="oklch(0.65 0.010 60)" />
                            <span className="font-cinzel" style={{ color: "oklch(0.72 0.010 60)", fontSize: "0.55rem" }}>{lockedCount} locked</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm mb-3 leading-relaxed" style={{ color: "oklch(0.78 0.010 60)" }}>{preset.description}</p>

                      {/* Skill bar preview */}
                      <div className="flex gap-1.5 mb-3">
                        {Object.entries(preset.slots).map(([slot, { skillId }]) => {
                          const skill = skillData.skills.find((s) => s.id === skillId);
                          const locked = skill && skill.unlockLevel > level;
                          return (
                            <div key={slot} className="flex flex-col items-center gap-0.5">
                              <div className="rounded overflow-hidden"
                                style={{
                                  ...getSkillIconStyle(classId, skillId, 36),
                                  border: `1px solid ${locked ? "oklch(0.22 0.015 50)" : `${ELEMENT_COLORS[skill?.element || ""] || "#888"}55`}`,
                                  filter: locked ? "grayscale(1) brightness(0.4)" : "brightness(0.9)",
                                }} />
                              <p className="font-mono font-bold" style={{ color: locked ? "oklch(0.45 0.010 60)" : "oklch(0.65 0.010 60)", fontSize: "0.45rem" }}>{slot}</p>
                            </div>
                          );
                        })}
                      </div>

                      <button onClick={() => loadPreset(preset)}
                        className="w-full py-2 rounded font-cinzel font-bold text-sm transition-all"
                        style={{ background: isFullyAvailable ? `${tc}22` : "oklch(0.12 0.010 30)", border: `1px solid ${isFullyAvailable ? tc : "oklch(0.22 0.015 50)"}`, color: isFullyAvailable ? tc : "oklch(0.65 0.010 60)" }}>
                        {isFullyAvailable ? "Load Build" : `Load Build (${lockedCount} auto-swapped)`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Rune Picker Modal ── */}
      {runePickerSlot && loadout[runePickerSlot].skill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
          onClick={() => setRunePickerSlot(null)}>
          <div className="w-full max-w-md rounded-lg border shadow-2xl"
            style={{ background: "oklch(0.09 0.010 30)", borderColor: `${ac}44` }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
              <div>
                <p className="font-cinzel font-bold text-sm" style={{ color: ac }}>{loadout[runePickerSlot].skill!.name}</p>
                <p className="text-sm" style={{ color: "oklch(0.72 0.010 60)" }}>Select a rune</p>
              </div>
              <button onClick={() => setRunePickerSlot(null)} className="w-7 h-7 rounded flex items-center justify-center"
                style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.65 0.010 60)" }}>
                <X size={13} />
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-80 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
              <button onClick={() => { setLoadout((prev) => ({ ...prev, [runePickerSlot!]: { ...prev[runePickerSlot!], rune: null } })); setRunePickerSlot(null); }}
                className="w-full flex items-center gap-3 p-3 rounded border text-left"
                style={{ background: !loadout[runePickerSlot].rune ? `${ac}12` : "oklch(0.11 0.010 30)", borderColor: !loadout[runePickerSlot].rune ? ac : "oklch(0.22 0.015 50)" }}>
                <p className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.80 0.01 60)" }}>No Rune</p>
              </button>
              {getAvailableRunes(loadout[runePickerSlot].skill!, level).map((rune) => (
                <button key={rune.name}
                  onClick={() => { setLoadout((prev) => ({ ...prev, [runePickerSlot!]: { ...prev[runePickerSlot!], rune } })); setRunePickerSlot(null); }}
                  className="w-full flex items-start gap-3 p-3 rounded border text-left"
                  style={{ background: loadout[runePickerSlot].rune?.name === rune.name ? `${ac}12` : "oklch(0.11 0.010 30)", borderColor: loadout[runePickerSlot].rune?.name === rune.name ? ac : "oklch(0.22 0.015 50)" }}>
                  <div>
                    <p className="font-cinzel font-bold text-sm mb-0.5" style={{ color: ac }}>{rune.name}</p>
                    <p className="text-sm" style={{ color: "oklch(0.78 0.010 60)" }}>{rune.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
