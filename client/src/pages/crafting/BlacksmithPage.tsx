// Sanctuary Grimoire — Blacksmith Page
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blacksmithGuide, craftingMaterials } from "@/data/systems";
import { Sword, Package } from "lucide-react";

const ACCENT = "#c89b3c";

export default function BlacksmithPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section
        className="pt-14 pb-10 border-b"
        style={{
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663366635630/Yxk9jCSLASZ3Pr5PiwqTMZ/hero-crafting-BmDoSywrrJgdYU9YM4FoB6.webp'), linear-gradient(135deg, oklch(0.07 0.008 30) 0%, oklch(0.10 0.015 45) 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          backgroundBlendMode: "overlay",
          borderColor: "oklch(0.22 0.015 50)",
        }}
      >
        <div className="container mx-auto px-4 lg:px-8 pt-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded flex items-center justify-center"
              style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}44` }}
            >
              <Sword size={24} color={ACCENT} />
            </div>
            <div>
              <p className="section-header mb-1">Artisan</p>
              <h1
                className="font-cinzel-decorative font-black text-2xl md:text-3xl"
                style={{ color: ACCENT }}
              >
                The Blacksmith
              </h1>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "oklch(0.65 0.010 60)" }}>
            {blacksmithGuide.overview}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Leveling Tips */}
            <section>
              <h2 className="font-cinzel font-bold text-lg mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
                Leveling the Blacksmith
              </h2>
              <div className="space-y-3">
                {blacksmithGuide.levelingTips.map((tip, i) => (
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

            {/* Key Recipes */}
            <section>
              <h2 className="font-cinzel font-bold text-lg mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
                Key Recipes
              </h2>
              <div className="space-y-4">
                {blacksmithGuide.keyRecipes.map((recipe) => (
                  <div
                    key={recipe.name}
                    className="p-5 rounded border"
                    style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.90 0.01 60)" }}>
                        {recipe.name}
                      </h3>
                      <div className="flex gap-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-sm"
                          style={{
                            background: `${ACCENT}18`, color: ACCENT,
                            border: `1px solid ${ACCENT}33`,
                            fontFamily: "'Cinzel', serif", fontSize: "0.6rem",
                          }}
                        >
                          {recipe.type}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-sm"
                          style={{
                            background: "oklch(0.14 0.012 30)", color: "oklch(0.60 0.010 60)",
                            border: "1px solid oklch(0.22 0.015 50)",
                            fontFamily: "'Cinzel', serif", fontSize: "0.6rem",
                          }}
                        >
                          {recipe.level}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs mb-2" style={{ color: "oklch(0.80 0.010 60)" }}>
                      <span style={{ color: ACCENT }}>Materials: </span>{recipe.materials}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "oklch(0.65 0.010 60)" }}>
                      {recipe.notes}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Salvage Guide */}
            <section>
              <h2 className="font-cinzel font-bold text-lg mb-4" style={{ color: "oklch(0.90 0.01 60)" }}>
                Salvaging Guide
              </h2>
              <div
                className="p-5 rounded border-l-2"
                style={{ background: `${ACCENT}08`, borderColor: ACCENT }}
              >
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>
                  {blacksmithGuide.salvageGuide}
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar — Crafting Materials */}
          <div>
            <div
              className="sticky top-24 p-5 rounded border"
              style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Package size={16} color={ACCENT} />
                <h3 className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.90 0.01 60)" }}>
                  Crafting Materials
                </h3>
              </div>
              <div className="space-y-3">
                {craftingMaterials.map((mat) => {
                  const colors = {
                    white: "#e0e0e0", blue: "#4fc3f7", yellow: "#ffd54f", legendary: "#ffb74d"
                  };
                  const c = colors[mat.rarity];
                  return (
                    <div key={mat.name} className="border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
                      <p className="text-xs font-bold font-cinzel mb-1" style={{ color: c }}>
                        {mat.name}
                      </p>
                      <p className="text-xs mb-1" style={{ color: "oklch(0.78 0.010 60)" }}>
                        <span style={{ color: "oklch(0.60 0.010 60)" }}>Source: </span>{mat.source}
                      </p>
                      <p className="text-xs" style={{ color: "oklch(0.78 0.010 60)" }}>
                        <span style={{ color: "oklch(0.60 0.010 60)" }}>Uses: </span>{mat.uses}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
