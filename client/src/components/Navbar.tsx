// Sanctuary Grimoire — Sticky top navigation with class, crafting, and systems dropdowns
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { classes } from "@/data/classes";
import { Menu, X, ChevronDown } from "lucide-react";

const classColors: Record<string, string> = {
  barbarian: "#c0392b",
  crusader: "#f0c040",
  "demon-hunter": "#8e44ad",
  monk: "#e67e22",
  necromancer: "#27ae60",
  "witch-doctor": "#16a085",
  wizard: "#2980b9",
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [craftOpen, setCraftOpen] = useState(false);
  const [sysOpen, setSysOpen] = useState(false);
  const [location] = useLocation();

  const closeAll = () => {
    setClassOpen(false);
    setCraftOpen(false);
    setSysOpen(false);
    setMobileOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: "oklch(0.07 0.008 30 / 0.97)",
        borderColor: "oklch(0.22 0.015 50)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" onClick={closeAll}>
            <span
              className="font-cinzel-decorative text-lg font-bold tracking-wider"
              style={{ color: "oklch(0.78 0.18 55)" }}
            >
              D3 Guide
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Classes Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-cinzel tracking-wide transition-colors"
                style={{ color: classOpen ? "oklch(0.78 0.18 55)" : "oklch(0.75 0.01 60)" }}
                onMouseEnter={() => { setClassOpen(true); setCraftOpen(false); setSysOpen(false); }}
                onMouseLeave={() => setClassOpen(false)}
              >
                Classes <ChevronDown size={14} />
              </button>
              {classOpen && (
                <div
                  className="absolute top-full left-0 w-52 py-1 rounded border shadow-xl"
                  style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
                  onMouseEnter={() => setClassOpen(true)}
                  onMouseLeave={() => setClassOpen(false)}
                >
                  {classes.map((cls) => (
                    <Link
                      key={cls.id}
                      href={`/class/${cls.id}`}
                      onClick={closeAll}
                    >
                      <div
                        className="flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-white/5"
                        style={{ color: "oklch(0.85 0.01 60)" }}
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: classColors[cls.id] }}
                        />
                        <span className="font-cinzel text-xs tracking-wide">{cls.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Crafting Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-cinzel tracking-wide transition-colors"
                style={{ color: craftOpen ? "oklch(0.78 0.18 55)" : "oklch(0.75 0.01 60)" }}
                onMouseEnter={() => { setCraftOpen(true); setClassOpen(false); setSysOpen(false); }}
                onMouseLeave={() => setCraftOpen(false)}
              >
                Crafting <ChevronDown size={14} />
              </button>
              {craftOpen && (
                <div
                  className="absolute top-full left-0 w-44 py-1 rounded border shadow-xl"
                  style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
                  onMouseEnter={() => setCraftOpen(true)}
                  onMouseLeave={() => setCraftOpen(false)}
                >
                  {[
                    { href: "/crafting/blacksmith", label: "Blacksmith" },
                    { href: "/crafting/jeweler", label: "Jeweler" },
                    { href: "/crafting/mystic", label: "Mystic" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeAll}>
                      <div
                        className="px-4 py-2 text-sm font-cinzel tracking-wide transition-colors hover:bg-white/5"
                        style={{ color: "oklch(0.85 0.01 60)" }}
                      >
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Systems Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-cinzel tracking-wide transition-colors"
                style={{ color: sysOpen ? "oklch(0.78 0.18 55)" : "oklch(0.75 0.01 60)" }}
                onMouseEnter={() => { setSysOpen(true); setClassOpen(false); setCraftOpen(false); }}
                onMouseLeave={() => setSysOpen(false)}
              >
                Systems <ChevronDown size={14} />
              </button>
              {sysOpen && (
                <div
                  className="absolute top-full left-0 w-44 py-1 rounded border shadow-xl"
                  style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
                  onMouseEnter={() => setSysOpen(true)}
                  onMouseLeave={() => setSysOpen(false)}
                >
                  {[
                    { href: "/systems/kanais-cube", label: "Kanai's Cube" },
                    { href: "/systems/seasons", label: "Seasons" },
                    { href: "/systems/paragon", label: "Paragon" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeAll}>
                      <div
                        className="px-4 py-2 text-sm font-cinzel tracking-wide transition-colors hover:bg-white/5"
                        style={{ color: "oklch(0.85 0.01 60)" }}
                      >
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2"
            style={{ color: "oklch(0.75 0.01 60)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
        >
          <div className="px-4 py-3">
            <p className="section-header mb-2">Classes</p>
            <div className="grid grid-cols-2 gap-1 mb-4">
              {classes.map((cls) => (
                <Link key={cls.id} href={`/class/${cls.id}`} onClick={closeAll}>
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded text-sm"
                    style={{ color: "oklch(0.85 0.01 60)" }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: classColors[cls.id] }} />
                    <span className="font-cinzel text-xs">{cls.name}</span>
                  </div>
                </Link>
              ))}
            </div>
            <p className="section-header mb-2">Crafting</p>
            <div className="flex flex-col gap-1 mb-4">
              {[
                { href: "/crafting/blacksmith", label: "Blacksmith" },
                { href: "/crafting/jeweler", label: "Jeweler" },
                { href: "/crafting/mystic", label: "Mystic" },
              ].map((item) => (
                <Link key={item.href} href={item.href} onClick={closeAll}>
                  <div className="px-3 py-2 text-sm font-cinzel tracking-wide" style={{ color: "oklch(0.85 0.01 60)" }}>
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
            <p className="section-header mb-2">Systems</p>
            <div className="flex flex-col gap-1">
              {[
                { href: "/systems/kanais-cube", label: "Kanai's Cube" },
                { href: "/systems/seasons", label: "Seasons" },
                { href: "/systems/paragon", label: "Paragon" },
              ].map((item) => (
                <Link key={item.href} href={item.href} onClick={closeAll}>
                  <div className="px-3 py-2 text-sm font-cinzel tracking-wide" style={{ color: "oklch(0.85 0.01 60)" }}>
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
