import React, { useState } from 'react';
import { formatNumber, formatArabicDate, getTodayKey } from '../utils/arabic';
import { Calendar, Flame, Trophy, TrendingUp, RotateCcw, AlertTriangle } from 'lucide-react';

interface HistoryAnalyticsProps {
  history: Record<string, { count: number; rounds: number }>;
  todayCount: number;
  todayRounds: number;
  totalCount: number;
  totalRounds: number;
  streak: number;
  useArabicDigits: boolean;
  onResetAll: () => void;
}

export const HistoryAnalytics: React.FC<HistoryAnalyticsProps> = ({
  history,
  todayCount,
  todayRounds,
  totalCount,
  totalRounds,
  streak,
  useArabicDigits,
  onResetAll,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Generate last 7 days data
  const last7Days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;

    const count = i === 0 ? todayCount : (history[key]?.count || 0);
    const rounds = i === 0 ? todayRounds : (history[key]?.rounds || 0);

    const dayName = new Intl.DateTimeFormat('ar-SA', { weekday: 'narrow' }).format(d);

    last7Days.push({
      dateKey: key,
      dayName,
      count,
      rounds,
      isToday: i === 0,
    });
  }

  // Find max count for scaling chart
  const maxCount = Math.max(...last7Days.map((d) => d.count), 50);

  // Calculate highest recorded day
  const allHistoryDays = Object.entries(history);
  let bestDayRecord = todayCount;
  allHistoryDays.forEach(([_, data]) => {
    if (data.count > bestDayRecord) {
      bestDayRecord = data.count;
    }
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-amiri text-emerald-400">
            سجل الاستغفار والإحصائيات
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            متابعة إنجازك الروحي واستمرارية أورادك اليومية
          </p>
        </div>
        <button
          onClick={() => setShowConfirmReset(true)}
          className="flex items-center gap-1.5 self-start md:self-auto text-xs text-rose-400/80 hover:text-rose-400 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>إعادة تعيين السجل</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-right">
            <div className="flex items-center gap-2 text-rose-400 mb-3">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-bold text-lg text-white">تأكيد تصفير السجل</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              هل أنت متأكد من رغبتك في مسح كافة إحصائيات الاستغفار والجولات والبدء من جديد؟ لن يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  onResetAll();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-500"
              >
                تأكيد المسح
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-right">
          <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Flame className="h-4 w-4 text-orange-400" />
            التتابع الحالي
          </span>
          <div className="tabular-numbers text-2xl font-bold text-orange-400">
            {formatNumber(streak, useArabicDigits)}
            <span className="text-xs font-normal text-slate-400 mr-1">يوم</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-right">
          <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Trophy className="h-4 w-4 text-amber-400" />
            أعلى رقم يومي
          </span>
          <div className="tabular-numbers text-2xl font-bold text-amber-300">
            {formatNumber(bestDayRecord, useArabicDigits)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-right">
          <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            إجمالي الجولات
          </span>
          <div className="tabular-numbers text-2xl font-bold text-emerald-400">
            {formatNumber(totalRounds, useArabicDigits)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-right">
          <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Calendar className="h-4 w-4 text-cyan-400" />
            إجمالي الاستغفار
          </span>
          <div className="tabular-numbers text-2xl font-bold text-cyan-300">
            {formatNumber(totalCount, useArabicDigits)}
          </div>
        </div>
      </div>

      {/* 7-Day Bar Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 md:p-6 mb-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 text-right">
          نشاط الاستغفار خلال آخر ٧ أيام
        </h3>

        <div className="flex items-end justify-between gap-2 h-44 pt-6 px-2">
          {last7Days.map((item) => {
            const heightPercent = maxCount > 0 ? Math.max(8, (item.count / maxCount) * 100) : 8;

            return (
              <div key={item.dateKey} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] tabular-numbers text-slate-400 group-hover:text-emerald-400 transition-colors">
                  {formatNumber(item.count, useArabicDigits)}
                </span>
                
                <div className="w-full max-w-[36px] bg-slate-800/80 rounded-t-lg h-32 flex items-end overflow-hidden p-0.5">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      item.isToday
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                        : item.count > 0
                        ? 'bg-emerald-600/60 group-hover:bg-emerald-500'
                        : 'bg-slate-700/30'
                    }`}
                  />
                </div>

                <span
                  className={`text-xs font-semibold ${
                    item.isToday ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {item.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-3 text-right">
          سجل الأيام السابقة
        </h3>

        {allHistoryDays.length === 0 && todayCount === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            لا توجد سجلات مسجلة بعد. ابدأ استغفارك اليوم لتسجيل إنجازك المبارك!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {/* Show today */}
            {todayCount > 0 && (
              <div className="py-3 flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold text-emerald-400">اليوم</span>
                  <span className="text-xs text-slate-400 mr-2">
                    ({formatArabicDate(getTodayKey())})
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400">
                    {formatNumber(todayRounds, useArabicDigits)} جولة
                  </span>
                  <span className="tabular-numbers font-bold text-emerald-400">
                    {formatNumber(todayCount, useArabicDigits)} استغفار
                  </span>
                </div>
              </div>
            )}

            {/* Past recorded days */}
            {allHistoryDays
              .filter(([k]) => k !== getTodayKey())
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 14)
              .map(([dateKey, data]) => (
                <div key={dateKey} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <span className="text-slate-300">{formatArabicDate(dateKey)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400">
                      {formatNumber(data.rounds, useArabicDigits)} جولة
                    </span>
                    <span className="tabular-numbers font-semibold text-slate-200">
                      {formatNumber(data.count, useArabicDigits)} استغفار
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
