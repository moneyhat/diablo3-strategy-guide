// Sanctuary Grimoire — Crafting Mastery Calculator
// Input your materials → see what you can craft, your mastery tier, and what to prioritize next
import { useState, useMemo } from "react";
import {
  MATERIALS, BLACKSMITH_RECIPES, GEM_TIERS, GEM_TYPES, GEM_STATS,
  KANAI_RECIPES, MASTERY_TIERS, ENCHANT_COSTS, ENCHANT_PRIORITY_BY_SLOT,
  calculateMasteryTier, calculateGemChain, CraftMaterial, KanaiRecipe, CraftRecipe
} from "@/data/craftingData";
import { ChevronDown, ChevronUp, Zap, Trophy, Star, AlertTriangle, Check, X, Plus, Minus, BookOpen, Hammer, Gem, Sparkles } from "lucide-react";

// ─── Craft system tabs ────────────────────────────────────────────────────────
const SYSTEMS = [
  { id: "overview",   label: "Mastery Overview", icon: <Trophy size={13} /> },
  { id: "blacksmith", label: "Blacksmith",        icon: <Hammer size={13} /> },
  { id: "jeweler",    label: "Jeweler",           icon: <Gem size={13} /> },
  { id: "mystic",     label: "Mystic",            icon: <Sparkles size={13} /> },
  { id: "kanai",      label: "Kanai's Cube",      icon: <Zap size={13} /> },
];

// ─── Material input row ───────────────────────────────────────────────────────
function MaterialRow({ mat, value, onChange }: { mat: CraftMaterial; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded border transition-colors"
      style={{ background: value > 0 ? "oklch(0.12 0.010 30)" : "oklch(0.09 0.008 30)", borderColor: value > 0 ? "oklch(0.28 0.015 50)" : "oklch(0.16 0.010 30)" }}>
      <span className="text-base flex-shrink-0">{mat.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-cinzel font-bold text-xs leading-tight" style={{ color: value > 0 ? "oklch(0.88 0.01 60)" : "oklch(0.55 0.010 60)" }}>{mat.name}</p>
        <p className="text-xs" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.52rem" }}>{mat.source}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onChange(Math.max(0, value - 1))}
          className="w-6 h-6 rounded flex items-center justify-center transition-colors"
          style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.55 0.010 60)" }}>
          <Minus size={10} />
        </button>
        <input
          type="number" min={0} value={value}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-14 text-center rounded border text-xs font-cinzel font-bold"
          style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.88 0.01 60)", padding: "2px 4px" }}
        />
        <button onClick={() => onChange(value + 1)}
          className="w-6 h-6 rounded flex items-center justify-center transition-colors"
          style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.55 0.010 60)" }}>
          <Plus size={10} />
        </button>
      </div>
    </div>
  );
}

