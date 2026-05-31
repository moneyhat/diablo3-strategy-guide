// Sanctuary Grimoire — Global Navigation
// Bold branded header + persistent nav + dropdown menus
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { classes } from "@/data/classes";
import { CLASS_SIGILS } from "@/components/Icons";
import {
  ChevronDown, Map, Sword, Zap, Shield, BookOpen,
  Hammer, Gem, Wand2, Menu, X
} from "lucide-react";

// ─── Nav structure ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: "Classes",
    icon: <Sword size={14} />,
    dropdown: classes.map((cls) => ({
      label: cls.name,
      href: `/guide/${cls.id}`,
      color: cls.color,
    })),
  },
  {
    label: "Skills & Builds",
    icon: <Zap size={14} />,
    dropdown: classes.map((cls) => ({
      label: `${cls.name} Builds`,
      href: `/skills/${cls.id}`,
      color: cls.color,
    })),
  },
  {
    label: "Maps",
    icon: <Map size={14} />,
    dropdown: [
      { label: "World Map", href: "/maps", color: "#d4a843" },
      { label: "New Tristram", href: "/maps/town/act1", color: "#8b0000" },
      { label: "Hidden Camp", href: "/maps/town/act2", color: "#c8860a" },
      { label: "Bastion's Keep", href: "/maps/town/act3", color: "#c0392b" },
      { label: "Diamond Gates", href: "/maps/town/act4", color: "#5b9bd5" },
      { label: "Survivors' Enclave", href: "/maps/town/act5", color: "#8e44ad" },
    ],
  },
      { label: "Crafting",
      icon: <Hammer size={14} />,
      dropdown: [
        { label: "Mastery Calculator", href: "/crafting/calculator", color: "#ffd54f" },
        { label: "Blacksmith", href: "/crafting/blacksmith", color: "#c89b3c" },
        { label: "Jeweler & Gems", href: "/crafting/jeweler", color: "#42a5f5" },
        { label: "Mystic (Enchanting)", href: "/crafting/mystic", color: "#ce93d8" },
      ],
    },
  {
    label: "Systems",
    icon: <BookOpen size={14} />,
    dropdown: [
      { label: "Kanai's Cube", href: "/systems/kanais-cube", color: "#ffd54f" },
      { label: "Paragon System", href: "/systems/paragon", color: "#ce93d8" },
      { label: "Seasons", href: "/systems/seasons", color: "#66bb6a" },
    ],
  },
];

