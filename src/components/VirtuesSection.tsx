import React, { useState } from 'react';
import { VIRTUES_DATA, ISTIGHFAR_TIMES } from '../data/virtues';
import { BookOpen, Heart, Clock, Copy, Check, Quote } from 'lucide-react';

export const VirtuesSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'quran' | 'hadith' | 'times'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredVirtues = VIRTUES_DATA.filter((v) => {
    if (filter === 'all') return true;
    return v.category === filter;
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-xl md:text-2xl font-bold font-amiri text-emerald-400">
          فضائل وثمرات الاستغفار في الكتاب والسنة
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          تأمل في عظيم فضل الاستغفار وكيف يفتح أبواب الرحمة والرزق وتفريج الهموم
        </p>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              filter === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter('quran')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              filter === 'quran'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            آيات قرآنية
          </button>
          <button
            onClick={() => setFilter('hadith')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              filter === 'hadith'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            أحاديث نبوية
          </button>
          <button
            onClick={() => setFilter('times')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              filter === 'times'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            أفضل أوقات الاستغفار
          </button>
        </div>
      </div>

      {/* Main List */}
      {filter !== 'times' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVirtues.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 flex flex-col justify-between hover:border-emerald-500/30 transition-all text-right"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-semibold text-emerald-400/90">{item.reference}</span>
                  <button
                    onClick={() => handleCopy(item.arabicText, item.id)}
                    title="نسخ النص"
                    className="p-1 hover:text-emerald-400 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="relative mb-3">
                  <p className="font-amiri text-lg md:text-xl font-bold leading-relaxed text-slate-100">
                    «{item.arabicText}»
                  </p>
                </div>
              </div>

              <div className="mt-2 pt-3 border-t border-slate-800/80 text-xs md:text-sm text-slate-300">
                <span className="font-semibold text-emerald-400/80 ml-1">الثمرة والفضل:</span>
                {item.explanation}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ISTIGHFAR_TIMES.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-right hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <h3 className="font-bold text-slate-100 text-sm md:text-base">
                  {t.title}
                </h3>
              </div>
              <p className="font-amiri text-base font-bold text-emerald-400 mb-2">
                {t.verse}
              </p>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {t.detail}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