// ─── Recipe card ──────────────────────────────────────────────────────────────
function RecipeCard({ recipe, inventory, accentColor }: { recipe: CraftRecipe | KanaiRecipe; inventory: Record<string, number>; accentColor: string }) {
  const [expanded, setExpanded] = useState(false);
  const priorityColors = { essential: "#ff7043", high: "#ffd54f", medium: "#66bb6a", low: "#80cbc4" };
  const pc = priorityColors[recipe.priority];

  // Check if craftable
  const canCraft = recipe.materials.every((m) => (inventory[m.materialId] || 0) >= m.quantity);
  const missingMats = recipe.materials.filter((m) => (inventory[m.materialId] || 0) < m.quantity);
  const totalMissing = missingMats.reduce((sum, m) => sum + (m.quantity - (inventory[m.materialId] || 0)), 0);

  const tierColors = ["#9e9e9e","#66bb6a","#42a5f5","#ce93d8","#ffd54f"];
  const tc = tierColors[(recipe.masteryTier || 1) - 1];

  return (
    <div className="rounded border overflow-hidden transition-all duration-200"
      style={{ background: canCraft ? `${accentColor}08` : "oklch(0.10 0.010 30)", borderColor: canCraft ? `${accentColor}44` : "oklch(0.20 0.015 50)" }}>
      {/* Priority stripe */}
      <div style={{ height: "2px", background: `linear-gradient(90deg, ${pc}, ${pc}44, transparent)` }} />

      <div className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <h4 className="font-cinzel font-bold text-xs" style={{ color: canCraft ? "oklch(0.90 0.01 60)" : "oklch(0.65 0.010 60)" }}>
                {"name" in recipe ? recipe.name : (recipe as CraftRecipe).name}
              </h4>
              <span className="text-xs px-1.5 py-0.5 rounded-sm capitalize"
                style={{ background: `${pc}18`, color: pc, border: `1px solid ${pc}33`, fontFamily: "'Cinzel', serif", fontSize: "0.5rem" }}>
                {recipe.priority}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-sm"
                style={{ background: `${tc}18`, color: tc, border: `1px solid ${tc}33`, fontFamily: "'Cinzel', serif", fontSize: "0.5rem" }}>
                Tier {recipe.masteryTier}
              </span>
            </div>
            <p className="text-xs" style={{ color: "oklch(0.52 0.010 60)", fontSize: "0.62rem" }}>{recipe.description}</p>
          </div>
          <div className="flex-shrink-0">
            {canCraft ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded"
                style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}55` }}>
                <Check size={10} color={accentColor} />
                <span className="font-cinzel font-bold" style={{ color: accentColor, fontSize: "0.55rem" }}>CRAFTABLE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 rounded"
                style={{ background: "oklch(0.14 0.012 30)", border: "1px solid oklch(0.22 0.015 50)" }}>
                <X size={10} color="oklch(0.45 0.010 60)" />
                <span className="font-cinzel" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.55rem" }}>NEED {totalMissing} MORE</span>
              </div>
            )}
          </div>
        </div>

        {/* Materials */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {recipe.materials.map((m) => {
            const mat = MATERIALS.find((mat) => mat.id === m.materialId);
            const have = inventory[m.materialId] || 0;
            const enough = have >= m.quantity;
            return (
              <div key={m.materialId} className="flex items-center gap-1 px-2 py-0.5 rounded-sm"
                style={{ background: enough ? "oklch(0.12 0.010 30)" : "oklch(0.16 0.010 30)", border: `1px solid ${enough ? "oklch(0.25 0.015 50)" : "#ef535044"}` }}>
                <span style={{ fontSize: "10px" }}>{mat?.icon || "📦"}</span>
                <span className="font-cinzel text-xs" style={{ color: enough ? "oklch(0.75 0.01 60)" : "#ef5350", fontSize: "0.55rem" }}>
                  {have}/{m.quantity} {mat?.name.split(" ").slice(-1)[0]}
                </span>
              </div>
            );
          })}
          {recipe.goldCost > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-sm"
              style={{ background: "oklch(0.12 0.010 30)", border: "1px solid oklch(0.22 0.015 50)" }}>
              <span style={{ fontSize: "10px" }}>💰</span>
              <span className="font-cinzel text-xs" style={{ color: "oklch(0.65 0.010 60)", fontSize: "0.55rem" }}>
                {recipe.goldCost.toLocaleString()}g
              </span>
            </div>
          )}
        </div>

        {/* Tip */}
        <div className="flex items-start gap-1.5">
          <Star size={9} color="#ffd54f" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs" style={{ color: "oklch(0.58 0.010 60)", fontSize: "0.6rem" }}>{recipe.tip}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Mastery progress bar ─────────────────────────────────────────────────────
function MasteryBar({ score, tier }: { score: number; tier: typeof MASTERY_TIERS[0] }) {
  return (
    <div className="p-4 rounded border" style={{ background: `${tier.color}08`, borderColor: `${tier.color}33` }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-cinzel tracking-widest mb-0.5" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.52rem" }}>CRAFTING MASTERY</p>
          <p className="font-cinzel-decorative font-black text-xl" style={{ color: tier.color }}>{tier.name}</p>
        </div>
        <div className="text-right">
          <p className="font-cinzel-decorative font-black text-3xl" style={{ color: tier.color }}>{score}</p>
          <p className="font-cinzel" style={{ color: "oklch(0.40 0.010 60)", fontSize: "0.52rem" }}>/ 100</p>
        </div>
      </div>
      <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: "oklch(0.14 0.012 30)" }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: `linear-gradient(90deg, ${tier.color}, ${tier.color}88)`, boxShadow: `0 0 8px ${tier.color}55` }} />
      </div>
      <p className="text-xs" style={{ color: "oklch(0.55 0.010 60)" }}>{tier.description}</p>
    </div>
  );
}

// ─── Main Calculator Page ─────────────────────────────────────────────────────
export default function CraftingCalculatorPage() {
  const [activeSystem, setActiveSystem] = useState("overview");
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [selectedGemType, setSelectedGemType] = useState<typeof GEM_TYPES[number]>("Emerald");
  const [currentGemTier, setCurrentGemTier] = useState(1);
  const [targetGemTier, setTargetGemTier] = useState(18);
  const [gemQuantity, setGemQuantity] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string>("Gloves");
  const [enchantRolls, setEnchantRolls] = useState(1);

  const setMat = (id: string, val: number) => setInventory((prev) => ({ ...prev, [id]: Math.max(0, val) }));

  const mastery = useMemo(() => calculateMasteryTier(inventory), [inventory]);
  const gemChain = useMemo(() => calculateGemChain(currentGemTier, targetGemTier, gemQuantity), [currentGemTier, targetGemTier, gemQuantity]);

  const craftableBs = BLACKSMITH_RECIPES.filter((r) => r.materials.every((m) => (inventory[m.materialId] || 0) >= m.quantity));
  const craftableKanai = KANAI_RECIPES.filter((r) => r.materials.every((m) => (inventory[m.materialId] || 0) >= m.quantity));

  const accentColor = "#d4a843";

  // Get enchant cost for current roll count
  const enchantCost = ENCHANT_COSTS.reduce((prev, curr) => curr.rolls <= enchantRolls ? curr : prev, ENCHANT_COSTS[0]);
  const totalEnchantCost = ENCHANT_COSTS.filter((c) => c.rolls <= enchantRolls).reduce((sum, c) => sum + c.gold, 0);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.07 0.008 30)" }}>
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-6">
          <p className="font-cinzel tracking-widest mb-1" style={{ color: "oklch(0.72 0.18 55)", fontSize: "0.6rem", letterSpacing: "0.2em" }}>CRAFTING SYSTEMS</p>
          <h1 className="font-cinzel-decorative font-black text-3xl mb-2" style={{ color: "oklch(0.88 0.01 60)" }}>Mastery Calculator</h1>
          <p className="text-sm" style={{ color: "oklch(0.52 0.010 60)", fontFamily: "'Cinzel', serif" }}>
            Enter your current materials to see your crafting mastery tier, what you can craft right now, and exactly what to prioritize next.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left: Material Input ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>YOUR MATERIALS</p>

              {/* Quick fill buttons */}
              <div className="flex gap-2 mb-3 flex-wrap">
                <button onClick={() => setInventory({})}
                  className="text-xs px-3 py-1.5 rounded border font-cinzel"
                  style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.50 0.010 60)" }}>
                  Clear All
                </button>
                <button onClick={() => {
                  const starter: Record<string, number> = { "reusable-parts": 50, "arcane-dust": 30, "veiled-crystal": 10, "deaths-breath": 5 };
                  setInventory(starter);
                }}
                  className="text-xs px-3 py-1.5 rounded border font-cinzel"
                  style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.50 0.010 60)" }}>
                  Fresh 70
                </button>
                <button onClick={() => {
                  const endgame: Record<string, number> = { "reusable-parts": 500, "arcane-dust": 300, "veiled-crystal": 200, "deaths-breath": 100, "forgotten-soul": 50, "khanduran-rune": 10, "caldeum-nightshade": 10, "arreat-war-tapestry": 10, "corrupted-angel-flesh": 10, "westmarch-holy-water": 10, "flawless-royal": 20 };
                  setInventory(endgame);
                }}
                  className="text-xs px-3 py-1.5 rounded border font-cinzel"
                  style={{ background: `${accentColor}12`, borderColor: `${accentColor}44`, color: accentColor }}>
                  Endgame
                </button>
              </div>

              {/* Material groups */}
              {[
                { label: "Blacksmith / Mystic Materials", ids: ["reusable-parts","arcane-dust","veiled-crystal","forgotten-soul","deaths-breath"] },
                { label: "Bounty Cache Materials", ids: ["khanduran-rune","caldeum-nightshade","arreat-war-tapestry","corrupted-angel-flesh","westmarch-holy-water"] },
                { label: "Gems (Highest Tier You Have)", ids: ["flawless-royal","royal-gem","flawless-imperial","imperial-gem","marquise-gem","flawless-royal"] },
              ].map((group) => (
                <div key={group.label} className="mb-4">
                  <p className="font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.5rem" }}>{group.label.toUpperCase()}</p>
                  <div className="space-y-1.5">
                    {group.ids.filter((id, i, arr) => arr.indexOf(id) === i).map((id) => {
                      const mat = MATERIALS.find((m) => m.id === id);
                      if (!mat) return null;
                      return (
                        <MaterialRow key={id} mat={mat} value={inventory[id] || 0} onChange={(v) => setMat(id, v)} />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Calculator Output ── */}
          <div className="lg:col-span-2">
            {/* System tabs */}
            <div className="flex flex-wrap gap-1 mb-5 border-b pb-3" style={{ borderColor: "oklch(0.20 0.015 50)" }}>
              {SYSTEMS.map((sys) => (
                <button key={sys.id} onClick={() => setActiveSystem(sys.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded border text-xs font-cinzel tracking-wide transition-all duration-150"
                  style={{ background: activeSystem === sys.id ? `${accentColor}18` : "oklch(0.10 0.010 30)", borderColor: activeSystem === sys.id ? `${accentColor}55` : "oklch(0.20 0.015 50)", color: activeSystem === sys.id ? accentColor : "oklch(0.50 0.010 60)" }}>
                  {sys.icon} {sys.label}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeSystem === "overview" && (
              <div className="space-y-5">
                <MasteryBar score={mastery.score} tier={mastery.tier} />

                {/* Next steps */}
                {mastery.nextSteps.length > 0 && (
                  <div className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                    <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>PRIORITY NEXT STEPS</p>
                    <div className="space-y-2">
                      {mastery.nextSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44` }}>
                            <span className="font-cinzel font-bold" style={{ color: accentColor, fontSize: "0.55rem" }}>{i + 1}</span>
                          </div>
                          <p className="text-xs" style={{ color: "oklch(0.65 0.010 60)" }}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unlocked recipes summary */}
                <div className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                  <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>CRAFTABLE RIGHT NOW</p>
                  {mastery.unlockedRecipes.length === 0 ? (
                    <p className="text-xs" style={{ color: "oklch(0.42 0.010 60)" }}>Add materials to see what you can craft.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {mastery.unlockedRecipes.map((id) => {
                        const recipe = [...BLACKSMITH_RECIPES, ...KANAI_RECIPES].find((r) => r.id === id);
                        if (!recipe) return null;
                        return (
                          <div key={id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded"
                            style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}33` }}>
                            <Check size={10} color={accentColor} />
                            <span className="font-cinzel text-xs" style={{ color: accentColor, fontSize: "0.6rem" }}>{"name" in recipe ? recipe.name.split("—")[0].trim() : ""}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Mastery tier progression */}
                <div className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                  <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>MASTERY PROGRESSION</p>
                  <div className="space-y-2">
                    {MASTERY_TIERS.map((t) => {
                      const isActive = t.tier === mastery.tier.tier;
                      const isPast = t.tier < mastery.tier.tier;
                      return (
                        <div key={t.tier} className="flex items-start gap-3 p-2.5 rounded border"
                          style={{ background: isActive ? `${t.color}10` : "oklch(0.09 0.008 30)", borderColor: isActive ? `${t.color}44` : "oklch(0.16 0.010 30)", opacity: isPast ? 0.6 : 1 }}>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: isPast || isActive ? t.color : "oklch(0.16 0.012 30)", border: `1px solid ${t.color}55` }}>
                            {isPast ? <Check size={11} color="oklch(0.08 0 0)" /> : <span className="font-cinzel font-bold" style={{ color: isActive ? "oklch(0.08 0 0)" : t.color, fontSize: "0.55rem" }}>{t.tier}</span>}
                          </div>
                          <div className="flex-1">
                            <p className="font-cinzel font-bold text-xs" style={{ color: isActive ? t.color : "oklch(0.65 0.010 60)" }}>{t.name}</p>
                            <p className="text-xs" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.58rem" }}>{t.description}</p>
                          </div>
                          {isActive && <span className="text-xs font-cinzel flex-shrink-0" style={{ color: t.color, fontSize: "0.55rem" }}>CURRENT</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── BLACKSMITH TAB ── */}
            {activeSystem === "blacksmith" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-cinzel tracking-widest" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>BLACKSMITH RECIPES</p>
                  <span className="text-xs font-cinzel" style={{ color: accentColor }}>
                    {craftableBs.length}/{BLACKSMITH_RECIPES.length} craftable
                  </span>
                </div>
                {/* Sort: craftable first */}
                {[...BLACKSMITH_RECIPES].sort((a, b) => {
                  const ac = a.materials.every((m) => (inventory[m.materialId] || 0) >= m.quantity) ? 0 : 1;
                  const bc = b.materials.every((m) => (inventory[m.materialId] || 0) >= m.quantity) ? 0 : 1;
                  return ac - bc;
                }).map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} inventory={inventory} accentColor={accentColor} />
                ))}

                {/* Salvage guide */}
                <div className="p-4 rounded border mt-4" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                  <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>SALVAGE GUIDE</p>
                  <div className="space-y-2">
                    {[
                      { item: "White / Grey items", result: "Reusable Parts", tip: "Salvage everything — you always need these for basic recipes." },
                      { item: "Blue (Magic) items", result: "Arcane Dust", tip: "Salvage all magic items. Arcane Dust is used in most mid-tier recipes." },
                      { item: "Yellow (Rare) items", result: "Veiled Crystal", tip: "Salvage rares you don't need. Veiled Crystals are essential for enchanting." },
                      { item: "Legendary / Set items", result: "Forgotten Soul", tip: "Only salvage Legendaries you have duplicates of or won't use. Forgotten Souls are precious." },
                    ].map((row) => (
                      <div key={row.item} className="flex items-start gap-3 p-2.5 rounded" style={{ background: "oklch(0.12 0.010 30)" }}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-cinzel font-bold text-xs" style={{ color: "oklch(0.80 0.01 60)" }}>{row.item}</span>
                            <span style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.7rem" }}>→</span>
                            <span className="font-cinzel font-bold text-xs" style={{ color: accentColor }}>{row.result}</span>
                          </div>
                          <p className="text-xs" style={{ color: "oklch(0.52 0.010 60)", fontSize: "0.6rem" }}>{row.tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── JEWELER TAB ── */}
            {activeSystem === "jeweler" && (
              <div className="space-y-5">
                {/* Gem type selector */}
                <div>
                  <p className="font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>GEM TYPE</p>
                  <div className="flex flex-wrap gap-2">
                    {GEM_TYPES.map((type) => (
                      <button key={type} onClick={() => setSelectedGemType(type)}
                        className="px-3 py-1.5 rounded border text-xs font-cinzel transition-all"
                        style={{ background: selectedGemType === type ? `${accentColor}18` : "oklch(0.10 0.010 30)", borderColor: selectedGemType === type ? `${accentColor}55` : "oklch(0.20 0.015 50)", color: selectedGemType === type ? accentColor : "oklch(0.50 0.010 60)" }}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gem stats for selected type */}
                <div className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                  <p className="font-cinzel tracking-widest mb-2" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>{selectedGemType.toUpperCase()} STATS</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[["Weapon", GEM_STATS[selectedGemType].weapon], ["Armor", GEM_STATS[selectedGemType].armor], ["Jewelry", GEM_STATS[selectedGemType].jewelry]].map(([slot, stat]) => (
                      <div key={slot} className="p-2 rounded" style={{ background: "oklch(0.12 0.010 30)" }}>
                        <p className="font-cinzel font-bold text-xs mb-0.5" style={{ color: accentColor, fontSize: "0.58rem" }}>{slot}</p>
                        <p className="text-xs" style={{ color: "oklch(0.65 0.010 60)", fontSize: "0.6rem" }}>{stat}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gem chain calculator */}
                <div className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                  <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>GEM COMBINE CALCULATOR</p>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="font-cinzel text-xs mb-1" style={{ color: "oklch(0.50 0.010 60)", fontSize: "0.58rem" }}>Current Tier</p>
                      <select value={currentGemTier} onChange={(e) => setCurrentGemTier(Number(e.target.value))}
                        className="w-full rounded border text-xs font-cinzel p-1.5"
                        style={{ background: "oklch(0.12 0.010 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.80 0.01 60)" }}>
                        {GEM_TIERS.map((t) => <option key={t.id} value={t.tier}>{t.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="font-cinzel text-xs mb-1" style={{ color: "oklch(0.50 0.010 60)", fontSize: "0.58rem" }}>Target Tier</p>
                      <select value={targetGemTier} onChange={(e) => setTargetGemTier(Number(e.target.value))}
                        className="w-full rounded border text-xs font-cinzel p-1.5"
                        style={{ background: "oklch(0.12 0.010 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.80 0.01 60)" }}>
                        {GEM_TIERS.map((t) => <option key={t.id} value={t.tier}>{t.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="font-cinzel text-xs mb-1" style={{ color: "oklch(0.50 0.010 60)", fontSize: "0.58rem" }}>Quantity</p>
                      <input type="number" min={1} value={gemQuantity} onChange={(e) => setGemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full rounded border text-xs font-cinzel p-1.5"
                        style={{ background: "oklch(0.12 0.010 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.80 0.01 60)" }} />
                    </div>
                  </div>

                  {currentGemTier < targetGemTier ? (
                    <div className="space-y-2">
                      <div className="flex gap-4 p-3 rounded" style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}33` }}>
                        <div className="text-center">
                          <p className="font-cinzel-decorative font-black text-xl" style={{ color: accentColor }}>{gemChain.gemsNeeded.toLocaleString()}</p>
                          <p className="font-cinzel" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.52rem" }}>GEMS NEEDED</p>
                        </div>
                        <div className="text-center">
                          <p className="font-cinzel-decorative font-black text-xl" style={{ color: "#ffd54f" }}>{gemChain.goldNeeded.toLocaleString()}</p>
                          <p className="font-cinzel" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.52rem" }}>GOLD NEEDED</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {gemChain.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs p-2 rounded" style={{ background: "oklch(0.12 0.010 30)" }}>
                            <span className="font-cinzel font-bold" style={{ color: accentColor, fontSize: "0.58rem" }}>Step {i + 1}</span>
                            <span style={{ color: "oklch(0.60 0.010 60)" }}>Need {step.count.toLocaleString()} {step.tier} gems</span>
                            <span style={{ color: "#ffd54f", marginLeft: "auto" }}>💰 {step.goldCost.toLocaleString()}g</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-cinzel" style={{ color: "oklch(0.50 0.010 60)" }}>Select a higher target tier to calculate the combine chain.</p>
                  )}
                </div>

                {/* Gem tier table */}
                <div className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                  <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>GEM TIER REFERENCE</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ borderBottom: "1px solid oklch(0.20 0.015 50)" }}>
                          {["Tier", "Name", "Combine Cost", "Gold", "Weapon Bonus"].map((h) => (
                            <th key={h} className="text-left pb-2 pr-3 font-cinzel" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {GEM_TIERS.map((gem) => {
                          const tierColors = ["#9e9e9e","#9e9e9e","#9e9e9e","#9e9e9e","#66bb6a","#66bb6a","#66bb6a","#42a5f5","#42a5f5","#42a5f5","#ce93d8","#ce93d8","#ce93d8","#ffd54f","#ffd54f","#ffd54f","#ff7043","#ff7043"];
                          const tc = tierColors[gem.tier - 1] || "#9e9e9e";
                          return (
                            <tr key={gem.id} style={{ borderBottom: "1px solid oklch(0.14 0.010 30)" }}>
                              <td className="py-1.5 pr-3 font-cinzel font-bold" style={{ color: tc, fontSize: "0.58rem" }}>{gem.tier}</td>
                              <td className="py-1.5 pr-3 font-cinzel" style={{ color: "oklch(0.72 0.01 60)", fontSize: "0.6rem" }}>{gem.name}</td>
                              <td className="py-1.5 pr-3" style={{ color: "oklch(0.52 0.010 60)", fontSize: "0.6rem" }}>{gem.tier === 1 ? "—" : `3× Tier ${gem.tier - 1}`}</td>
                              <td className="py-1.5 pr-3" style={{ color: "#ffd54f", fontSize: "0.6rem" }}>{gem.goldCost === 0 ? "—" : `${gem.goldCost.toLocaleString()}g`}</td>
                              <td className="py-1.5" style={{ color: "oklch(0.60 0.010 60)", fontSize: "0.6rem" }}>{GEM_STATS[selectedGemType].weapon.replace("%", gem.stats.weapon)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── MYSTIC TAB ── */}
            {activeSystem === "mystic" && (
              <div className="space-y-5">
                {/* Enchanting cost calculator */}
                <div className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                  <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>ENCHANTING COST CALCULATOR</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="font-cinzel text-xs mb-1" style={{ color: "oklch(0.50 0.010 60)", fontSize: "0.58rem" }}>Number of Rolls</p>
                      <input type="number" min={1} max={100} value={enchantRolls} onChange={(e) => setEnchantRolls(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full rounded border text-xs font-cinzel p-1.5"
                        style={{ background: "oklch(0.12 0.010 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.80 0.01 60)" }} />
                    </div>
                    <div>
                      <p className="font-cinzel text-xs mb-1" style={{ color: "oklch(0.50 0.010 60)", fontSize: "0.58rem" }}>Item Slot</p>
                      <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}
                        className="w-full rounded border text-xs font-cinzel p-1.5"
                        style={{ background: "oklch(0.12 0.010 30)", borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.80 0.01 60)" }}>
                        {Object.keys(ENCHANT_PRIORITY_BY_SLOT).map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded" style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}33` }}>
                      <p className="font-cinzel-decorative font-black text-xl" style={{ color: accentColor }}>{enchantCost.veiled}</p>
                      <p className="font-cinzel" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.52rem" }}>VEILED CRYSTALS (this roll)</p>
                    </div>
                    <div className="p-3 rounded" style={{ background: "#ffd54f10", border: "1px solid #ffd54f33" }}>
                      <p className="font-cinzel-decorative font-black text-xl" style={{ color: "#ffd54f" }}>{totalEnchantCost.toLocaleString()}g</p>
                      <p className="font-cinzel" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.52rem" }}>TOTAL GOLD (all {enchantRolls} rolls)</p>
                    </div>
                  </div>

                  {/* Veiled crystal check */}
                  <div className="flex items-center gap-2 p-2.5 rounded" style={{ background: (inventory["veiled-crystal"] || 0) >= enchantCost.veiled ? "oklch(0.10 0.010 30)" : "#ef535010", border: `1px solid ${(inventory["veiled-crystal"] || 0) >= enchantCost.veiled ? "oklch(0.20 0.015 50)" : "#ef535044"}` }}>
                    {(inventory["veiled-crystal"] || 0) >= enchantCost.veiled
                      ? <Check size={12} color="#66bb6a" />
                      : <AlertTriangle size={12} color="#ef5350" />}
                    <p className="text-xs font-cinzel" style={{ color: (inventory["veiled-crystal"] || 0) >= enchantCost.veiled ? "#66bb6a" : "#ef5350", fontSize: "0.6rem" }}>
                      You have {inventory["veiled-crystal"] || 0} Veiled Crystals — {(inventory["veiled-crystal"] || 0) >= enchantCost.veiled ? "enough" : `need ${enchantCost.veiled - (inventory["veiled-crystal"] || 0)} more`} for roll #{enchantRolls}
                    </p>
                  </div>
                </div>

                {/* Priority stats by slot */}
                <div className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                  <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>ENCHANT PRIORITY — {selectedSlot.toUpperCase()}</p>
                  <div className="space-y-2">
                    {(ENCHANT_PRIORITY_BY_SLOT[selectedSlot] || []).map((stat, i) => (
                      <div key={stat} className="flex items-center gap-3 p-2.5 rounded"
                        style={{ background: i === 0 ? `${accentColor}12` : "oklch(0.12 0.010 30)", border: `1px solid ${i === 0 ? `${accentColor}33` : "oklch(0.18 0.012 30)"}` }}>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: i === 0 ? accentColor : "oklch(0.18 0.012 30)" }}>
                          <span className="font-cinzel font-bold" style={{ color: i === 0 ? "oklch(0.08 0 0)" : "oklch(0.55 0.010 60)", fontSize: "0.55rem" }}>{i + 1}</span>
                        </div>
                        <span className="font-cinzel text-xs" style={{ color: i === 0 ? accentColor : "oklch(0.70 0.010 60)" }}>{stat}</span>
                        {i === 0 && <span className="ml-auto font-cinzel text-xs" style={{ color: accentColor, fontSize: "0.55rem" }}>TOP PRIORITY</span>}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs mt-3" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>
                    💡 Enchant the stat that is furthest from its ideal value. You can only reroll one stat per item — choose wisely.
                  </p>
                </div>

                {/* Enchanting guide */}
                <div className="p-4 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                  <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>HOW ENCHANTING WORKS</p>
                  <div className="space-y-2 text-xs" style={{ color: "oklch(0.58 0.010 60)" }}>
                    <p>1. Choose one secondary stat on an item to reroll. That stat is permanently locked for future rerolls.</p>
                    <p>2. Each roll costs Veiled Crystals and gold. Costs increase with each roll on the same item.</p>
                    <p>3. You are shown two random options for the new stat. Pick one or roll again.</p>
                    <p>4. If you accepted a previous roll, you can revert to it for free at any time.</p>
                    <p>5. The stat pool for each slot is fixed — you cannot roll stats that don't belong on that slot type.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── KANAI'S CUBE TAB ── */}
            {activeSystem === "kanai" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-cinzel tracking-widest" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>KANAI'S CUBE RECIPES</p>
                  <span className="text-xs font-cinzel" style={{ color: accentColor }}>
                    {craftableKanai.length}/{KANAI_RECIPES.length} craftable
                  </span>
                </div>
                {[...KANAI_RECIPES].sort((a, b) => {
                  const ac = a.materials.every((m) => (inventory[m.materialId] || 0) >= m.quantity) ? 0 : 1;
                  const bc = b.materials.every((m) => (inventory[m.materialId] || 0) >= m.quantity) ? 0 : 1;
                  return ac - bc;
                }).map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} inventory={inventory} accentColor={accentColor} />
                ))}

                {/* Bounty cache guide */}
                <div className="p-4 rounded border mt-4" style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                  <p className="font-cinzel tracking-widest mb-3" style={{ color: "oklch(0.38 0.010 60)", fontSize: "0.52rem" }}>BOUNTY CACHE MATERIALS</p>
                  <div className="space-y-2">
                    {[
                      { mat: "Khanduran Rune", act: "Act I", tip: "Complete all 5 Act I bounties for a Horadric Cache." },
                      { mat: "Caldeum Nightshade", act: "Act II", tip: "Complete all 5 Act II bounties for a Horadric Cache." },
                      { mat: "Arreat War Tapestry", act: "Act III", tip: "Complete all 5 Act III bounties for a Horadric Cache." },
                      { mat: "Corrupted Angel Flesh", act: "Act IV", tip: "Complete all 5 Act IV bounties for a Horadric Cache." },
                      { mat: "Westmarch Holy Water", act: "Act V", tip: "Complete all 5 Act V bounties for a Horadric Cache." },
                    ].map((row) => (
                      <div key={row.mat} className="flex items-start gap-3 p-2.5 rounded" style={{ background: "oklch(0.12 0.010 30)" }}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-cinzel font-bold text-xs" style={{ color: accentColor }}>{row.mat}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-sm font-cinzel" style={{ background: "oklch(0.16 0.012 30)", color: "oklch(0.50 0.010 60)", fontSize: "0.52rem" }}>{row.act}</span>
                          </div>
                          <p className="text-xs" style={{ color: "oklch(0.52 0.010 60)", fontSize: "0.6rem" }}>{row.tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs mt-3" style={{ color: "oklch(0.45 0.010 60)", fontSize: "0.6rem" }}>
                    💡 Run all 5 Acts in a single Bounty session for maximum efficiency. Higher Torment = more materials per cache.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
