import React from 'react';
import { UserSettings, SoundType, ThemeMode } from '../types';
import { playBeadSound, triggerHaptic } from '../utils/audio';
import { X, Volume2, Smartphone, Hash, Target, Zap, Palette, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  onResetToday: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
  onResetToday,
}) => {
  if (!isOpen) return null;

  const testSound = (type: SoundType) => {
    playBeadSound(type, settings.soundVolume);
    if (settings.vibration) triggerHaptic(20);
  };

  const soundOptions: { label: string; value: SoundType }[] = [
    { label: 'حبة خشبية (مسبحة)', value: 'wood' },
    { label: 'نغمة هادئة', value: 'chime' },
    { label: 'قطرة ماء', value: 'droplet' },
    { label: 'صامت', value: 'mute' },
  ];

  const goalOptions = [100, 300, 500, 1000, 3000, 5000];
  const autoSpeeds = [
    { label: 'سريع (١.٥ ثانية)', value: 1500 },
    { label: 'معتدل (٢.٥ ثانية)', value: 2500 },
    { label: 'متأنٍّ (٤ ثوانٍ)', value: 4000 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="font-amiri text-2xl font-bold text-emerald-400">
            إعدادات المسبحة والتخصيص
          </h2>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-6">
          
          {/* Sound & Tone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-3">
              <Volume2 className="h-4 w-4 text-emerald-400" />
              <span>صوت نقرة التسبيح</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {soundOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSettings((prev) => ({ ...prev, soundType: opt.value }));
                    testSound(opt.value);
                  }}
                  className={`p-3 text-xs font-semibold rounded-xl border transition-all text-right flex items-center justify-between ${
                    settings.soundType === opt.value
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{opt.label}</span>
                  {opt.value !== 'mute' && (
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      تجربة
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Volume */}
            {settings.soundType !== 'mute' && (
              <div className="mt-3 flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 whitespace-nowrap">مستوى الصوت:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      soundVolume: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-emerald-500"
                />
                <span className="text-xs tabular-numbers text-emerald-400">
                  {Math.round(settings.soundVolume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Vibration / Haptics */}
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-slate-200 cursor-pointer">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-400" />
                <span>الاهتزاز اللمسي (للهواتف)</span>
              </div>
              <input
                type="checkbox"
                checked={settings.vibration}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, vibration: e.target.checked }))
                }
                className="w-5 h-5 accent-emerald-500 rounded"
              />
            </label>
            <p className="text-[11px] text-slate-400 mt-1">
              اهتزاز خفيف مع كل استغفار واهتزاز مميز عند اكتمال الجولة.
            </p>
          </div>

          {/* Number system */}
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-slate-200 cursor-pointer">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-emerald-400" />
                <span>الأرقام العربية المشرقية (٠، ١، ٢، ٣)</span>
              </div>
              <input
                type="checkbox"
                checked={settings.useArabicDigits}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    useArabicDigits: e.target.checked,
                  }))
                }
                className="w-5 h-5 accent-emerald-500 rounded"
              />
            </label>
          </div>

          {/* Tap anywhere */}
          <div>
            <label className="flex items-center justify-between text-sm font-semibold text-slate-200 cursor-pointer">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span>وضع النقر على كامل الشاشة</span>
              </div>
              <input
                type="checkbox"
                checked={settings.tapAnywhere}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    tapAnywhere: e.target.checked,
                  }))
                }
                className="w-5 h-5 accent-emerald-500 rounded"
              />
            </label>
            <p className="text-[11px] text-slate-400 mt-1">
              يتيح لك الاستغفار بمجرد النقر في أي مكان في الشاشة لسهولة الذكر أثناء المشي أو الاسترخاء.
            </p>
          </div>

          {/* Daily Goal */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-2">
              <Target className="h-4 w-4 text-emerald-400" />
              <span>الهدف اليومي للاستغفار</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, dailyGoal: goal }))
                  }
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    settings.dailyGoal === goal
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {goal.toLocaleString('ar-SA')} مرة
                </button>
              ))}
            </div>
          </div>

          {/* Auto Speed */}
          <div>
            <label className="text-sm font-semibold text-slate-200 mb-2 block">
              سرعة الاستغفار التلقائي
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {autoSpeeds.map((spd) => (
                <button
                  key={spd.value}
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, autoSpeed: spd.value }))
                  }
                  className={`py-2 px-2 text-xs font-medium rounded-xl border transition-all ${
                    settings.autoSpeed === spd.value
                      ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {spd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Palette */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200 mb-2">
              <Palette className="h-4 w-4 text-emerald-400" />
              <span>مظهر التطبيق</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme: 'dark-emerald' }))
                }
                className={`py-2.5 px-2 text-xs font-semibold rounded-xl border transition-all ${
                  settings.theme === 'dark-emerald'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400'
                }`}
              >
                زمردي ليلي
              </button>
              <button
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme: 'dark-slate' }))
                }
                className={`py-2.5 px-2 text-xs font-semibold rounded-xl border transition-all ${
                  settings.theme === 'dark-slate'
                    ? 'border-slate-400 bg-slate-800 text-slate-100'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400'
                }`}
              >
                رمادي داكن
              </button>
              <button
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme: 'light-warm' }))
                }
                className={`py-2.5 px-2 text-xs font-semibold rounded-xl border transition-all ${
                  settings.theme === 'light-warm'
                    ? 'border-amber-400 bg-amber-950/30 text-amber-300'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400'
                }`}
              >
                نهاري هادئ
              </button>
            </div>
          </div>

          {/* Quick reset today */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                if (window.confirm('هل تريد تصفير عداد اليوم فقط؟ لن تتأثر الجولات السابقة.')) {
                  onResetToday();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>تصفير استغفار اليوم</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
          >
            تم الحفظ
          </button>
        </div>

      </div>
    </div>
  );
};
