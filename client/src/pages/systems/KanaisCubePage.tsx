// Sanctuary Grimoire — Kanai's Cube Page
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { kanaisCubeGuide } from "@/data/systems";
import { Flame } from "lucide-react";

const ACCENT = "#ff7043";

export default function KanaisCubePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        className="pt-14 pb-10 border-b"
        style={{
          background: "linear-gradient(135deg, oklch(0.07 0.008 30) 0%, oklch(0.10 0.018 30) 100%)",
          borderColor: "oklch(0.22 0.015 50)",
        }}
      >
        <div className="container mx-auto px-4 lg:px-8 pt-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded flex items-center justify-center"
              style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44` }}
            >
              <Flame size={24} color={ACCENT} />
            </div>
            <div>
              <p className="section-header mb-1">Endgame System</p>
              <h1 className="font-cinzel-decorative font-black text-2xl md:text-3xl" style={{ color: ACCENT }}>
                Kanai's Cube
              </h1>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-2xl mb-3" style={{ color: "oklch(0.65 0.010 60)" }}>
            {kanaisCubeGuide.overview}
          </p>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-xs"
            style={{ background: `${ACCENT}12`, borderColor: `${ACCENT}44`, color: ACCENT }}
          >
            <span className="font-cinzel tracking-wide">Location:</span>
            <span style={{ color: "oklch(0.72 0.010 60)" }}>{kanaisCubeGuide.location}</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-10">
        <h2 className="font-cinzel font-bold text-lg mb-6" style={{ color: "oklch(0.90 0.01 60)" }}>
          Cube Recipes
        </h2>
        <div className="space-y-6">
          {kanaisCubeGuide.recipes.map((recipe, i) => (
            <div
              key={recipe.name}
              className="p-6 rounded border"
              style={{
                background: "oklch(0.10 0.010 30)",
                borderColor: i === 4 ? `${ACCENT}55` : "oklch(0.22 0.015 50)", // Highlight Caldesann's
              }}
            >
              <h3 className="font-cinzel font-bold text-base mb-3" style={{ color: "oklch(0.90 0.01 60)" }}>
                {recipe.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="section-header mb-2">Ingredients</p>
                  <ul className="space-y-1">
                    {recipe.ingredients.map((ing, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs" style={{ color: "oklch(0.62 0.010 60)" }}>
                        <span style={{ color: ACCENT }}>·</span> {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <p className="section-header mb-2">Effect</p>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "oklch(0.72 0.010 60)" }}>
                    {recipe.effect}
                  </p>
                  <div
                    className="p-3 rounded border-l-2"
                    style={{ background: `${ACCENT}08`, borderColor: ACCENT }}
                  >
                    <p className="text-xs leading-relaxed" style={{ color: "oklch(0.65 0.010 60)" }}>
                      <span className="font-cinzel text-xs tracking-wide" style={{ color: ACCENT }}>Tip: </span>
                      {recipe.tips}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
