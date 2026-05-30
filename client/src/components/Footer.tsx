// Sanctuary Grimoire — Footer
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer
      className="border-t mt-20"
      style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.07 0.008 30)" }}
    >
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3
              className="font-cinzel-decorative text-base font-bold mb-3"
              style={{ color: "oklch(0.78 0.18 55)" }}
            >
              D3 Strategy Guide
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.55 0.015 60)" }}>
              A comprehensive guide to mastering Diablo 3 — from your first steps in New Tristram to pushing the highest Greater Rifts.
            </p>
          </div>
          <div>
            <h4 className="section-header mb-3">Classes</h4>
            <div className="grid grid-cols-2 gap-1">
              {["barbarian", "crusader", "demon-hunter", "monk", "necromancer", "witch-doctor", "wizard"].map((id) => (
                <Link key={id} href={`/class/${id}`}>
                  <span
                    className="text-xs font-cinzel tracking-wide capitalize hover:text-legendary transition-colors"
                    style={{ color: "oklch(0.55 0.015 60)" }}
                  >
                    {id.replace("-", " ")}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="section-header mb-3">Systems & Crafting</h4>
            <div className="flex flex-col gap-1">
              {[
                { href: "/crafting/blacksmith", label: "Blacksmith" },
                { href: "/crafting/jeweler", label: "Jeweler" },
                { href: "/crafting/mystic", label: "Mystic" },
                { href: "/systems/kanais-cube", label: "Kanai's Cube" },
                { href: "/systems/seasons", label: "Seasons" },
                { href: "/systems/paragon", label: "Paragon" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className="text-xs font-cinzel tracking-wide hover:text-legendary transition-colors"
                    style={{ color: "oklch(0.55 0.015 60)" }}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="divider-gold" />
        <p className="text-center text-xs" style={{ color: "oklch(0.40 0.010 60)" }}>
          This guide is a fan-made resource. Diablo 3 is a trademark of Blizzard Entertainment.
        </p>
      </div>
    </footer>
  );
}
