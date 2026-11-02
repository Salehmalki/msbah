import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Undo2, Maximize2, Minimize2, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { DhikrFormula } from '../types';
import { formatNumber } from '../utils/arabic';

interface TasbeehCounterProps {
  currentRoundCount: number;
  todayCount: number;
  totalCount: number;
  roundLimit: number;
  selectedFormula: DhikrFormula;
  useArabicDigits: boolean;
  tapAnywhere: boolean;
  isAutoActive: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onResetRound: () => void;
  onToggleAuto: () => void;
  onSetRoundLimit: (limit: number) => void;
  onOpenFormulas: () => void;
  onNextFormula: () => void;
  onPrevFormula: () => void;
}

export const TasbeehCounter: React.FC<TasbeehCounterProps> = ({
  currentRoundCount,
  roundLimit,
  selectedFormula,
  useArabicDigits,
  tapAnywhere,
  isAutoActive,
  onIncrement,
  onDecrement,
  onResetRound,
  onToggleAuto,
  onSetRoundLimit,
  onOpenFormulas,
  onNextFormula,
  onPrevFormula,
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard shortcut listener (Spacebar or Enter to increment)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        // Prevent default spacebar scrolling
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        e.preventDefault();
        onIncrement();
        setIsPressing(true);
        setTimeout(() => setIsPressing(false), 150);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onIncrement]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // SVG Progress calculation
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = roundLimit > 0 ? Math.min(1, currentRoundCount / roundLimit) : 1;
  const strokeDashoffset = circumference - progressPercent * circumference;

  const roundTargets = [
    { label: '٣٣', value: 33 },
    { label: '٧٠', value: 70 },
    { label: '١٠٠', value: 100 },
    { label: '١٠٠٠', value: 1000 },
    { label: 'حر', value: 0 },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      
      {/* Active Formula Display Card */}
      <div className="w-full relative rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 md:p-6 mb-6 text-center backdrop-blur-sm transition-all hover:border-emerald-500/30">
        
        {/* Top bar of card */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
          <span className="font-medium text-emerald-400/90">{selectedFormula.source}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevFormula}
              title="الصيغة السابقة"
              className="p-1 hover:text-emerald-400 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenFormulas}
              className="flex items-center gap-1 text-slate-400 hover:text-emerald-300 font-medium px-2 py-0.5 rounded transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>الصيغ المأثورة</span>
            </button>
            <button
              onClick={onNextFormula}
              title="الصيغة التالية"
              className="p-1 hover:text-emerald-400 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* The Arabic Supplication in Calligraphic Font */}
        <h2 className="font-amiri text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed text-slate-100 min-h-[4rem] flex items-center justify-center px-2 select-none">
          {selectedFormula.arabic}
        </h2>

        {/* Translation / Virtue hint */}
        <p className="mt-2 text-xs md:text-sm text-slate-400 line-clamp-2 max-w-lg mx-auto">
          {selectedFormula.translation}
        </p>
      </div>

      {/* Main Tactile Radial Counter */}
      <div className="relative my-2 flex items-center justify-center">
        
        {/* Glow halo */}
        <div className="absolute inset-0 -m-4 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        {/* SVG Progress Ring */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
            {/* Background Track */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className="text-slate-800/80 stroke-current"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated Progress Stroke */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className="text-emerald-500 stroke-current transition-all duration-200 ease-out"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={roundLimit > 0 ? strokeDashoffset : 0}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Central Touch Target Button */}
          <button
            onClick={onIncrement}
            onMouseDown={() => setIsPressing(true)}
            onMouseUp={() => setIsPressing(false)}
            onTouchStart={() => setIsPressing(true)}
            onTouchEnd={() => setIsPressing(false)}
            aria-label="استغفر"
            className={`absolute inset-4 md:inset-5 rounded-full flex flex-col items-center justify-center cursor-pointer select-none transition-transform duration-100 focus:outline-none ${
              isPressing ? 'scale-[0.96] bg-emerald-950/40' : 'hover:scale-[1.01]'
            } bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/60 shadow-2xl shadow-emerald-950/40`}
          >
            {/* Round Target Indicator */}
            <div className="text-xs md:text-sm text-slate-400 mb-1 font-medium">
              {roundLimit > 0 ? (
                <span>
                  جولة {formatNumber(roundLimit, useArabicDigits)}
                </span>
              ) : (
                <span>مفتوح (حر)</span>
              )}
            </div>

            {/* Central Number Display */}
            <div className="tabular-numbers text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              {formatNumber(currentRoundCount, useArabicDigits)}
            </div>

            {/* Big Action Calligraphy Verb */}
            <div className="mt-2 text-xl md:text-2xl font-bold font-amiri text-emerald-400 tracking-wide">
              استغفر
            </div>

            {/* Micro instruction */}
            <div className="mt-1 text-[11px] text-slate-400">
              انقر أو اضغط مسافة
            </div>
          </button>
        </div>

      </div>

      {/* Round Target Selector (Segmented buttons) */}
      <div className="w-full mt-6 flex flex-col items-center gap-3">
        <div className="text-xs text-slate-400 font-medium">
          تحديد هدف الجولة:
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl">
          {roundTargets.map((target) => (
            <button
              key={target.value}
              onClick={() => onSetRoundLimit(target.value)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                roundLimit === target.value
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {target.label}
            </button>
          ))}
        </div>
      </div>

      {/* Auxiliary Operational Controls */}
      <div className="w-full mt-6 grid grid-cols-4 gap-2 pt-4 border-t border-slate-800/80">
        
        {/* Auto Counter Toggle */}
        <button
          onClick={onToggleAuto}
          className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-medium transition-all ${
            isAutoActive
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
              : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          {isAutoActive ? (
            <Pause className="h-4 w-4 mb-1 text-amber-400" />
          ) : (
            <Play className="h-4 w-4 mb-1" />
          )}
          <span>{isAutoActive ? 'إيقاف التلقائي' : 'استغفار تلقائي'}</span>
        </button>

        {/* Undo last count */}
        <button
          onClick={onDecrement}
          title="تراجع عن نقرة واحدة"
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs font-medium transition-all"
        >
          <Undo2 className="h-4 w-4 mb-1" />
          <span>تراجع (-١)</span>
        </button>

        {/* Reset Current Round */}
        <button
          onClick={onResetRound}
          title="تصفير عداد الجولة الحالية"
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs font-medium transition-all"
        >
          <RotateCcw className="h-4 w-4 mb-1" />
          <span>تصفير الجولة</span>
        </button>

        {/* Fullscreen Mode */}
        <button
          onClick={toggleFullscreen}
          title="وضع الشاشة الكاملة"
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs font-medium transition-all"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4 mb-1" />
          ) : (
            <Maximize2 className="h-4 w-4 mb-1" />
          )}
          <span>ملء الشاشة</span>
        </button>

      </div>

    </div>
  );
};
