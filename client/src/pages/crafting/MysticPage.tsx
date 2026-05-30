// Sanctuary Grimoire — Mystic Page
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mysticGuide } from "@/data/systems";
import { Star, Sparkles } from "lucide-react";

const ACCENT = "#ce93d8";

export default function MysticPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        className="pt-14 pb-10 border-b"
        style={{
          background: "linear-gradient(135deg, oklch(0.07 0.008 30) 0%, oklch(0.09 0.015 300) 100%)",
          borderColor: "oklch(0.22 0.015 50)",
        }}
      >
        <div className="container mx-auto px-4 lg:px-8 pt-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded flex items-center justify-center"
              style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44` }}
            >
              <Star size={24} color={ACCENT} />
            </div>
            <div>
              <p className="section-header mb-1">Artisan</p>
              <h1 className="font-cinzel-decorative font-black text-2xl md:text-3xl" style={{ color: ACCENT }}>
                The Mystic
              </h1>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "oklch(0.65 0.010 60)" }}>
            {mysticGuide.overview}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-10 space-y-12">

        {/* Enchanting */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} color={ACCENT} />
            <h2 className="font-cinzel font-bold text-lg" style={{ color: "oklch(0.90 0.01 60)" }}>
              Enchanting
            </h2>
          </div>
          <div
            className="p-5 rounded border-l-2 mb-6 max-w-3xl"
            style={{ background: `${ACCENT}08`, borderColor: ACCENT }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>
              {mysticGuide.enchantingGuide.description}
            </p>
          </div>

          <h3 className="font-cinzel font-bold text-base mb-3" style={{ color: "oklch(0.90 0.01 60)" }}>
            Enchanting Tips
          </h3>
          <div className="space-y-3 max-w-2xl mb-8">
            {mysticGuide.enchantingGuide.tips.map((tip, i) => (
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

          <h3 className="font-cinzel font-bold text-base mb-3" style={{ color: "oklch(0.90 0.01 60)" }}>
            Priority Stats by Slot
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {mysticGuide.enchantingGuide.priorityStats.map((slot) => (
              <div
                key={slot.slot}
                className="p-4 rounded border"
                style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
              >
                <h4 className="font-cinzel font-bold text-xs mb-2" style={{ color: ACCENT }}>
                  {slot.slot}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(0.62 0.010 60)" }}>
                  {slot.priority}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Transmogrification */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star size={18} color={ACCENT} />
            <h2 className="font-cinzel font-bold text-lg" style={{ color: "oklch(0.90 0.01 60)" }}>
              Transmogrification
            </h2>
          </div>
          <div
            className="p-5 rounded border-l-2 mb-6 max-w-3xl"
            style={{ background: `${ACCENT}08`, borderColor: ACCENT }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>
              {mysticGuide.transmogrificationGuide.description}
            </p>
          </div>

          <div className="space-y-3 max-w-2xl">
            {mysticGuide.transmogrificationGuide.tips.map((tip, i) => (
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
      </div>

      <Footer />
    </div>
  );
}
