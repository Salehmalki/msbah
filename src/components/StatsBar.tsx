import React from 'react';
import { Flame, Target, Trophy, Clock } from 'lucide-react';
import { formatNumber } from '../utils/arabic';

interface StatsBarProps {
  todayCount: number;
  todayRounds: number;
  totalCount: number;
  dailyGoal: number;
  streak: number;
  useArabicDigits: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  todayCount,
  todayRounds,
  totalCount,
  dailyGoal,
  streak,
  useArabicDigits,
}) => {
  const goalPercent = dailyGoal > 0 ? Math.min(100, Math.round((todayCount / dailyGoal) * 100)) : 0;

  return (
    <div className="w-full">
      {/* 3 Core Metric Cards as directly requested */}
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        
        {/* Metric 1: استغفار اليوم */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-900/60 p-4 md:p-5 transition-all hover:border-emerald-500/35">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-xs md:text-sm font-medium text-slate-400">
              استغفار اليوم
            </span>
            <Clock className="h-4 w-4 text-emerald-400/80 shrink-0" />
          </div>
          <div className="tabular-numbers text-2xl md:text-4xl font-bold tracking-tight text-emerald-400">
            {formatNumber(todayCount, useArabicDigits)}
          </div>
          {dailyGoal > 0 && (
            <div className="mt-2 text-[11px] md:text-xs text-slate-500 flex items-center gap-1.5">
              <span>الهدف: {formatNumber(dailyGoal, useArabicDigits)}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">
                %{formatNumber(goalPercent, useArabicDigits)}
              </span>
            </div>
          )}
        </div>

        {/* Metric 2: جولات مكتملة */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-xs md:text-sm font-medium text-slate-400">
              جولات مكتملة
            </span>
            <Target className="h-4 w-4 text-amber-400/80 shrink-0" />
          </div>
          <div className="tabular-numbers text-2xl md:text-4xl font-bold tracking-tight text-amber-300">
            {formatNumber(todayRounds, useArabicDigits)}
          </div>
          <div className="mt-2 text-[11px] md:text-xs text-slate-500">
            جولة اليوم
          </div>
        </div>

        {/* Metric 3: إجمالي الاستغفار */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5 transition-all hover:border-slate-700">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-xs md:text-sm font-medium text-slate-400">
              إجمالي الاستغفار
            </span>
            <Trophy className="h-4 w-4 text-cyan-400/80 shrink-0" />
          </div>
          <div className="tabular-numbers text-2xl md:text-4xl font-bold tracking-tight text-cyan-300">
            {formatNumber(totalCount, useArabicDigits)}
          </div>
          <div className="mt-2 text-[11px] md:text-xs text-slate-500 flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-orange-400 shrink-0" />
            <span>تتابع: {formatNumber(streak, useArabicDigits)} يوم</span>
          </div>
        </div>

      </div>
    </div>
  );
};
