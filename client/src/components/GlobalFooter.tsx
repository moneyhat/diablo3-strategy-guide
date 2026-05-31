// Sanctuary Grimoire — Global Footer
import { Link } from "wouter";
import { classes } from "@/data/classes";
import { Map, Hammer, BookOpen, Sword, Zap, ExternalLink } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Classes",
    icon: <Sword size={12} />,
    links: classes.map((cls) => ({ label: cls.name, href: `/guide/${cls.id}` })),
  },
  {
    title: "Skills & Builds",
    icon: <Zap size={12} />,
    links: classes.map((cls) => ({ label: `${cls.name} Builds`, href: `/skills/${cls.id}` })),
  },
  {
    title: "Crafting",
    icon: <Hammer size={12} />,
    links: [
      { label: "Blacksmith", href: "/crafting/blacksmith" },
      { label: "Jeweler & Gems", href: "/crafting/jeweler" },
      { label: "Mystic (Enchanting)", href: "/crafting/mystic" },
    ],
  },
  {
    title: "Game Systems",
    icon: <BookOpen size={12} />,
    links: [
      { label: "Kanai's Cube", href: "/systems/kanais-cube" },
      { label: "Paragon System", href: "/systems/paragon" },
      { label: "Seasons", href: "/systems/seasons" },
      { label: "Interactive Maps", href: "/maps" },
    ],
  },
];

export default function GlobalFooter() {
  return (
    <footer
      className="border-t mt-12"
      style={{
        background: "oklch(0.06 0.008 30)",
        borderColor: "oklch(0.72 0.18 55 / 0.2)",
      }}
    >
      {/* ── Main footer content ── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #8b0000, #c0392b)",
                  boxShadow: "0 0 16px #c0392b55",
                  border: "1px solid #c0392b44",
                }}
              >
                <span style={{ fontSize: "18px" }}>🔥</span>
              </div>
              <div>
                <p className="font-cinzel-decorative font-black text-base leading-none"
                  style={{ color: "oklch(0.78 0.18 55)" }}>
                  DIABLO III
                </p>
                <p className="font-cinzel tracking-widest"
                  style={{ fontSize: "0.52rem", color: "oklch(0.72 0.010 60)", letterSpacing: "0.2em" }}>
                  STRATEGY GUIDE
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-4"
              style={{ color: "oklch(0.76 0.010 60)", fontFamily: "'Cinzel', serif" }}>
              The definitive resource for pushing the absolute ceiling of Diablo III. Class guides, meta builds, interactive maps, and everything you need to dominate Sanctuary.
            </p>
            <Link href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded font-cinzel font-bold text-xs tracking-wide"
              style={{ background: "oklch(0.72 0.18 55)", color: "oklch(0.08 0 0)" }}>
              <Sword size={11} /> Start Your Guide
            </Link>
          </div>

          {/* Nav columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-1.5 mb-3">
                <span style={{ color: "oklch(0.72 0.18 55)" }}>{section.icon}</span>
                <h4 className="font-cinzel font-bold text-xs tracking-widest"
                  style={{ color: "oklch(0.72 0.18 55)", fontSize: "0.6rem" }}>
                  {section.title.toUpperCase()}
                </h4>
              </div>
              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-xs font-cinzel transition-colors duration-150"
                      style={{ color: "oklch(0.76 0.010 60)" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="border-t mb-6" style={{ borderColor: "oklch(0.72 0.18 55 / 0.15)" }} />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-cinzel text-center sm:text-left"
            style={{ color: "oklch(0.32 0.010 60)" }}>
            Diablo III Strategy Guide — Fan-made community resource. Not affiliated with Blizzard Entertainment.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/moneyhat/diablo3-strategy-guide"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-cinzel transition-colors duration-150"
              style={{ color: "oklch(0.72 0.010 60)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.72 0.18 55)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.72 0.010 60)"; }}>
              <ExternalLink size={11} /> GitHub
            </a>
            <Link href="/maps"
              className="flex items-center gap-1.5 text-xs font-cinzel transition-colors duration-150"
              style={{ color: "oklch(0.72 0.010 60)" }}>
              <Map size={11} /> Maps
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
