import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Settings, Sparkles } from 'lucide-react';
import { SoundType, ThemeMode } from '../types';

interface HeaderProps {
  activeTab: 'counter' | 'formulas' | 'virtues' | 'history';
  setActiveTab: (tab: 'counter' | 'formulas' | 'virtues' | 'history') => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  soundType: SoundType;
  setSoundType: (type: SoundType) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  soundType,
  setSoundType,
  onOpenSettings,
}) => {
  const isDark = theme.startsWith('dark');

  const toggleTheme = () => {
    if (theme === 'dark-emerald') {
      setTheme('dark-slate');
    } else if (theme === 'dark-slate') {
      setTheme('light-warm');
    } else {
      setTheme('dark-emerald');
    }
  };

  const toggleMute = () => {
    setSoundType(soundType === 'mute' ? 'wood' : 'mute');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/15 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-amiri text-2xl font-bold tracking-normal text-emerald-300">
            مسبحة الاستغفار
          </span>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('counter')}
            className={`whitespace-nowrap pb-0.5 transition-colors ${
              activeTab === 'counter'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            المسبحة الذكية
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            className={`whitespace-nowrap pb-0.5 transition-colors ${
              activeTab === 'formulas'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            صيغ الاستغفار
          </button>
          <button
            onClick={() => setActiveTab('virtues')}
            className={`whitespace-nowrap pb-0.5 transition-colors ${
              activeTab === 'virtues'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            فضائل وثمرات
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`whitespace-nowrap pb-0.5 transition-colors ${
              activeTab === 'history'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            السجل والإحصائيات
          </button>
        </nav>

        {/* Zone 3: Primary utility actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleMute}
            title={soundType === 'mute' ? 'تفعيل الصوت' : 'كتم الصوت'}
            aria-label={soundType === 'mute' ? 'تفعيل الصوت' : 'كتم الصوت'}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-emerald-400 transition-colors"
          >
            {soundType === 'mute' ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={toggleTheme}
            title={
              theme === 'dark-emerald'
                ? 'السمة: زمردي ليلي'
                : theme === 'dark-slate'
                ? 'السمة: رمادي داكن'
                : 'السمة: دافئ نهاري'
            }
            aria-label="تبديل المظهر"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-emerald-400 transition-colors"
          >
            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <button
            onClick={onOpenSettings}
            title="الإعدادات والأهداف"
            aria-label="الإعدادات"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-emerald-400 transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
