// Sanctuary Grimoire — Visual Skill Bar & Rotation Guide Components
import { useState } from "react";
import { SkillBarSlot, RotationStep } from "@/data/classes";

const ELEMENT_COLORS: Record<string, string> = {
  Physical: "#a0a0a0", Fire: "#ff6b35", Lightning: "#7eb8f7",
  Cold: "#7ecef7", Holy: "#ffe082", Poison: "#81c784",
  Arcane: "#ce93d8", None: "#666",
};

const TIMING_META: Record<RotationStep["timing"], { label: string; color: string; bg: string }> = {
  opener:       { label: "Opener",      color: "#ffe082", bg: "oklch(0.80 0.18 95 / 0.15)" },
  "on-cooldown":{ label: "On Cooldown", color: "#42a5f5", bg: "oklch(0.65 0.18 260 / 0.15)" },
  spam:         { label: "Spam",        color: "#ef5350", bg: "oklch(0.55 0.22 25 / 0.15)" },
  situational:  { label: "Situational", color: "#ce93d8", bg: "oklch(0.65 0.18 300 / 0.15)" },
  maintain:     { label: "Maintain",    color: "#66bb6a", bg: "oklch(0.65 0.18 145 / 0.15)" },
};

const ROLE_COLORS: Record<string, string> = {
  "Primary Generator":    "#66bb6a",
  "Main Damage":          "#ef5350",
  "Main Damage / Movement": "#ef5350",
  "Main Channel / Damage":"#ef5350",
  "AoE Damage":           "#ff7043",
  "AoE Burst":            "#ff7043",
  "Offensive Buff":       "#ffd54f",
  "Defensive Buff":       "#4fc3f7",
  "Emergency Defense":    "#4fc3f7",
  "Emergency Escape":     "#4fc3f7",
  "Mobility / Escape":    "#80cbc4",
  "Mobility / Opener":    "#80cbc4",
  "Mobility / Defense":   "#80cbc4",
  "Ultimate Cooldown":    "#ce93d8",
  "Ultimate Burst Cooldown": "#ce93d8",
  "Debuff":               "#ffb74d",
  "Crowd Control / Debuff":"#ffb74d",
  "Crowd Control / Setup":"#ffb74d",
  "Damage Buff":          "#ffd54f",
  "Damage Aura":          "#ff8a65",
  "Damage Multiplier / Defense": "#ce93d8",
  "Persistent Damage":    "#ff6b35",
  "DoT Application":      "#81c784",
  "DoT Spread":           "#81c784",
  "Burst Trigger":        "#ef5350",
  "Defense / Corpse Gen": "#4fc3f7",
  "Discipline Recovery":  "#9575cd",
};

