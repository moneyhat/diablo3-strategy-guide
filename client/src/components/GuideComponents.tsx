// Sanctuary Grimoire — Compact Guide UI Components
// Accordion, TabPanel, Carousel, StatBar, ItemPill, BuildCard
import { useState, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react";

// ─── Accordion ────────────────────────────────────────────────────────────────
interface AccordionItem {
  label: string;
  content: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export function Accordion({
  items,
  accentColor = "oklch(0.72 0.18 55)",
  allowMultiple = false,
}: {
  items: AccordionItem[];
  accentColor?: string;
  allowMultiple?: boolean;
}) {
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        if (!allowMultiple) next.clear();
        next.add(i);
      }
      return next;
    });
  };

  return (
    <div className="space-y-1">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div
            key={i}
            className="rounded border overflow-hidden transition-all duration-200"
            style={{
              borderColor: isOpen ? `${accentColor}55` : "oklch(0.22 0.015 50)",
              background: isOpen ? `${accentColor}06` : "oklch(0.10 0.010 30)",
            }}
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className="font-cinzel font-bold text-xs tracking-wide"
                  style={{ color: isOpen ? accentColor : "oklch(0.80 0.01 60)" }}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-sm flex-shrink-0"
                    style={{
                      background: `${item.badgeColor || accentColor}18`,
                      color: item.badgeColor || accentColor,
                      border: `1px solid ${item.badgeColor || accentColor}33`,
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.55rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <ChevronDown
                size={14}
                style={{
                  color: isOpen ? accentColor : "oklch(0.74 0.010 60)",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-1 border-t" style={{ borderColor: `${accentColor}22` }}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── TabPanel ─────────────────────────────────────────────────────────────────
interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  content: React.ReactNode;
}

export function TabPanel({
  tabs,
  accentColor = "oklch(0.72 0.18 55)",
}: {
  tabs: Tab[];
  accentColor?: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex overflow-x-auto border-b mb-4"
        style={{ borderColor: "oklch(0.22 0.015 50)" }}
      >
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-cinzel tracking-wide whitespace-nowrap border-b-2 transition-all duration-200 flex-shrink-0"
              style={{
                borderColor: isActive ? accentColor : "transparent",
                color: isActive ? accentColor : "oklch(0.78 0.010 60)",
                background: isActive ? `${accentColor}08` : "transparent",
              }}
            >
              {Icon && <Icon size={12} color={isActive ? accentColor : "oklch(0.74 0.010 60)"} />}
              {tab.label}
            </button>
          );
        })}
      </div>
      {/* Active content */}
      <div className="animate-in fade-in duration-200">
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────
export function Carousel({
  children,
  accentColor = "oklch(0.72 0.18 55)",
  itemWidth = 200,
}: {
  children: React.ReactNode[];
  accentColor?: string;
  itemWidth?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amount = itemWidth * 2 + 16;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(() => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, 350);
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full flex items-center justify-center -translate-x-3 shadow-lg"
          style={{ background: "oklch(0.14 0.012 30)", border: `1px solid ${accentColor}44`, color: accentColor }}
        >
          <ChevronLeft size={14} />
        </button>
      )}
      {/* Track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children.map((child, i) => (
          <div key={i} className="flex-shrink-0" style={{ width: itemWidth }}>
            {child}
          </div>
        ))}
      </div>
      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full flex items-center justify-center translate-x-3 shadow-lg"
          style={{ background: "oklch(0.14 0.012 30)", border: `1px solid ${accentColor}44`, color: accentColor }}
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

// ─── StatBar ──────────────────────────────────────────────────────────────────
export function StatBar({
  label,
  value,
  max = 100,
  color = "oklch(0.72 0.18 55)",
  suffix = "",
  sublabel,
}: {
  label: string;
  value: number;
  max?: number;
  color?: string;
  suffix?: string;
  sublabel?: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.72 0.010 60)" }}>
          {label}
        </span>
        <span className="text-xs font-bold font-mono" style={{ color }}>
          {value}{suffix}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "oklch(0.18 0.012 30)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 6px ${color}66`,
          }}
        />
      </div>
      {sublabel && (
        <p className="text-xs mt-0.5" style={{ color: "oklch(0.74 0.010 60)" }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}

// ─── RatingDots ───────────────────────────────────────────────────────────────
export function RatingDots({
  label,
  value,
  max = 5,
  color = "oklch(0.72 0.18 55)",
}: {
  label: string;
  value: number;
  max?: number;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: "oklch(0.60 0.010 60)" }}>{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: i < value ? color : "oklch(0.22 0.015 50)",
              boxShadow: i < value ? `0 0 4px ${color}88` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── ItemPill ─────────────────────────────────────────────────────────────────
export function ItemPill({
  name,
  rarity = "legendary",
}: {
  name: string;
  rarity?: "legendary" | "set" | "rare";
}) {
  const colors = {
    legendary: { bg: "oklch(0.72 0.18 55 / 0.12)", text: "oklch(0.78 0.18 55)", border: "oklch(0.72 0.18 55 / 0.4)" },
    set: { bg: "oklch(0.65 0.18 145 / 0.12)", text: "oklch(0.70 0.18 145)", border: "oklch(0.65 0.18 145 / 0.4)" },
    rare: { bg: "oklch(0.80 0.18 95 / 0.12)", text: "oklch(0.80 0.18 95)", border: "oklch(0.80 0.18 95 / 0.4)" },
  };
  const c = colors[rarity];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-sm"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.02em" }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.text }} />
      {name}
    </span>
  );
}

// ─── BuildCard (compact) ──────────────────────────────────────────────────────
export function CompactBuildCard({
  build,
  accentColor,
}: {
  build: { name: string; tier: "S" | "A" | "B"; playstyle: string; description: string; keyItems: string[] };
  accentColor: string;
}) {
  const tierColors = { S: accentColor, A: "oklch(0.70 0.18 145)", B: "oklch(0.70 0.18 260)" };
  const tc = tierColors[build.tier];

  return (
    <div
      className="rounded border h-full flex flex-col"
      style={{
        background: "oklch(0.10 0.010 30)",
        borderColor: build.tier === "S" ? `${accentColor}55` : "oklch(0.22 0.015 50)",
        boxShadow: build.tier === "S" ? `0 0 16px ${accentColor}12` : "none",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{ borderColor: "oklch(0.18 0.012 30)" }}
      >
        <span
          className="text-xs font-black px-2 py-0.5 rounded-sm flex-shrink-0"
          style={{ background: `${tc}22`, color: tc, border: `1px solid ${tc}44`, fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}
        >
          {build.tier}
        </span>
        <h3 className="font-cinzel font-bold text-xs leading-tight flex-1 min-w-0" style={{ color: "oklch(0.88 0.01 60)" }}>
          {build.name}
        </h3>
      </div>

      {/* Body */}
      <div className="p-3 flex-1 flex flex-col gap-2">
        <span
          className="text-xs px-2 py-0.5 rounded-sm self-start"
          style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.80 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}
        >
          {build.playstyle}
        </span>
        <p className="text-xs leading-relaxed" style={{ color: "oklch(0.60 0.010 60)" }}>
          {build.description.slice(0, 100)}…
        </p>

        {/* Key items */}
        <div className="flex flex-wrap gap-1 mt-auto pt-2">
          {build.keyItems.slice(0, 3).map((item) => (
            <ItemPill key={item} name={item.split(" ").slice(0, 3).join(" ")} rarity={item.includes("(") ? "set" : "legendary"} />
          ))}
          {build.keyItems.length > 3 && (
            <span className="text-xs self-center" style={{ color: "oklch(0.74 0.010 60)" }}>
              +{build.keyItems.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AbilityCard (compact) ────────────────────────────────────────────────────
export function CompactAbilityCard({
  ability,
  accentColor,
}: {
  ability: { name: string; type: string; element?: string; description: string; keybind?: string; keybindNote?: string };
  accentColor: string;
}) {
  const ELEMENT_COLORS: Record<string, string> = {
    Physical: "#a0a0a0", Fire: "#ff6b35", Lightning: "#7eb8f7",
    Cold: "#7ecef7", Holy: "#ffe082", Poison: "#81c784", Arcane: "#ce93d8",
  };
  const TYPE_COLORS: Record<string, string> = {
    Primary: "#66bb6a", Secondary: "#42a5f5", "Fury Spender": "#ef5350",
    "Arcane Power Spender": "#ce93d8", "Spirit Spender": "#ffb74d",
    "Mana Spender": "#4db6ac", "Hatred Spender": "#ab47bc",
    Technique: "#78909c", Shout: "#ffd54f", Warcry: "#ffd54f",
    Conviction: "#ffe082", Laws: "#fff176", Defensive: "#4fc3f7",
    Utility: "#80cbc4", Archery: "#ff8a65", Discipline: "#9575cd",
    Focus: "#ffcc02", Corpses: "#a5d6a7", Reanimation: "#c8e6c9",
    "Blood & Bone": "#ef9a9a", Terror: "#b39ddb", Voodoo: "#80deea",
    Decay: "#a5d6a7", Techniques: "#ffb74d", Devices: "#78909c",
  };

  const elemColor = ELEMENT_COLORS[ability.element || ""] || "#888";
  const typeColor = TYPE_COLORS[ability.type] || "#888";

  return (
    <div
      className="p-3 rounded border h-full flex flex-col gap-2"
      style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
    >
      {/* Name + keybind */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-cinzel font-bold text-xs" style={{ color: "oklch(0.88 0.01 60)" }}>
          {ability.name}
        </span>
        {ability.keybind && (
          <span
            className="inline-flex items-center justify-center min-w-[1.8rem] h-4 px-1 rounded text-xs font-bold flex-shrink-0"
            style={{ background: "oklch(0.16 0.015 30)", color: accentColor, border: `1px solid ${accentColor}55`, fontFamily: "'Courier New', monospace", fontSize: "0.6rem" }}
          >
            {ability.keybind}
          </span>
        )}
      </div>

      {/* Type + element badges */}
      <div className="flex gap-1 flex-wrap">
        <span
          className="text-xs px-1.5 py-0.5 rounded-sm"
          style={{ background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}33`, fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}
        >
          {ability.type}
        </span>
        {ability.element && ability.element !== "None" && (
          <span
            className="text-xs px-1.5 py-0.5 rounded-sm"
            style={{ background: `${elemColor}18`, color: elemColor, border: `1px solid ${elemColor}33`, fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}
          >
            {ability.element}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed flex-1" style={{ color: "oklch(0.82 0.010 60)" }}>
        {ability.description.slice(0, 90)}{ability.description.length > 90 ? "…" : ""}
      </p>

      {/* Bind note */}
      {ability.keybindNote && (
        <p className="text-xs border-t pt-1.5" style={{ color: "oklch(0.74 0.010 60)", borderColor: "oklch(0.18 0.012 30)" }}>
          <span style={{ color: accentColor, fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.05em" }}>BIND </span>
          {ability.keybindNote.slice(0, 70)}{ability.keybindNote.length > 70 ? "…" : ""}
        </p>
      )}
    </div>
  );
}

// ─── ParagonBar group ─────────────────────────────────────────────────────────
export function ParagonCategory({
  category,
  stats,
  color,
}: {
  category: string;
  stats: { name: string; max: string; priority: number; notes: string }[];
  color: string;
}) {
  return (
    <div
      className="p-4 rounded border"
      style={{ background: "oklch(0.10 0.010 30)", borderColor: `${color}33` }}
    >
      <h4 className="font-cinzel font-bold text-sm mb-3" style={{ color }}>
        {category}
      </h4>
      <div className="space-y-2">
        {stats.map((stat, i) => (
          <div key={stat.name}>
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `${color}22`, color, fontSize: "0.5rem" }}
                >
                  {i + 1}
                </span>
                <span className="text-xs font-cinzel" style={{ color: "oklch(0.78 0.01 60)" }}>
                  {stat.name}
                </span>
              </div>
              <span className="text-xs font-mono" style={{ color: `${color}cc`, fontSize: "0.6rem" }}>
                {stat.max}
              </span>
            </div>
            <div className="h-1 rounded-full ml-5.5 overflow-hidden" style={{ background: "oklch(0.18 0.012 30)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${((stat.priority === 1 ? 100 : stat.priority === 2 ? 75 : stat.priority === 3 ? 50 : 30))}%`,
                  background: `linear-gradient(90deg, ${color}55, ${color})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