// ─── Dropdown Menu ────────────────────────────────────────────────────────────
function Dropdown({
  items, onClose,
}: {
  items: { label: string; href: string; color?: string }[];
  onClose: () => void;
}) {
  return (
    <div
      className="absolute top-full left-0 mt-1 rounded border shadow-2xl z-50 min-w-48 py-1 overflow-hidden"
      style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.72 0.18 55 / 0.3)" }}
    >
      {items.map((item) => (
        <Link key={item.href} href={item.href}
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-cinzel tracking-wide transition-all duration-150 hover:bg-white/5"
          style={{ color: item.color || "oklch(0.75 0.010 60)" }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

// ─── Mobile Menu ──────────────────────────────────────────────────────────────
function MobileMenu({ onClose }: { onClose: () => void }) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "oklch(0.07 0.008 30 / 0.98)", backdropFilter: "blur(8px)" }}
    >
      {/* Mobile header */}
      <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: "oklch(0.20 0.015 50)" }}>
        <div>
          <p className="font-cinzel-decorative font-black text-lg" style={{ color: "oklch(0.78 0.18 55)" }}>
            DIABLO III
          </p>
          <p className="text-xs font-cinzel tracking-widest" style={{ color: "oklch(0.74 0.010 60)", fontSize: "0.55rem" }}>
            STRATEGY GUIDE
          </p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded flex items-center justify-center"
          style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.60 0.010 60)" }}>
          <X size={18} />
        </button>
      </div>

      {/* Mobile nav items */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const mobileItem = item as any;
          return (
          <div key={item.label}>
            {mobileItem.href ? (
              <Link href={mobileItem.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded border font-cinzel font-bold text-sm"
                style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.78 0.18 55)" }}>
                {item.icon} {item.label}
              </Link>
            ) : (item.dropdown ? (
              <div>
                <button
                  onClick={() => setOpenSection(openSection === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded border font-cinzel font-bold text-sm"
                  style={{ background: openSection === item.label ? "oklch(0.72 0.18 55 / 0.08)" : "oklch(0.10 0.010 30)", borderColor: openSection === item.label ? "oklch(0.72 0.18 55 / 0.4)" : "oklch(0.22 0.015 50)", color: "oklch(0.78 0.18 55)" }}>
                  <span className="flex items-center gap-3">{item.icon} {item.label}</span>
                  <ChevronDown size={14} style={{ transform: openSection === item.label ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {openSection === item.label && item.dropdown && (
                  <div className="mt-1 ml-4 space-y-0.5">
                    {item.dropdown.map((sub) => (
                      <Link key={sub.href} href={sub.href}
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2.5 rounded text-xs font-cinzel"
                        style={{ color: sub.color || "oklch(0.65 0.010 60)", background: "oklch(0.09 0.008 30)" }}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : null)}
          </div>
          );
        })}
      </div>

      {/* Mobile footer */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "oklch(0.20 0.015 50)" }}>
        <Link href="/"
          onClick={onClose}
          className="flex items-center justify-center gap-2 py-3 rounded font-cinzel font-bold text-sm"
          style={{ background: "oklch(0.72 0.18 55)", color: "oklch(0.08 0 0)" }}>
          Start Your Journey
        </Link>
      </div>
    </div>
  );
}

// ─── Global Navbar ────────────────────────────────────────────────────────────
export default function GlobalNav() {
  const [location] = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeAll = () => setOpenDropdown(null);

  return (
    <>
      <nav
        className="sticky top-0 z-40 w-full border-b"
        style={{
          background: "oklch(0.07 0.008 30 / 0.97)",
          borderColor: "oklch(0.72 0.18 55 / 0.25)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.5)",
        }}
      >
        {/* ── Top brand bar ── */}
        <div
          className="border-b px-4 py-2 flex items-center justify-between"
          style={{ borderColor: "oklch(0.72 0.18 55 / 0.15)" }}
        >
          <Link href="/" className="flex items-center gap-3 group">
              {/* Flame icon */}
              <div
                className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #8b0000, #c0392b)",
                  boxShadow: "0 0 12px #c0392b66",
                  border: "1px solid #c0392b44",
                }}
              >
                <span style={{ fontSize: "16px" }}>🔥</span>
              </div>
              <div>
                <p
                  className="font-cinzel-decorative font-black leading-none"
                  style={{
                    fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                    color: "oklch(0.78 0.18 55)",
                    textShadow: "0 0 20px oklch(0.72 0.18 55 / 0.4)",
                    letterSpacing: "0.05em",
                  }}
                >
                  DIABLO III
                </p>
                <p
                  className="font-cinzel tracking-widest"
                  style={{
                    fontSize: "0.55rem",
                    color: "oklch(0.78 0.010 60)",
                    letterSpacing: "0.2em",
                  }}
                >
                  STRATEGY GUIDE
                </p>
              </div>
          </Link>

          {/* Right side: CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.location.pathname === "/") {
                  document.getElementById("class-picker")?.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  window.location.href = "/#class-picker";
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded font-cinzel font-bold text-xs tracking-wide transition-all duration-200"
              style={{ background: "oklch(0.72 0.18 55)", color: "oklch(0.08 0 0)" }}
            >
              <Sword size={11} /> Start Guide
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-9 h-9 rounded flex items-center justify-center"
              style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.60 0.010 60)", border: "1px solid oklch(0.22 0.015 50)" }}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* ── Navigation bar ── */}
        <div className="hidden md:flex items-center px-4 gap-1 h-10">
          {NAV_ITEMS.map((item) => {
            const isOpen = openDropdown === item.label;
            const itemAny = item as any;
            const isActive = itemAny.href
              ? location === itemAny.href
              : item.dropdown?.some((d) => location.startsWith(d.href.split("/").slice(0, 2).join("/")));

            return (
              <div key={item.label} className="relative">
                {itemAny.href ? (
                  <Link href={itemAny.href}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-cinzel tracking-wide transition-all duration-150"
                    style={{
                      color: isActive ? "oklch(0.78 0.18 55)" : "oklch(0.82 0.010 60)",
                      background: isActive ? "oklch(0.72 0.18 55 / 0.12)" : "transparent",
                      border: isActive ? "1px solid oklch(0.72 0.18 55 / 0.3)" : "1px solid transparent",
                    }}
                  >
                    {item.icon} {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                    onBlur={() => setTimeout(closeAll, 150)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-cinzel tracking-wide transition-all duration-150"
                    style={{
                      color: isOpen || isActive ? "oklch(0.78 0.18 55)" : "oklch(0.82 0.010 60)",
                      background: isOpen || isActive ? "oklch(0.72 0.18 55 / 0.12)" : "transparent",
                      border: isOpen || isActive ? "1px solid oklch(0.72 0.18 55 / 0.3)" : "1px solid transparent",
                    }}
                  >
                    {item.icon} {item.label}
                    <ChevronDown
                      size={11}
                      style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                    />
                  </button>
                )}
                {isOpen && item.dropdown && (
                  <Dropdown items={item.dropdown} onClose={closeAll} />
                )}
              </div>
            );
          })}

          {/* Separator + quick links */}
          <div className="ml-auto flex items-center gap-1">
            <Link href="/maps"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-cinzel tracking-wide transition-all duration-150"
              style={{ color: "oklch(0.80 0.010 60)", border: "1px solid transparent" }}
            >
              <Map size={12} /> Maps
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
    </>
  );
}
