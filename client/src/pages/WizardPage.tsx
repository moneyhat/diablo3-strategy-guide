// Sanctuary Grimoire — Guided Wizard / Checkout Flow with portraits and icons
import { useState } from "react";
import { useLocation } from "wouter";
import { classes } from "@/data/classes";
import { useWizard, FocusArea } from "@/contexts/WizardContext";
import { CLASS_PORTRAITS, CLASS_SIGILS, KanaiIcon, SeasonIcon, ParagonIcon, BlacksmithIcon, JewelerIcon, MysticIcon, ELEMENT_ICONS } from "@/components/Icons";
import { ChevronRight, ChevronLeft, Check, Zap, Trophy, Shield, Map } from "lucide-react";

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300"
            style={{
              background: i < step ? "oklch(0.72 0.18 55)" : i === step ? "oklch(0.72 0.18 55 / 0.2)" : "oklch(0.14 0.012 30)",
              border: i <= step ? "1px solid oklch(0.72 0.18 55)" : "1px solid oklch(0.22 0.015 50)",
              color: i < step ? "oklch(0.08 0 0)" : i === step ? "oklch(0.78 0.18 55)" : "oklch(0.45 0.010 60)",
            }}
          >
            {i < step ? <Check size={12} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className="h-px w-8 md:w-16 transition-all duration-500"
              style={{ background: i < step ? "oklch(0.72 0.18 55)" : "oklch(0.22 0.015 50)" }} />
          )}
        </div>
      ))}
    </div>
  );
}

const STEP_LABELS = ["Choose Class", "Set Level", "Pick Focus", "Your Guide"];

