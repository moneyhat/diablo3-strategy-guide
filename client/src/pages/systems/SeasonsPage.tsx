// Sanctuary Grimoire — Seasons Page
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { seasonsGuide } from "@/data/systems";
import { Calendar } from "lucide-react";

const ACCENT = "#66bb6a";

export default function SeasonsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        className="pt-14 pb-10 border-b"
        style={{
          background: "linear-gradient(135deg, oklch(0.07 0.008 30) 0%, oklch(0.08 0.015 145) 100%)",
          borderColor: "oklch(0.22 0.015 50)",
        }}
      >
        <div className="container mx-auto px-4 lg:px-8 pt-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded flex items-center justify-center"
              style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44` }}
            >
              <Calendar size={24} color={ACCENT} />
            </div>
            <div>
              <p className="section-header mb-1">Endgame System</p>
              <h1 className="font-cinzel-decorative font-black text-2xl md:text-3xl" style={{ color: ACCENT }}>
                Seasons
              </h1>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "oklch(0.65 0.010 60)" }}>
            {seasonsGuide.overview}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-10 space-y-12">

        {/* How They Work */}
        <section>
          <h2 className="font-cinzel font-bold text-lg mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
            How Seasons Work
          </h2>
          <div className="space-y-3 max-w-2xl">
            {seasonsGuide.howTheyWork.map((point, i) => (
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
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>{point}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Season Journey */}
        <section>
          <h2 className="font-cinzel font-bold text-lg mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
            Season Journey Chapters
          </h2>
          <div className="space-y-3">
            {seasonsGuide.journeyChapters.map((chapter, i) => (
              <div
                key={chapter.chapter}
                className="p-5 rounded border"
                style={{
                  background: "oklch(0.10 0.010 30)",
                  borderColor: i < 4 ? `${ACCENT}44` : "oklch(0.22 0.015 50)",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <h3 className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.90 0.01 60)" }}>
                    {chapter.chapter}
                  </h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-sm"
                    style={{
                      background: `${ACCENT}18`, color: ACCENT,
                      border: `1px solid ${ACCENT}33`,
                      fontFamily: "'Cinzel', serif", fontSize: "0.6rem",
                    }}
                  >
                    {chapter.rewards}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(0.62 0.010 60)" }}>
                  {chapter.objectives}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Fast Start Guide */}
        <section>
          <h2 className="font-cinzel font-bold text-lg mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
            Season Fast-Start Guide
          </h2>
          <div className="space-y-3 max-w-2xl">
            {seasonsGuide.fastStartGuide.map((step, i) => (
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
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conquests */}
        <section>
          <h2 className="font-cinzel font-bold text-lg mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
            Conquests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seasonsGuide.conquests.map((conquest) => (
              <div
                key={conquest.name}
                className="p-4 rounded border"
                style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
              >
                <h3 className="font-cinzel font-bold text-sm mb-2" style={{ color: ACCENT }}>
                  {conquest.name}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(0.62 0.010 60)" }}>
                  {conquest.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
