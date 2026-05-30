// Sanctuary Grimoire — Paragon Page
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { paragonGuide } from "@/data/systems";
import { BookOpen } from "lucide-react";

const ACCENT = "#42a5f5";

const CATEGORY_COLORS: Record<string, string> = {
  Core: "#ffb74d",
  Offense: "#ef5350",
  Defense: "#42a5f5",
  Utility: "#66bb6a",
};

export default function ParagonPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        className="pt-14 pb-10 border-b"
        style={{
          background: "linear-gradient(135deg, oklch(0.07 0.008 30) 0%, oklch(0.08 0.015 220) 100%)",
          borderColor: "oklch(0.22 0.015 50)",
        }}
      >
        <div className="container mx-auto px-4 lg:px-8 pt-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded flex items-center justify-center"
              style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44` }}
            >
              <BookOpen size={24} color={ACCENT} />
            </div>
            <div>
              <p className="section-header mb-1">Endgame System</p>
              <h1 className="font-cinzel-decorative font-black text-2xl md:text-3xl" style={{ color: ACCENT }}>
                Paragon System
              </h1>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "oklch(0.65 0.010 60)" }}>
            {paragonGuide.overview}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-10 space-y-12">

        {/* Categories */}
        <section>
          <h2 className="font-cinzel font-bold text-lg mb-6" style={{ color: "oklch(0.90 0.01 60)" }}>
            Paragon Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paragonGuide.categories.map((cat) => {
              const c = CATEGORY_COLORS[cat.name] || ACCENT;
              return (
                <div
                  key={cat.name}
                  className="p-5 rounded border"
                  style={{ background: "oklch(0.10 0.010 30)", borderColor: `${c}44` }}
                >
                  <h3 className="font-cinzel font-bold text-base mb-2" style={{ color: c }}>
                    {cat.name}
                  </h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "oklch(0.60 0.010 60)" }}>
                    {cat.description}
                  </p>
                  <div className="space-y-2">
                    {cat.stats.map((stat) => (
                      <div
                        key={stat.name}
                        className="flex items-start gap-3 p-3 rounded border"
                        style={{ background: "oklch(0.12 0.010 30)", borderColor: "oklch(0.20 0.012 30)" }}
                      >
                        <div
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: `${c}22`, color: c, border: `1px solid ${c}44`, fontSize: "0.55rem" }}
                        >
                          {stat.priority}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold font-cinzel" style={{ color: "oklch(0.85 0.01 60)" }}>
                              {stat.name}
                            </span>
                            <span
                              className="text-xs px-1.5 py-0.5 rounded-sm"
                              style={{
                                background: `${c}12`, color: c,
                                border: `1px solid ${c}25`,
                                fontFamily: "'Cinzel', serif", fontSize: "0.55rem",
                              }}
                            >
                              {stat.max}
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: "oklch(0.52 0.010 60)" }}>{stat.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Farming Tips */}
        <section>
          <h2 className="font-cinzel font-bold text-lg mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
            Paragon Farming Tips
          </h2>
          <div className="space-y-3 max-w-2xl">
            {paragonGuide.farmingTips.map((tip, i) => (
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

        {/* Quick Reference */}
        <section>
          <h2 className="font-cinzel font-bold text-lg mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
            Universal Allocation Priority
          </h2>
          <div
            className="p-5 rounded border-l-2 max-w-2xl"
            style={{ background: `${ACCENT}08`, borderColor: ACCENT }}
          >
            <ol className="space-y-2">
              {[
                "Core → Movement Speed to 25% cap (50 points)",
                "Offense → Critical Hit Damage (50 points)",
                "Offense → Critical Hit Chance (50 points)",
                "Defense → Armor, Life %, All Resistance (50 points each)",
                "Utility → Area Damage (50 points)",
                "Utility → Resource Cost Reduction (50 points)",
                "Core → Primary Stat (all remaining points — infinite scaling)",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "oklch(0.72 0.010 60)" }}>
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `${ACCENT}22`, color: ACCENT, border: `1px solid ${ACCENT}44`, fontSize: "0.6rem" }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
