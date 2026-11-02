import React, { useState } from 'react';
import { ISTIGHFAR_FORMULAS } from '../data/supplications';
import { DhikrFormula } from '../types';
import { Check, Copy, Sparkles, BookOpen } from 'lucide-react';

interface SupplicationSelectorProps {
  selectedFormula: DhikrFormula;
  onSelectFormula: (formula: DhikrFormula) => void;
  onClose?: () => void;
}

export const SupplicationSelector: React.FC<SupplicationSelectorProps> = ({
  selectedFormula,
  onSelectFormula,
  onClose,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (formula: DhikrFormula, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formula.arabic);
    setCopiedId(formula.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-amiri text-emerald-400">
            صيغ الاستغفار المأثورة عن النبي ﷺ
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            اختر الصيغة التي ترغب في ترديدها وتتبع عددها في مسبحتك اليومية
          </p>
        </div>
        <div className="text-xs text-slate-500">
          {ISTIGHFAR_FORMULAS.length} صيغ مأثورة
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ISTIGHFAR_FORMULAS.map((formula) => {
          const isSelected = selectedFormula.id === formula.id;

          return (
            <div
              key={formula.id}
              onClick={() => {
                onSelectFormula(formula);
                if (onClose) onClose();
              }}
              className={`relative cursor-pointer rounded-2xl border p-5 transition-all text-right flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-950/50'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div>
                {/* Header row: Source & Badges */}
                <div className="flex items-center justify-between text-xs mb-3 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {formula.isSayyid && (
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Sparkles className="h-3.5 w-3.5" />
                        سيد الاستغفار
                      </span>
                    )}
                    <span className="text-slate-400">{formula.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleCopy(formula, e)}
                      title="نسخ الصيغة"
                      className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {copiedId === formula.id ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Arabic Text */}
                <p className="font-amiri text-lg md:text-xl font-bold text-slate-100 leading-relaxed mb-3">
                  {formula.arabic}
                </p>

                {/* Virtue Quote */}
                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/70 text-xs text-slate-300 leading-normal mb-3">
                  {formula.virtue}
                </div>
              </div>

              {/* Action button */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  الجولة الموصى بها: {formula.defaultTarget || 100} مرة
                </span>
                <button
                  type="button"
                  className={`font-semibold transition-colors ${
                    isSelected ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-300'
                  }`}
                >
                  {isSelected ? 'الصيغة المحددة حالياً' : 'تحديد هذه الصيغة'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
