// Sanctuary Grimoire — Jeweler Page
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { jewelerGuide } from "@/data/systems";
import { Gem } from "lucide-react";

const ACCENT = "#4fc3f7";

export default function JewelerPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        className="pt-14 pb-10 border-b"
        style={{
          background: "linear-gradient(135deg, oklch(0.07 0.008 30) 0%, oklch(0.08 0.015 240) 100%)",
          borderColor: "oklch(0.22 0.015 50)",
        }}
      >
        <div className="container mx-auto px-4 lg:px-8 pt-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded flex items-center justify-center"
              style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44` }}
            >
              <Gem size={24} color={ACCENT} />
            </div>
            <div>
              <p className="section-header mb-1">Artisan</p>
              <h1 className="font-cinzel-decorative font-black text-2xl md:text-3xl" style={{ color: ACCENT }}>
                The Jeweler
              </h1>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "oklch(0.65 0.010 60)" }}>
            {jewelerGuide.overview}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-10 space-y-12">

        {/* Leveling Tips */}
        <section>
          <h2 className="font-cinzel font-bold text-lg mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
            Leveling the Jeweler
          </h2>
          <div className="space-y-3 max-w-2xl">
            {jewelerGuide.levelingTips.map((tip, i) => (
              <div
                key={i}
                className="flex gap-3 p-4 rounded border"
                style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
              >
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${ACCENT}22`, color: ACCENT, border: `1px solid ${ACCENT}44` }}
                >
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gem Types */}
        <section>
          <h2 className="font-cinzel font-bold text-lg mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
            Gem Types & Best Uses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jewelerGuide.gemTypes.map((gem) => {
              const gemColors: Record<string, string> = {
                Ruby: "#ef5350", Emerald: "#66bb6a", Amethyst: "#ab47bc",
                Topaz: "#ffd54f", Diamond: "#e0e0e0",
              };
              const c = gemColors[gem.name] || ACCENT;
              return (
                <div
                  key={gem.name}
                  className="p-4 rounded border"
                  style={{ background: "oklch(0.10 0.010 30)", borderColor: `${c}44` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}88` }} />
                    <h3 className="font-cinzel font-bold text-sm" style={{ color: c }}>{gem.name}</h3>
                  </div>
                  <p className="text-xs mb-2 leading-relaxed" style={{ color: "oklch(0.60 0.010 60)" }}>
                    {gem.primaryEffect}
                  </p>
                  <p className="text-xs" style={{ color: "oklch(0.50 0.010 60)" }}>
                    <span style={{ color: ACCENT }}>Best Use: </span>{gem.bestUse}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Legendary Gems */}
        <section>
          <h2 className="font-cinzel font-bold text-lg mb-2" style={{ color: "oklch(0.90 0.01 60)" }}>
            Legendary Gems
          </h2>
          <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.010 60)" }}>
            There are 23 Legendary Gems in Diablo 3. They are obtained by killing Rift Guardians in Greater Rifts and can be upgraded by talking to Urshi after completing a GR within the time limit.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jewelerGuide.legendaryGems.map((gem) => (
              <div
                key={gem.name}
                className="p-4 rounded border"
                style={{
                  background: "oklch(0.10 0.010 30)",
                  borderColor: "oklch(0.72 0.18 55 / 0.35)",
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-cinzel font-bold text-sm text-legendary">{gem.name}</h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-sm flex-shrink-0"
                    style={{
                      background: "oklch(0.72 0.18 55 / 0.12)",
                      color: "oklch(0.78 0.18 55)",
                      border: "1px solid oklch(0.72 0.18 55 / 0.35)",
                      fontFamily: "'Cinzel', serif", fontSize: "0.6rem",
                    }}
                  >
                    Max Rank {gem.rankCap}
                  </span>
                </div>
                <p className="text-xs mb-1" style={{ color: "oklch(0.68 0.010 60)" }}>
                  <span style={{ color: "oklch(0.78 0.18 55)" }}>Primary: </span>{gem.primaryEffect}
                </p>
                <p className="text-xs mb-2" style={{ color: "oklch(0.58 0.010 60)" }}>
                  <span style={{ color: "oklch(0.65 0.18 145)" }}>Rank 25: </span>{gem.secondaryEffect}
                </p>
                <p className="text-xs" style={{ color: "oklch(0.50 0.010 60)" }}>
                  <span style={{ color: ACCENT }}>Best Use: </span>{gem.bestUse}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Socketing Guide */}
        <section>
          <h2 className="font-cinzel font-bold text-lg mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
            Socketing Guide
          </h2>
          <div
            className="p-5 rounded border-l-2 max-w-2xl"
            style={{ background: `${ACCENT}08`, borderColor: ACCENT }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>
              {jewelerGuide.socketingGuide}
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
