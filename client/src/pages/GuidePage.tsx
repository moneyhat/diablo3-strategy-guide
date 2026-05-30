// Sanctuary Grimoire — Personalized Guide Output Page
// Compact interactive layout: accordions, tabs, carousels, stat bars
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { classMap } from "@/data/classes";
import { jewelerGuide, mysticGuide, kanaisCubeGuide, seasonsGuide, paragonGuide } from "@/data/systems";
import { useWizard, FocusArea } from "@/contexts/WizardContext";
import {
  CLASS_PORTRAITS, CLASS_SIGILS, SECTION_IMAGES,
  BlacksmithIcon, JewelerIcon, MysticIcon,
  KanaiIcon, SeasonIcon, ParagonIcon, TierBadge,
  FireIcon, LightningIcon, ColdIcon, HolyIcon, PoisonIcon, ArcaneIcon, PhysicalIcon,
} from "@/components/Icons";
import {
  Accordion, TabPanel, Carousel, StatBar, RatingDots,
  ItemPill, CompactBuildCard, CompactAbilityCard,
} from "@/components/GuideComponents";
import { ChevronLeft, RotateCcw, Sword, Zap, Trophy, Shield, BookOpen, Gem, Star, Flame, Calendar, Map } from "lucide-react";
import { SkillBarDisplay, RotationGuide } from "@/components/SkillBar";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getLevelPhase(level: number): "early" | "mid" | "late" | "endgame" {
  if (level <= 30) return "early";
  if (level <= 60) return "mid";
  if (level < 70) return "late";
  return "endgame";
}
function getLevelLabel(level: number) {
  if (level <= 30) return "Levels 1–30";
  if (level <= 60) return "Levels 31–60";
  if (level < 70) return "Levels 61–69";
  if (level === 70) return "Level 70";
  return "Level 70+ (Paragon)";
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  title, icon: Icon, accentColor, bgImage, children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  accentColor: string;
  bgImage?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      {bgImage ? (
        <div className="relative rounded overflow-hidden mb-4 h-20"
          style={{ border: `1px solid ${accentColor}33` }}>
          <img src={bgImage} alt={title} className="w-full h-full object-cover"
            style={{ filter: "brightness(0.3) saturate(0.6)" }} />
          <div className="absolute inset-0 flex items-center gap-3 px-4"
            style={{ background: `linear-gradient(90deg, ${accentColor}22, transparent)` }}>
            <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}55` }}>
              <Icon size={15} color={accentColor} />
            </div>
            <h2 className="font-cinzel font-bold text-base" style={{ color: "oklch(0.95 0.01 60)", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
              {title}
            </h2>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}44` }}>
            <Icon size={13} color={accentColor} />
          </div>
          <h2 className="font-cinzel font-bold text-base" style={{ color: "oklch(0.90 0.01 60)" }}>{title}</h2>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accentColor}44, transparent)` }} />
        </div>
      )}
      {children}
    </section>
  );
}

// ─── Class stat bars data ─────────────────────────────────────────────────────
const CLASS_STATS: Record<string, { damage: number; toughness: number; mobility: number; complexity: number; aoe: number }> = {
  barbarian:     { damage: 88, toughness: 90, mobility: 70, complexity: 65, aoe: 85 },
  crusader:      { damage: 82, toughness: 95, mobility: 55, complexity: 60, aoe: 78 },
  "demon-hunter":{ damage: 95, toughness: 55, mobility: 90, complexity: 75, aoe: 80 },
  monk:          { damage: 78, toughness: 72, mobility: 95, complexity: 70, aoe: 75 },
  necromancer:   { damage: 90, toughness: 68, mobility: 60, complexity: 80, aoe: 88 },
  "witch-doctor":{ damage: 85, toughness: 65, mobility: 65, complexity: 78, aoe: 90 },
  wizard:        { damage: 92, toughness: 58, mobility: 72, complexity: 72, aoe: 92 },
};

const ELEMENT_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Fire: FireIcon, Lightning: LightningIcon, Cold: ColdIcon,
  Holy: HolyIcon, Poison: PoisonIcon, Arcane: ArcaneIcon, Physical: PhysicalIcon,
};
const ELEMENT_COLOR_MAP: Record<string, string> = {
  Fire: "#ff6b35", Lightning: "#7eb8f7", Cold: "#7ecef7",
  Holy: "#ffe082", Poison: "#81c784", Arcane: "#ce93d8", Physical: "#b0b0b0",
};

export default function GuidePage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { state, reset } = useWizard();
  const cls = classMap[params.id || ""];

  if (!cls) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-cinzel text-xl mb-4" style={{ color: "oklch(0.78 0.18 55)" }}>Guide not found</p>
          <button onClick={() => navigate("/")} className="text-sm font-cinzel" style={{ color: "oklch(0.65 0.010 60)" }}>← Return Home</button>
        </div>
      </div>
    );
  }

  const focusAreas: FocusArea[] = state.focusAreas.length > 0
    ? state.focusAreas
    : ["combat", "builds", "leveling", "crafting-blacksmith", "crafting-jeweler", "crafting-mystic", "kanais-cube", "paragon", "seasons"];

  const level = state.level || 70;
  const phase = getLevelPhase(level);
  const ac = cls.color;
  const portrait = CLASS_PORTRAITS[cls.id];
  const Sigil = CLASS_SIGILS[cls.id];
  const stats = CLASS_STATS[cls.id];
  const has = (f: FocusArea) => focusAreas.includes(f);

  // Unique elements this class uses
  const classElements = Array.from(new Set(cls.abilities.map((a) => a.element).filter(Boolean).filter((e) => e !== "None"))) as string[];

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(ellipse at 50% 0%, ${ac}06 0%, oklch(0.07 0.008 30) 50%)` }}>

      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b px-4 py-3 flex items-center justify-between"
        style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.07 0.008 30 / 0.97)", backdropFilter: "blur(12px)" }}>
        <button onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs font-cinzel tracking-wide"
          style={{ color: "oklch(0.55 0.010 60)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = ac; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.55 0.010 60)"; }}>
          <ChevronLeft size={13} /> Home
        </button>
        <span className="font-cinzel-decorative text-sm font-bold" style={{ color: "oklch(0.78 0.18 55)" }}>D3 Guide</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/maps")}
            className="flex items-center gap-1.5 text-xs font-cinzel tracking-wide px-2.5 py-1.5 rounded border transition-colors"
            style={{ borderColor: "oklch(0.72 0.18 55 / 0.4)", color: "oklch(0.78 0.18 55)", background: "oklch(0.72 0.18 55 / 0.08)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.72 0.18 55 / 0.18)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.72 0.18 55 / 0.08)"; }}
          >
            <Map size={11} /> Maps
          </button>
          <button onClick={() => { reset(); navigate("/"); }}
          className="flex items-center gap-1.5 text-xs font-cinzel tracking-wide"
          style={{ color: "oklch(0.55 0.010 60)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = ac; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.55 0.010 60)"; }}>
          <RotateCcw size={11} /> New Guide
        </button>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: "oklch(0.22 0.015 50)" }}>
        <div className="absolute inset-0">
          <img src={portrait} alt={cls.name} className="w-full h-full object-cover object-top"
            style={{ filter: "blur(10px) brightness(0.25) saturate(0.5)", transform: "scale(1.1)" }} />
        </div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${ac}20 0%, oklch(0.07 0.008 30 / 0.75) 100%)` }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-7 flex flex-col md:flex-row gap-5 items-start">
          {/* Portrait */}
          <div className="flex-shrink-0 w-24 md:w-32 rounded overflow-hidden"
            style={{ border: `2px solid ${ac}77`, boxShadow: `0 0 24px ${ac}44` }}>
            <img src={portrait} alt={cls.name} className="w-full object-cover object-top" style={{ aspectRatio: "2/3" }} />
          </div>

          {/* Info column */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
              {[
                { label: cls.name, color: ac, icon: Sigil },
                { label: getLevelLabel(level), color: "oklch(0.65 0.010 60)" },
                { label: `${focusAreas.length} sections`, color: "oklch(0.55 0.010 60)" },
              ].map((chip, i) => (
                <span key={i}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-cinzel tracking-wide"
                  style={{ background: i === 0 ? `${ac}15` : "oklch(0.12 0.012 30)", borderColor: i === 0 ? `${ac}44` : "oklch(0.22 0.015 50)", color: chip.color }}>
                  {i === 0 && chip.icon && <chip.icon size={12} color={ac} />}
                  {chip.label}
                </span>
              ))}
            </div>

            <h1 className="font-cinzel-decorative font-black mb-2"
              style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", color: ac, textShadow: `0 0 30px ${ac}55` }}>
              Your {cls.name} Guide
            </h1>

            {/* Class stat bars — compact visual summary */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 mt-3 max-w-lg">
                <StatBar label="Damage" value={stats.damage} color={ac} suffix="%" />
                <StatBar label="Toughness" value={stats.toughness} color="#42a5f5" suffix="%" />
                <StatBar label="Mobility" value={stats.mobility} color="#66bb6a" suffix="%" />
                <StatBar label="AoE" value={stats.aoe} color="#ff7043" suffix="%" />
                <StatBar label="Complexity" value={stats.complexity} color="#ce93d8" suffix="%" />
              </div>
            )}

            {/* Element icons */}
            {classElements.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.45 0.010 60)" }}>Elements:</span>
                {classElements.map((el) => {
                  const EIcon = ELEMENT_ICON_MAP[el];
                  return EIcon ? (
                    <div key={el} className="flex items-center gap-1"
                      title={el}
                      style={{ background: `${ELEMENT_COLOR_MAP[el]}15`, border: `1px solid ${ELEMENT_COLOR_MAP[el]}33`, borderRadius: "4px", padding: "2px 6px" }}>
                      <EIcon size={13} color={ELEMENT_COLOR_MAP[el]} />
                      <span className="text-xs" style={{ color: ELEMENT_COLOR_MAP[el], fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>{el}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── GUIDE CONTENT ────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-2">

        {/* ── LEVELING ── */}
        {has("leveling") && (
          <Section title={`Leveling — ${getLevelLabel(level)}`} icon={Shield} accentColor={ac}>
            <div className="p-3 rounded border-l-2 mb-3 text-xs"
              style={{ background: `${ac}08`, borderColor: ac, color: "oklch(0.60 0.010 60)" }}>
              <span style={{ color: ac, fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.05em" }}>Resource: </span>
              {cls.resource.name} — {cls.resource.description.slice(0, 120)}…
            </div>
            <Accordion
              accentColor={ac}
              allowMultiple
              items={cls.levelingTips[phase].map((tip, i) => ({
                label: `Tip ${i + 1}`,
                badge: i === 0 ? "Priority" : undefined,
                badgeColor: ac,
                content: <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>{tip}</p>,
              }))}
            />
          </Section>
        )}

        {/* ── COMBAT & ABILITIES ── */}
        {has("combat") && (
          <Section title="Combat & Abilities" icon={Zap} accentColor={ac}>
            <TabPanel
              accentColor={ac}
              tabs={[
                {
                  id: "skillbar",
                  label: "Skill Bar",
                  icon: Zap,
                  content: (
                    <div className="px-1">
                      <div className="mb-3 p-3 rounded border-l-2 text-xs leading-relaxed"
                        style={{ background: `${ac}08`, borderColor: ac, color: "oklch(0.60 0.010 60)" }}>
                        <span style={{ color: ac, fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.05em" }}>Recommended Layout: </span>
                        The 6-slot skill bar below shows the optimal ability placement for the {cls.name}'s top meta build. Click any slot to see its rune recommendation and why it belongs on that key.
                      </div>
                      <SkillBarDisplay skillBar={cls.skillBar} accentColor={ac} />
                    </div>
                  ),
                },
                {
                  id: "rotation",
                  label: "Rotation",
                  icon: Shield,
                  content: (
                    <div className="px-1">
                      <div className="mb-3 p-3 rounded border-l-2 text-xs leading-relaxed"
                        style={{ background: `${ac}08`, borderColor: ac, color: "oklch(0.60 0.010 60)" }}>
                        <span style={{ color: ac, fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.05em" }}>How to Play: </span>
                        Follow these steps in order to play the {cls.name} optimally. Click each step to read the full explanation. Steps are color-coded by when they should be used.
                      </div>
                      <RotationGuide rotation={cls.rotation} accentColor={ac} />
                    </div>
                  ),
                },
                {
                  id: "abilities",
                  label: "All Skills",
                  icon: Zap,
                  content: (
                    <div className="px-1">
                      <div className="flex flex-wrap gap-2 mb-3 p-2 rounded border"
                        style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.20 0.012 30)" }}>
                        <span className="text-xs font-cinzel tracking-widest self-center" style={{ color: "oklch(0.40 0.010 60)" }}>KEYS:</span>
                        {[["LMB","Primary"],["RMB","Damage"],["1–4","Slots"],["Space","Move"],["T","Cooldown"]].map(([k, l]) => (
                          <div key={k} className="flex items-center gap-1">
                            <span className="inline-flex items-center justify-center min-w-[1.8rem] h-4 px-1 rounded text-xs font-bold"
                              style={{ background: "oklch(0.16 0.015 30)", color: ac, border: `1px solid ${ac}44`, fontFamily: "'Courier New', monospace", fontSize: "0.55rem" }}>{k}</span>
                            <span className="text-xs" style={{ color: "oklch(0.48 0.010 60)" }}>{l}</span>
                          </div>
                        ))}
                      </div>
                      <Carousel accentColor={ac} itemWidth={210}>
                        {cls.abilities.map((ability) => (
                          <CompactAbilityCard key={ability.name} ability={ability} accentColor={ac} />
                        ))}
                      </Carousel>
                    </div>
                  ),
                },
                {
                  id: "mastery",
                  label: "Mastery",
                  icon: Shield,
                  content: (
                    <div className="space-y-2 px-1">
                      <div className="p-3 rounded border-l-2 text-xs leading-relaxed"
                        style={{ background: `${ac}08`, borderColor: ac, color: "oklch(0.68 0.010 60)" }}>
                        {cls.masteryNote}
                      </div>
                      <Accordion accentColor={ac} allowMultiple
                        items={cls.masteryTips.map((tip, i) => ({
                          label: `Advanced Tip ${i + 1}`,
                          content: <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>{tip}</p>,
                        }))}
                      />
                    </div>
                  ),
                },
                {
                  id: "weapons",
                  label: "Weapons",
                  icon: Sword,
                  content: (
                    <div className="space-y-2 px-1">
                      {cls.weaponTypes.map((w, i) => {
                        const isExclusive = w.toLowerCase().includes("exclusive");
                        return (
                          <div key={i} className="flex gap-2 p-3 rounded border text-xs"
                            style={{ background: "oklch(0.10 0.010 30)", borderColor: isExclusive ? `${ac}44` : "oklch(0.22 0.015 50)" }}>
                            <Sword size={13} color={isExclusive ? ac : "oklch(0.40 0.010 60)"} className="flex-shrink-0 mt-0.5" />
                            <div>
                              <p style={{ color: "oklch(0.75 0.010 60)" }}>{w}</p>
                              {isExclusive && <span className="font-cinzel tracking-wide" style={{ color: ac, fontSize: "0.6rem" }}>★ Class Exclusive</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ),
                },
              ]}
            />
          </Section>
        )}

        {/* ── META BUILDS ── */}
        {has("builds") && (
          <Section title="Meta Builds" icon={Trophy} accentColor={ac}>
            <Carousel accentColor={ac} itemWidth={260}>
              {cls.metaBuilds.map((build) => (
                <CompactBuildCard key={build.name} build={build} accentColor={ac} />
              ))}
            </Carousel>

            {/* Expanded detail as accordion */}
            <div className="mt-4">
              <Accordion accentColor={ac}
                items={cls.metaBuilds.map((build) => ({
                  label: build.name,
                  badge: `${build.tier} Tier`,
                  badgeColor: build.tier === "S" ? ac : build.tier === "A" ? "oklch(0.70 0.18 145)" : "oklch(0.70 0.18 260)",
                  content: (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 items-center">
                        <TierBadge tier={build.tier} size={28} />
                        <span className="text-xs px-2 py-0.5 rounded-sm"
                          style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.55 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
                          {build.playstyle}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "oklch(0.68 0.010 60)" }}>{build.description}</p>
                      <div>
                        <p className="text-xs font-cinzel tracking-widest uppercase mb-2" style={{ color: "oklch(0.45 0.010 60)" }}>Key Items</p>
                        <div className="flex flex-wrap gap-1.5">
                          {build.keyItems.map((item) => (
                            <ItemPill key={item} name={item} rarity={item.includes("(") ? "set" : "legendary"} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ),
                }))}
              />
            </div>
          </Section>
        )}

        {/* ── CRAFTING ── */}
        {(has("crafting-blacksmith") || has("crafting-jeweler") || has("crafting-mystic")) && (
          <Section title="Crafting & Artisans" icon={Sword} accentColor="#c89b3c" bgImage={SECTION_IMAGES.crafting}>
            <TabPanel accentColor="#c89b3c" tabs={[
              ...(has("crafting-blacksmith") ? [{
                id: "blacksmith", label: "Blacksmith", icon: BlacksmithIcon,
                content: (
                  <div className="space-y-2 px-1">
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "oklch(0.60 0.010 60)" }}>
                      {jewelerGuide.overview.slice(0, 0) /* placeholder */}
                      Level the Blacksmith to rank 12 to unlock level 70 Rare crafting — the foundation of Kanai's Cube upgrades. Salvage all unwanted items to accumulate materials.
                    </p>
                    <Accordion accentColor="#c89b3c" allowMultiple
                      items={[
                        { label: "Leveling Tips", content: <div className="space-y-2">{["Train the Blacksmith as soon as you arrive in New Tristram.", "Salvage all white, blue, and yellow items you don't need to accumulate materials.", "Rank 12 unlocks crafting of level 70 Rare items — reach this as fast as possible.", "The Blacksmith is shared account-wide — you only need to level him once.", "In Seasons, re-level quickly with gold from early rifts."].map((t, i) => <p key={i} className="text-xs leading-relaxed" style={{ color: "oklch(0.70 0.010 60)" }}>• {t}</p>)}</div> },
                        { label: "Key Recipes", content: <div className="space-y-2">{[{ name: "Aughild's Authority", note: "Damage reduction vs. elites — used in many endgame builds." }, { name: "Cain's Destiny", note: "Bonus XP set — excellent for leveling alts." }, { name: "Rare Level 70 Items", note: "Craft Rares to upgrade via Kanai's Cube (Hope of Cain)." }].map((r) => <div key={r.name} className="flex gap-2 text-xs"><ItemPill name={r.name} rarity="rare" /><span style={{ color: "oklch(0.58 0.010 60)" }}>{r.note}</span></div>)}</div> },
                        { label: "Salvage Guide", content: <p className="text-xs leading-relaxed" style={{ color: "oklch(0.70 0.010 60)" }}>White → Reusable Parts · Blue → Arcane Dust · Yellow → Veiled Crystal · Legendary/Set → Forgotten Souls · Primal Ancient → Primordial Ashes. Always salvage rather than sell.</p> },
                      ]}
                    />
                  </div>
                ),
              }] : []),
              ...(has("crafting-jeweler") ? [{
                id: "jeweler", label: "Jeweler", icon: JewelerIcon,
                content: (
                  <div className="space-y-3 px-1">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {jewelerGuide.gemTypes.map((gem) => {
                        const gc: Record<string, string> = { Ruby: "#ef5350", Emerald: "#66bb6a", Amethyst: "#ab47bc", Topaz: "#ffd54f", Diamond: "#e0e0e0" };
                        const c = gc[gem.name] || "#4fc3f7";
                        return (
                          <div key={gem.name} className="p-2.5 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: `${c}44` }}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c, boxShadow: `0 0 5px ${c}88` }} />
                              <span className="font-cinzel font-bold text-xs" style={{ color: c }}>{gem.name}</span>
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: "oklch(0.55 0.010 60)", fontSize: "0.65rem" }}>{gem.bestUse}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <p className="text-xs font-cinzel tracking-wide mb-2" style={{ color: "oklch(0.55 0.010 60)" }}>Top Legendary Gems</p>
                      <Carousel accentColor="#4fc3f7" itemWidth={200}>
                        {jewelerGuide.legendaryGems.map((gem) => (
                          <div key={gem.name} className="p-3 rounded border h-full"
                            style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.72 0.18 55 / 0.3)" }}>
                            <p className="font-cinzel font-bold text-xs mb-1" style={{ color: "oklch(0.78 0.18 55)" }}>{gem.name}</p>
                            <p className="text-xs mb-1" style={{ color: "oklch(0.60 0.010 60)", fontSize: "0.65rem" }}>{gem.primaryEffect.slice(0, 70)}…</p>
                            <p className="text-xs" style={{ color: "#4fc3f7", fontSize: "0.6rem" }}>Best: {gem.bestUse.slice(0, 50)}…</p>
                          </div>
                        ))}
                      </Carousel>
                    </div>
                  </div>
                ),
              }] : []),
              ...(has("crafting-mystic") ? [{
                id: "mystic", label: "Mystic", icon: MysticIcon,
                content: (
                  <div className="space-y-3 px-1">
                    <p className="text-xs leading-relaxed" style={{ color: "oklch(0.60 0.010 60)" }}>
                      Enchanting lets you replace one stat on any item. You're locked into that slot after the first enchant — choose wisely. Costs Veiled Crystal for Rares, Forgotten Souls for Legendaries.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {mysticGuide.enchantingGuide.priorityStats.map((slot) => (
                        <div key={slot.slot} className="p-2.5 rounded border"
                          style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                          <p className="font-cinzel font-bold text-xs mb-1" style={{ color: "#ce93d8" }}>{slot.slot}</p>
                          <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.010 60)", fontSize: "0.65rem" }}>{slot.priority}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              }] : []),
            ]} />
          </Section>
        )}

        {/* ── KANAI'S CUBE ── */}
        {has("kanais-cube") && (
          <Section title="Kanai's Cube" icon={KanaiIcon} accentColor="#ff7043" bgImage={SECTION_IMAGES.kanai}>
            <p className="text-xs mb-3 p-2 rounded border-l-2"
              style={{ color: "oklch(0.60 0.010 60)", background: "#ff704308", borderColor: "#ff7043" }}>
              <span style={{ color: "#ff7043", fontFamily: "'Cinzel', serif", fontSize: "0.65rem" }}>Location: </span>
              {kanaisCubeGuide.location}
            </p>
            <Accordion accentColor="#ff7043" allowMultiple
              items={kanaisCubeGuide.recipes.map((recipe) => ({
                label: recipe.name,
                content: (
                  <div className="space-y-2">
                    <p className="text-xs leading-relaxed" style={{ color: "oklch(0.68 0.010 60)" }}>{recipe.effect}</p>
                    <div className="p-2 rounded border-l-2 text-xs" style={{ background: "#ff704308", borderColor: "#ff7043", color: "oklch(0.58 0.010 60)" }}>
                      <span style={{ color: "#ff7043", fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>TIP: </span>{recipe.tips}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.map((ing) => (
                        <span key={ing} className="text-xs px-2 py-0.5 rounded-sm"
                          style={{ background: "oklch(0.14 0.012 30)", color: "oklch(0.55 0.010 60)", border: "1px solid oklch(0.20 0.012 30)", fontSize: "0.6rem" }}>
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                ),
              }))}
            />
          </Section>
        )}

        {/* ── PARAGON ── */}
        {has("paragon") && (
          <Section title="Paragon System" icon={ParagonIcon} accentColor="#42a5f5" bgImage={SECTION_IMAGES.paragon}>
            <TabPanel accentColor="#42a5f5" tabs={[
              {
                id: "allocation",
                label: `${cls.name} Allocation`,
                icon: BookOpen,
                content: (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-1">
                    {cls.paragons.map((cat) => {
                      const catColors: Record<string, string> = { Core: "#ffb74d", Offense: "#ef5350", Defense: "#42a5f5", Utility: "#66bb6a" };
                      const c = catColors[cat.category] || "#42a5f5";
                      return (
                        <div key={cat.category} className="p-3 rounded border" style={{ background: "oklch(0.10 0.010 30)", borderColor: `${c}33` }}>
                          <p className="font-cinzel font-bold text-xs mb-2" style={{ color: c }}>{cat.category}</p>
                          {cat.priority.map((stat, i) => (
                            <div key={stat} className="mb-2">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ background: `${c}22`, color: c, fontSize: "0.5rem", fontWeight: "bold" }}>{i + 1}</span>
                                <span className="text-xs" style={{ color: "oklch(0.75 0.01 60)" }}>{stat.split("(")[0].trim()}</span>
                              </div>
                              <div className="h-1 rounded-full ml-5 overflow-hidden" style={{ background: "oklch(0.18 0.012 30)" }}>
                                <div className="h-full rounded-full" style={{
                                  width: `${[100, 75, 55, 35][i] || 25}%`,
                                  background: `linear-gradient(90deg, ${c}55, ${c})`,
                                }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ),
              },
              {
                id: "farming",
                label: "Farming Tips",
                icon: ParagonIcon,
                content: (
                  <Accordion accentColor="#42a5f5" allowMultiple
                    items={paragonGuide.farmingTips.map((tip, i) => ({
                      label: `Tip ${i + 1}`,
                      content: <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>{tip}</p>,
                    }))}
                  />
                ),
              },
            ]} />
          </Section>
        )}

        {/* ── SEASONS ── */}
        {has("seasons") && (
          <Section title="Seasons & Journey" icon={SeasonIcon} accentColor="#66bb6a" bgImage={SECTION_IMAGES.seasons}>
            <TabPanel accentColor="#66bb6a" tabs={[
              {
                id: "faststart",
                label: "Fast Start",
                icon: SeasonIcon,
                content: (
                  <Accordion accentColor="#66bb6a" allowMultiple
                    items={seasonsGuide.fastStartGuide.map((step, i) => ({
                      label: `Step ${i + 1}`,
                      badge: i === 0 ? "Do First" : undefined,
                      badgeColor: "#66bb6a",
                      content: <p className="text-sm leading-relaxed" style={{ color: "oklch(0.72 0.010 60)" }}>{step}</p>,
                    }))}
                  />
                ),
              },
              {
                id: "journey",
                label: "Journey Chapters",
                icon: BookOpen,
                content: (
                  <div className="space-y-2 px-1">
                    {seasonsGuide.journeyChapters.map((ch, i) => (
                      <div key={ch.chapter} className="flex gap-3 p-3 rounded border"
                        style={{ background: "oklch(0.10 0.010 30)", borderColor: i < 4 ? "#66bb6a44" : "oklch(0.22 0.015 50)" }}>
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: i < 4 ? "#66bb6a22" : "oklch(0.14 0.012 30)", color: i < 4 ? "#66bb6a" : "oklch(0.45 0.010 60)", border: `1px solid ${i < 4 ? "#66bb6a44" : "oklch(0.20 0.012 30)"}` }}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <span className="font-cinzel font-bold text-xs" style={{ color: "oklch(0.85 0.01 60)" }}>{ch.chapter}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-sm"
                              style={{ background: "#66bb6a18", color: "#66bb6a", border: "1px solid #66bb6a33", fontFamily: "'Cinzel', serif", fontSize: "0.55rem" }}>
                              {ch.rewards}
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: "oklch(0.58 0.010 60)" }}>{ch.objectives}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "conquests",
                label: "Conquests",
                icon: Trophy,
                content: (
                  <div className="space-y-2 px-1">
                    {seasonsGuide.conquests.map((c) => (
                      <div key={c.name} className="p-3 rounded border"
                        style={{ background: "oklch(0.10 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
                        <p className="font-cinzel font-bold text-xs mb-1" style={{ color: "#66bb6a" }}>{c.name}</p>
                        <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.010 60)" }}>{c.description}</p>
                      </div>
                    ))}
                  </div>
                ),
              },
            ]} />
          </Section>
        )}

        {/* ── MAPS LINK ── */}
        {/* Maps is a standalone feature — always show a quick-access link */}
        <div className="flex items-center gap-3 p-4 rounded border mb-8 cursor-pointer transition-all duration-200"
          style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.72 0.18 55 / 0.3)" }}
          onClick={() => navigate("/maps")}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.72 0.18 55 / 0.6)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.72 0.18 55 / 0.3)"; }}
        >
          <div className="flex-shrink-0 w-9 h-9 rounded flex items-center justify-center"
            style={{ background: "oklch(0.72 0.18 55 / 0.12)", border: "1px solid oklch(0.72 0.18 55 / 0.4)" }}>
            <Map size={16} color="oklch(0.78 0.18 55)" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.78 0.18 55)" }}>Interactive Maps</p>
            <p className="text-xs" style={{ color: "oklch(0.50 0.010 60)" }}>All 5 Acts — zone layouts, loot, keywardens, elite packs &amp; farming routes</p>
          </div>
          <ChevronLeft size={14} color="oklch(0.55 0.010 60)" className="flex-shrink-0 rotate-180" />
        </div>

        {/* ── Restart CTA ── */}
        <div className="mt-8 p-5 rounded border text-center"
          style={{ background: "oklch(0.10 0.010 30)", borderColor: `${ac}33` }}>
          <p className="font-cinzel font-bold text-sm mb-1" style={{ color: "oklch(0.90 0.01 60)" }}>Want a different guide?</p>
          <p className="text-xs mb-3" style={{ color: "oklch(0.50 0.010 60)" }}>Start over to pick a different class, level, or focus areas.</p>
          <button onClick={() => { reset(); navigate("/"); }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded font-cinzel font-bold text-xs tracking-wide"
            style={{ background: ac, color: "oklch(0.08 0 0)" }}>
            <RotateCcw size={12} /> Build a New Guide
          </button>
        </div>
      </div>
    </div>
  );
}