// ─── Single Skill Slot ────────────────────────────────────────────────────────
function SkillSlot({
  slot,
  accentColor,
  isActive,
  onClick,
}: {
  slot: SkillBarSlot;
  accentColor: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const elemColor = ELEMENT_COLORS[slot.element || "None"] || "#666";
  const roleColor = ROLE_COLORS[slot.role] || accentColor;

  const KEY_STYLES: Record<string, { width: string; label: string }> = {
    LMB: { width: "w-20", label: "LMB" },
    RMB: { width: "w-20", label: "RMB" },
    "1": { width: "w-16", label: "1" },
    "2": { width: "w-16", label: "2" },
    "3": { width: "w-16", label: "3" },
    "4": { width: "w-16", label: "4" },
  };
  const ks = KEY_STYLES[slot.key] || { width: "w-12", label: slot.key };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-200 ${ks.width}`}
    >
      {/* Key cap */}
      <div
        className="w-full aspect-square rounded flex items-center justify-center relative border-2 transition-all duration-200"
        style={{
          background: isActive
            ? `${accentColor}22`
            : `${elemColor}10`,
          borderColor: isActive ? accentColor : `${elemColor}55`,
          boxShadow: isActive
            ? `0 0 16px ${accentColor}55, 0 4px 12px rgba(0,0,0,0.4)`
            : `0 2px 6px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Key label badge */}
        <div
          className="absolute -top-2 -left-1 z-10 flex items-center justify-center rounded text-xs font-bold"
          style={{
            background: isActive ? accentColor : "oklch(0.18 0.012 30)",
            color: isActive ? "oklch(0.08 0 0)" : "oklch(0.65 0.010 60)",
            border: `1px solid ${isActive ? accentColor : "oklch(0.28 0.015 50)"}`,
            fontFamily: "'Courier New', monospace",
            fontSize: "0.6rem",
            minWidth: "1.4rem",
            height: "1.2rem",
            padding: "0 4px",
            boxShadow: isActive ? `0 0 8px ${accentColor}66` : "0 1px 3px rgba(0,0,0,0.4)",
          }}
        >
          {ks.label}
        </div>

        {/* Element color dot */}
        <div
          className="w-2 h-2 rounded-full absolute bottom-1.5 right-1.5"
          style={{ background: elemColor, boxShadow: `0 0 4px ${elemColor}88` }}
        />

        {/* Ability initial */}
        <span
          className="font-cinzel-decorative font-black"
          style={{
            fontSize: "1.1rem",
            color: isActive ? accentColor : elemColor,
            textShadow: isActive ? `0 0 12px ${accentColor}88` : `0 0 8px ${elemColor}55`,
          }}
        >
          {slot.abilityName[0]}
        </span>
      </div>

      {/* Ability name — full name, wraps to 2 lines */}
      <span
        className="text-center leading-tight"
        style={{
          color: isActive ? accentColor : "oklch(0.65 0.010 60)",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.52rem",
          letterSpacing: "0.02em",
          maxWidth: "100%",
          wordBreak: "break-word",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: "1.3",
        }}
      >
        {slot.abilityName}
      </span>

      {/* Role badge */}
      <span
        className="text-center px-1 py-0.5 rounded-sm"
        style={{
          background: `${roleColor}15`,
          color: roleColor,
          border: `1px solid ${roleColor}33`,
          fontFamily: "'Cinzel', serif",
          fontSize: "0.5rem",
          letterSpacing: "0.03em",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {slot.role.split(" ").slice(0, 2).join(" ")}
      </span>
    </button>
  );
}

// ─── Skill Bar Detail Panel ───────────────────────────────────────────────────
function SlotDetail({
  slot,
  accentColor,
}: {
  slot: SkillBarSlot;
  accentColor: string;
}) {
  const elemColor = ELEMENT_COLORS[slot.element || "None"] || "#666";
  const roleColor = ROLE_COLORS[slot.role] || accentColor;

  return (
    <div
      className="p-4 rounded border animate-in fade-in duration-200"
      style={{
        background: `${accentColor}08`,
        borderColor: `${accentColor}44`,
      }}
    >
      <div className="flex flex-wrap items-start gap-3 mb-3">
        {/* Key badge */}
        <div
          className="flex items-center justify-center rounded font-bold flex-shrink-0"
          style={{
            background: accentColor,
            color: "oklch(0.08 0 0)",
            fontFamily: "'Courier New', monospace",
            fontSize: "0.75rem",
            minWidth: "2.2rem",
            height: "2.2rem",
            padding: "0 6px",
            boxShadow: `0 0 12px ${accentColor}66`,
          }}
        >
          {slot.key}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-cinzel font-bold text-sm mb-0.5" style={{ color: "oklch(0.90 0.01 60)" }}>
            {slot.abilityName}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            <span
              className="text-xs px-2 py-0.5 rounded-sm"
              style={{ background: `${roleColor}18`, color: roleColor, border: `1px solid ${roleColor}33`, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}
            >
              {slot.role}
            </span>
            {slot.element && slot.element !== "None" && (
              <span
                className="text-xs px-2 py-0.5 rounded-sm"
                style={{ background: `${elemColor}18`, color: elemColor, border: `1px solid ${elemColor}33`, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}
              >
                {slot.element}
              </span>
            )}
            <span
              className="text-xs px-2 py-0.5 rounded-sm"
              style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.80 0.010 60)", border: "1px solid oklch(0.22 0.015 50)", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}
            >
              Rune: {slot.rune}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>
        {slot.note}
      </p>
    </div>
  );
}

// ─── Full Skill Bar Component ─────────────────────────────────────────────────
export function SkillBarDisplay({
  skillBar,
  accentColor,
}: {
  skillBar: SkillBarSlot[];
  accentColor: string;
}) {
  const [activeSlot, setActiveSlot] = useState<number>(0);

  return (
    <div>
      {/* The bar itself */}
      <div
        className="flex items-end justify-center gap-3 p-4 rounded border mb-4"
        style={{
          background: "oklch(0.08 0.010 30)",
          borderColor: "oklch(0.22 0.015 50)",
        }}
      >
        {skillBar.map((slot, i) => (
          <SkillSlot
            key={slot.key}
            slot={slot}
            accentColor={accentColor}
            isActive={activeSlot === i}
            onClick={() => setActiveSlot(i)}
          />
        ))}
      </div>

      {/* Detail panel for selected slot */}
      <SlotDetail slot={skillBar[activeSlot]} accentColor={accentColor} />

      <p className="text-xs text-center mt-2" style={{ color: "oklch(0.72 0.010 60)" }}>
        Click any slot to see its full description and rune recommendation
      </p>
    </div>
  );
}

// ─── Rotation Guide Component ─────────────────────────────────────────────────
export function RotationGuide({
  rotation,
  accentColor,
}: {
  rotation: RotationStep[];
  accentColor: string;
}) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {rotation.map((step) => {
        const timing = TIMING_META[step.timing];
        const isOpen = expanded === step.step;

        return (
          <div
            key={step.step}
            className="rounded border overflow-hidden transition-all duration-200"
            style={{
              borderColor: isOpen ? `${accentColor}55` : "oklch(0.22 0.015 50)",
              background: isOpen ? `${accentColor}06` : "oklch(0.10 0.010 30)",
            }}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : step.step)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left"
            >
              {/* Step number */}
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: isOpen ? accentColor : "oklch(0.16 0.015 30)",
                  color: isOpen ? "oklch(0.08 0 0)" : "oklch(0.80 0.010 60)",
                  border: `1px solid ${isOpen ? accentColor : "oklch(0.28 0.015 50)"}`,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.65rem",
                }}
              >
                {step.step}
              </div>

              {/* Key badges */}
              <div className="flex gap-1 flex-shrink-0">
                {step.keys.map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center justify-center rounded font-bold"
                    style={{
                      background: isOpen ? accentColor : "oklch(0.18 0.012 30)",
                      color: isOpen ? "oklch(0.08 0 0)" : accentColor,
                      border: `1px solid ${accentColor}55`,
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.6rem",
                      minWidth: "1.6rem",
                      height: "1.4rem",
                      padding: "0 4px",
                      boxShadow: isOpen ? `0 0 6px ${accentColor}55` : "none",
                    }}
                  >
                    {k}
                  </span>
                ))}
              </div>

              {/* Action label */}
              <span
                className="flex-1 font-cinzel font-bold text-xs min-w-0 truncate"
                style={{ color: isOpen ? accentColor : "oklch(0.78 0.01 60)" }}
              >
                {step.action}
              </span>

              {/* Timing badge */}
              <span
                className="flex-shrink-0 text-xs px-2 py-0.5 rounded-sm hidden sm:inline-flex"
                style={{
                  background: timing.bg,
                  color: timing.color,
                  border: `1px solid ${timing.color}33`,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.05em",
                }}
              >
                {timing.label}
              </span>

              {/* Chevron */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="flex-shrink-0 transition-transform duration-200"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  color: isOpen ? accentColor : "oklch(0.74 0.010 60)",
                }}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Expanded detail */}
            {isOpen && (
              <div
                className="px-4 pb-4 border-t"
                style={{ borderColor: `${accentColor}22` }}
              >
                {/* Timing badge (mobile) */}
                <div className="flex items-center gap-2 mt-3 mb-2 sm:hidden">
                  <span
                    className="text-xs px-2 py-0.5 rounded-sm"
                    style={{
                      background: timing.bg,
                      color: timing.color,
                      border: `1px solid ${timing.color}33`,
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.55rem",
                    }}
                  >
                    {timing.label}
                  </span>
                </div>

                <p className="text-sm leading-relaxed mt-3" style={{ color: "oklch(0.72 0.010 60)" }}>
                  {step.detail}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Timing legend */}
      <div
        className="flex flex-wrap gap-2 pt-3 mt-2 border-t"
        style={{ borderColor: "oklch(0.18 0.012 30)" }}
      >
        <span className="text-xs self-center" style={{ color: "oklch(0.72 0.010 60)", fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.05em" }}>
          TIMING:
        </span>
        {Object.entries(TIMING_META).map(([key, val]) => (
          <span
            key={key}
            className="text-xs px-2 py-0.5 rounded-sm"
            style={{
              background: val.bg,
              color: val.color,
              border: `1px solid ${val.color}33`,
              fontFamily: "'Cinzel', serif",
              fontSize: "0.55rem",
            }}
          >
            {val.label}
          </span>
        ))}
      </div>
    </div>
  );
}