// ─── Step 1: Class Picker with Portraits ─────────────────────────────────────
function StepClass({ onNext }: { onNext: () => void }) {
  const { state, setClass } = useWizard();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="font-cinzel-decorative font-black text-2xl md:text-3xl mb-2 text-center"
        style={{ color: "oklch(0.90 0.01 60)" }}>
        Who are you?
      </h2>
      <p className="text-center text-sm mb-8" style={{ color: "oklch(0.55 0.010 60)" }}>
        Choose the class you are playing. Your entire guide will be tailored to this choice.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {classes.map((cls) => {
          const isSelected = state.classId === cls.id;
          const portrait = CLASS_PORTRAITS[cls.id];
          const Sigil = CLASS_SIGILS[cls.id];
          return (
            <button
              key={cls.id}
              onClick={() => setClass(cls.id)}
              className="relative text-left rounded border overflow-hidden group transition-all duration-300"
              style={{
                borderColor: isSelected ? cls.color : "oklch(0.22 0.015 50)",
                boxShadow: isSelected ? `0 0 28px ${cls.color}44, 0 4px 20px rgba(0,0,0,0.5)` : "0 2px 8px rgba(0,0,0,0.3)",
                transform: isSelected ? "scale(1.03)" : "scale(1)",
              }}
            >
              {/* Portrait image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "2/3", maxHeight: "220px" }}>
                <img
                  src={portrait}
                  alt={cls.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: isSelected ? "none" : "brightness(0.7) saturate(0.8)" }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{
                  background: isSelected
                    ? `linear-gradient(to top, ${cls.color}cc 0%, ${cls.color}22 50%, transparent 100%)`
                    : "linear-gradient(to top, oklch(0.07 0.008 30) 0%, oklch(0.07 0.008 30 / 0.4) 50%, transparent 100%)"
                }} />
                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: cls.color }}>
                    <Check size={12} color="oklch(0.08 0 0)" />
                  </div>
                )}
                {/* Class name overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-2">
                    {Sigil && <Sigil size={20} color={isSelected ? cls.color : "oklch(0.80 0.01 60)"} />}
                    <div>
                      <h3 className="font-cinzel font-bold text-sm leading-tight"
                        style={{ color: isSelected ? cls.color : "oklch(0.90 0.01 60)" }}>
                        {cls.name}
                      </h3>
                      <p className="text-xs" style={{ color: "oklch(0.60 0.010 60)" }}>
                        {cls.resource.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Stat row */}
              <div className="px-3 py-2" style={{ background: "oklch(0.10 0.010 30)" }}>
                <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "oklch(0.52 0.010 60)" }}>
                  {cls.overview.slice(0, 80)}…
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={!state.classId}
          className="flex items-center gap-2 px-8 py-3 rounded font-cinzel font-bold text-sm tracking-wide transition-all duration-200"
          style={{
            background: state.classId ? "oklch(0.72 0.18 55)" : "oklch(0.18 0.010 30)",
            color: state.classId ? "oklch(0.08 0 0)" : "oklch(0.40 0.010 60)",
            cursor: state.classId ? "pointer" : "not-allowed",
          }}
        >
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Level Picker ─────────────────────────────────────────────────────
const LEVEL_PRESETS = [
  { label: "Fresh Start", range: "1–15", value: 8, desc: "Just beginning your journey" },
  { label: "Early Game", range: "16–30", value: 23, desc: "Learning your class skills" },
  { label: "Mid Game", range: "31–60", value: 45, desc: "Building toward powerful combos" },
  { label: "Pre-Endgame", range: "61–69", value: 65, desc: "Approaching the level cap" },
  { label: "Max Level", range: "70", value: 70, desc: "The endgame begins here" },
  { label: "Paragon", range: "70+", value: 71, desc: "Greater Rifts and augmenting" },
];

function StepLevel({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { state, setLevel } = useWizard();
  const cls = classes.find((c) => c.id === state.classId)!;
  const portrait = CLASS_PORTRAITS[cls.id];
  const [sliderVal, setSliderVal] = useState(state.level || 1);

  const activePreset = LEVEL_PRESETS.find((p) => {
    if (p.value === 71) return sliderVal >= 71;
    if (p.value === 70) return sliderVal === 70;
    const [min, max] = p.range.split("–").map(Number);
    return sliderVal >= min && sliderVal <= max;
  });

  const handleSlider = (v: number) => { setSliderVal(v); setLevel(v); };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="font-cinzel-decorative font-black text-2xl md:text-3xl mb-2 text-center"
        style={{ color: "oklch(0.90 0.01 60)" }}>
        What is your level?
      </h2>
      <p className="text-center text-sm mb-6" style={{ color: "oklch(0.55 0.010 60)" }}>
        Your guide will be filtered to content relevant to your current progression.
      </p>

      <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto mb-8">
        {/* Portrait sidebar */}
        <div className="flex-shrink-0 flex flex-col items-center gap-3">
          <div className="relative rounded overflow-hidden w-32 md:w-40"
            style={{ border: `2px solid ${cls.color}66`, boxShadow: `0 0 20px ${cls.color}33` }}>
            <img src={portrait} alt={cls.name} className="w-full object-cover object-top"
              style={{ aspectRatio: "2/3" }} />
            <div className="absolute inset-0" style={{
              background: `linear-gradient(to top, ${cls.color}99 0%, transparent 60%)`
            }} />
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <span className="font-cinzel font-bold text-xs" style={{ color: cls.color }}>{cls.name}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="font-cinzel-decorative font-black text-3xl" style={{ color: cls.color }}>
              {sliderVal >= 71 ? "70+" : sliderVal}
            </div>
            <div className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.50 0.010 60)" }}>
              {activePreset?.label || "Custom"}
            </div>
          </div>
        </div>

        {/* Level selection */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
            {LEVEL_PRESETS.map((preset) => {
              const isActive = activePreset?.value === preset.value;
              return (
                <button key={preset.value} onClick={() => handleSlider(preset.value)}
                  className="p-3 rounded border text-left transition-all duration-200"
                  style={{
                    background: isActive ? `${cls.color}15` : "oklch(0.10 0.010 30)",
                    borderColor: isActive ? cls.color : "oklch(0.22 0.015 50)",
                    boxShadow: isActive ? `0 0 12px ${cls.color}22` : "none",
                  }}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-cinzel font-bold text-xs"
                      style={{ color: isActive ? cls.color : "oklch(0.80 0.01 60)" }}>
                      {preset.label}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded-sm font-mono"
                      style={{
                        background: isActive ? `${cls.color}22` : "oklch(0.14 0.012 30)",
                        color: isActive ? cls.color : "oklch(0.50 0.010 60)",
                        border: `1px solid ${isActive ? cls.color + "44" : "oklch(0.20 0.012 30)"}`,
                        fontSize: "0.6rem",
                      }}>
                      {preset.range}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "oklch(0.48 0.010 60)" }}>{preset.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Fine-tune slider */}
          <div className="p-4 rounded border" style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.22 0.015 50)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.50 0.010 60)" }}>Fine-tune your level</span>
              <div className="flex items-center gap-2">
                <span className="font-cinzel-decorative font-black text-lg" style={{ color: cls.color }}>
                  {sliderVal >= 71 ? "70+" : sliderVal}
                </span>
                <span className="text-xs font-cinzel" style={{ color: "oklch(0.45 0.010 60)" }}>
                  {sliderVal >= 71 ? "Paragon" : sliderVal === 70 ? "Max Level" : `Level ${sliderVal}`}
                </span>
              </div>
            </div>

            {/* Custom styled slider */}
            <div className="relative mb-3">
              <input
                type="range"
                min={1}
                max={71}
                step={1}
                value={sliderVal}
                onChange={(e) => handleSlider(Number(e.target.value))}
                className="w-full cursor-pointer"
                style={{
                  WebkitAppearance: "none",
                  appearance: "none",
                  height: "6px",
                  borderRadius: "9999px",
                  outline: "none",
                  background: `linear-gradient(to right, ${cls.color} 0%, ${cls.color} ${((sliderVal - 1) / (71 - 1)) * 100}%, oklch(0.22 0.015 50) ${((sliderVal - 1) / (71 - 1)) * 100}%, oklch(0.22 0.015 50) 100%)`,
                  accentColor: cls.color,
                }}
              />
            </div>

            {/* Tick marks — absolutely positioned to match slider thumb positions */}
            <div className="relative h-6 mt-1">
              {[
                { val: 1, label: "1" },
                { val: 15, label: "15" },
                { val: 30, label: "30" },
                { val: 45, label: "45" },
                { val: 60, label: "60" },
                { val: 70, label: "70" },
                { val: 71, label: "70+" },
              ].map(({ val, label }) => {
                // Calculate exact percentage position matching the slider's internal thumb position
                // The browser offsets the thumb by ~7px on each side, so we use the same formula
                const pct = ((val - 1) / (71 - 1)) * 100;
                return (
                  <button
                    key={val}
                    onClick={() => handleSlider(val)}
                    className="absolute flex flex-col items-center gap-0.5 transition-colors -translate-x-1/2"
                    style={{ left: `${pct}%` }}
                  >
                    <div
                      className="w-0.5 h-1.5 rounded-full"
                      style={{ background: sliderVal >= val ? cls.color : "oklch(0.28 0.015 50)" }}
                    />
                    <span
                      className="font-cinzel whitespace-nowrap"
                      style={{
                        color: sliderVal === val ? cls.color : "oklch(0.40 0.010 60)",
                        fontSize: "0.55rem",
                        fontWeight: sliderVal === val ? "bold" : "normal",
                      }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Numeric input for precise entry */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t" style={{ borderColor: "oklch(0.18 0.012 30)" }}>
              <span className="text-xs font-cinzel tracking-wide flex-shrink-0" style={{ color: "oklch(0.45 0.010 60)" }}>Enter exact level:</span>
              <input
                type="number"
                min={1}
                max={71}
                value={sliderVal >= 71 ? 71 : sliderVal}
                onChange={(e) => {
                  const v = Math.min(71, Math.max(1, Number(e.target.value)));
                  handleSlider(v);
                }}
                className="w-16 px-2 py-1 rounded border text-center text-xs font-mono font-bold"
                style={{
                  background: "oklch(0.12 0.012 30)",
                  borderColor: `${cls.color}55`,
                  color: cls.color,
                  outline: "none",
                }}
              />
              <span className="text-xs" style={{ color: "oklch(0.38 0.010 60)" }}>(1–70, or 71 for Paragon)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between max-w-3xl mx-auto">
        <button onClick={onBack}
          className="flex items-center gap-2 px-6 py-2.5 rounded border font-cinzel text-sm transition-all duration-200"
          style={{ borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.55 0.010 60)", background: "transparent" }}>
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={onNext}
          className="flex items-center gap-2 px-8 py-2.5 rounded font-cinzel font-bold text-sm tracking-wide"
          style={{ background: "oklch(0.72 0.18 55)", color: "oklch(0.08 0 0)" }}>
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Focus Picker with Icons ─────────────────────────────────────────
const FOCUS_OPTIONS: {
  id: FocusArea;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}[] = [
  { id: "combat", label: "Combat & Abilities", desc: "Skills, rotations, keybindings", icon: Zap },
  { id: "builds", label: "Meta Builds", desc: "Top builds, key items, tier rankings", icon: Trophy },
  { id: "leveling", label: "Leveling Guide", desc: "Phase-by-phase tips, levels 1–70", icon: Shield },
  { id: "crafting-blacksmith", label: "Blacksmith", desc: "Crafting, salvaging, materials", icon: BlacksmithIcon },
  { id: "crafting-jeweler", label: "Jeweler & Gems", desc: "Gem upgrades, Legendary Gems", icon: JewelerIcon },
  { id: "crafting-mystic", label: "Mystic & Enchanting", desc: "Rerolling stats, priority affixes", icon: MysticIcon },
  { id: "kanais-cube", label: "Kanai's Cube", desc: "Recipes, extraction, augmenting", icon: KanaiIcon },
  { id: "paragon", label: "Paragon System", desc: "Point allocation, farming", icon: ParagonIcon },
  { id: "seasons", label: "Seasons & Journey", desc: "Season start, chapters, rewards", icon: SeasonIcon },
];

function StepFocus({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { state, toggleFocus } = useWizard();
  const cls = classes.find((c) => c.id === state.classId)!;

  const selectAll = () => {
    FOCUS_OPTIONS.forEach((f) => { if (!state.focusAreas.includes(f.id)) toggleFocus(f.id); });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl mx-auto">
      <h2 className="font-cinzel-decorative font-black text-2xl md:text-3xl mb-2 text-center"
        style={{ color: "oklch(0.90 0.01 60)" }}>
        What do you need?
      </h2>
      <p className="text-center text-sm mb-2" style={{ color: "oklch(0.55 0.010 60)" }}>
        Select all areas you want in your personalized guide.
      </p>
      <div className="flex justify-center mb-5">
        <button onClick={selectAll}
          className="text-xs font-cinzel tracking-wide px-3 py-1 rounded border transition-all duration-200"
          style={{ borderColor: `${cls.color}44`, color: cls.color, background: `${cls.color}10` }}>
          Select All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {FOCUS_OPTIONS.map((opt) => {
          const isSelected = state.focusAreas.includes(opt.id);
          const Icon = opt.icon;
          return (
            <button key={opt.id} onClick={() => toggleFocus(opt.id)}
              className="flex items-center gap-3 p-4 rounded border text-left transition-all duration-200"
              style={{
                background: isSelected ? `${cls.color}12` : "oklch(0.10 0.010 30)",
                borderColor: isSelected ? cls.color : "oklch(0.22 0.015 50)",
                boxShadow: isSelected ? `0 0 12px ${cls.color}18` : "none",
              }}>
              <div className="flex-shrink-0 w-9 h-9 rounded flex items-center justify-center"
                style={{
                  background: isSelected ? `${cls.color}22` : "oklch(0.14 0.012 30)",
                  border: `1px solid ${isSelected ? cls.color + "44" : "oklch(0.20 0.012 30)"}`,
                }}>
                <Icon size={18} color={isSelected ? cls.color : "oklch(0.45 0.010 60)"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-cinzel font-bold text-xs"
                    style={{ color: isSelected ? cls.color : "oklch(0.80 0.01 60)" }}>
                    {opt.label}
                  </span>
                  {isSelected && (
                    <div className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: cls.color }}>
                      <Check size={9} color="oklch(0.08 0 0)" />
                    </div>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.010 60)" }}>{opt.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack}
          className="flex items-center gap-2 px-6 py-2.5 rounded border font-cinzel text-sm transition-all duration-200"
          style={{ borderColor: "oklch(0.22 0.015 50)", color: "oklch(0.55 0.010 60)", background: "transparent" }}>
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={onNext} disabled={state.focusAreas.length === 0}
          className="flex items-center gap-2 px-8 py-2.5 rounded font-cinzel font-bold text-sm tracking-wide transition-all duration-200"
          style={{
            background: state.focusAreas.length > 0 ? "oklch(0.72 0.18 55)" : "oklch(0.18 0.010 30)",
            color: state.focusAreas.length > 0 ? "oklch(0.08 0 0)" : "oklch(0.40 0.010 60)",
            cursor: state.focusAreas.length > 0 ? "pointer" : "not-allowed",
          }}>
          Build My Guide <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Wizard Shell ─────────────────────────────────────────────────────────────
export default function WizardPage() {
  const [step, setStep] = useState(0);
  const [, navigate] = useLocation();
  const { state, reset } = useWizard();
  const cls = state.classId ? classes.find((c) => c.id === state.classId) : null;

  const goNext = () => {
    if (step === 2) navigate(`/guide/${state.classId}`);
    else setStep((s) => s + 1);
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: cls
        ? `radial-gradient(ellipse at 50% 0%, ${cls.color}08 0%, oklch(0.07 0.008 30) 60%)`
        : "oklch(0.07 0.008 30)",
    }}>
      {/* Header */}
      <header className="border-b px-4 py-4 flex items-center justify-between"
        style={{ borderColor: "oklch(0.22 0.015 50)", background: "oklch(0.07 0.008 30 / 0.95)" }}>
        <button onClick={() => { reset(); navigate("/"); }}
          className="font-cinzel-decorative text-base font-bold tracking-wider"
          style={{ color: "oklch(0.78 0.18 55)" }}>
          D3 Guide
        </button>
        <ProgressBar step={step} total={3} />
        <div className="flex items-center gap-3">
          <div className="text-xs font-cinzel tracking-wide" style={{ color: "oklch(0.45 0.010 60)" }}>
            {STEP_LABELS[step]}
          </div>
          <button
            onClick={() => navigate("/maps")}
            className="flex items-center gap-1.5 text-xs font-cinzel tracking-wide px-3 py-1.5 rounded border transition-all duration-200"
            style={{
              borderColor: "oklch(0.72 0.18 55 / 0.4)",
              color: "oklch(0.78 0.18 55)",
              background: "oklch(0.72 0.18 55 / 0.08)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.72 0.18 55 / 0.18)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.72 0.18 55 / 0.08)"; }}
          >
            <Map size={12} />
            Maps
          </button>
        </div>
      </header>

      {/* Step breadcrumb */}
      <div className="border-b px-4 py-2 hidden md:flex items-center justify-center gap-8"
        style={{ borderColor: "oklch(0.18 0.012 30)", background: "oklch(0.08 0.010 30)" }}>
        {STEP_LABELS.slice(0, 3).map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-cinzel tracking-wide"
              style={{ color: i === step ? (cls?.color || "oklch(0.78 0.18 55)") : "oklch(0.40 0.010 60)" }}>
              {i + 1}. {label}
            </span>
            {i < 2 && <ChevronRight size={12} color="oklch(0.30 0.010 60)" />}
          </div>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-4xl">
          {step === 0 && <StepClass onNext={goNext} />}
          {step === 1 && <StepLevel onNext={goNext} onBack={goBack} />}
          {step === 2 && <StepFocus onNext={goNext} onBack={goBack} />}
        </div>
      </main>

      {/* Standalone Maps entry — always visible below the steps */}
      {step === 0 && (
        <div className="px-4 pb-6 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3 p-4 rounded border transition-all duration-200 cursor-pointer"
            style={{ background: "oklch(0.09 0.010 30)", borderColor: "oklch(0.72 0.18 55 / 0.3)" }}
            onClick={() => navigate("/maps")}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.72 0.18 55 / 0.6)"; (e.currentTarget as HTMLDivElement).style.background = "oklch(0.72 0.18 55 / 0.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.72 0.18 55 / 0.3)"; (e.currentTarget as HTMLDivElement).style.background = "oklch(0.09 0.010 30)"; }}
          >
            <div className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center"
              style={{ background: "oklch(0.72 0.18 55 / 0.12)", border: "1px solid oklch(0.72 0.18 55 / 0.4)" }}>
              <Map size={18} color="oklch(0.78 0.18 55)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-cinzel font-bold text-sm" style={{ color: "oklch(0.78 0.18 55)" }}>Interactive Maps</p>
              <p className="text-xs" style={{ color: "oklch(0.50 0.010 60)" }}>Explore all 5 Acts — zone layouts, loot locations, keywardens, elite packs &amp; farming routes</p>
            </div>
            <ChevronRight size={16} color="oklch(0.55 0.010 60)" className="flex-shrink-0" />
          </div>
        </div>
      )}

      <div className="text-center py-4 text-xs" style={{ color: "oklch(0.35 0.010 60)" }}>
        {step === 0 && "Select your class to continue"}
        {step === 1 && "Choose a preset or drag the slider to your exact level"}
        {step === 2 && `${state.focusAreas.length} area${state.focusAreas.length !== 1 ? "s" : ""} selected`}
      </div>
    </div>
  );
}
