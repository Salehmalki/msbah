export interface DhikrFormula {
  id: string;
  arabic: string;
  source: string;
  translation: string;
  virtue: string;
  defaultTarget?: number;
  isSayyid?: boolean;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  count: number;
  rounds: number;
}

export type SoundType = 'wood' | 'chime' | 'droplet' | 'mute';
export type ThemeMode = 'dark-emerald' | 'dark-slate' | 'light-warm';

export interface UserSettings {
  vibration: boolean;
  soundType: SoundType;
  soundVolume: number;
  useArabicDigits: boolean;
  dailyGoal: number;
  roundLimit: number; // 33, 70, 100, 1000, 0 (0 = continuous)
  tapAnywhere: boolean;
  autoSpeed: number; // in milliseconds (e.g. 2000, 3000)
  theme: ThemeMode;
}
