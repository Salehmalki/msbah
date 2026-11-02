import { useState, useEffect, useCallback, useRef } from 'react';
import { DhikrFormula, SoundType, ThemeMode, UserSettings } from '../types';
import { ISTIGHFAR_FORMULAS } from '../data/supplications';
import { getTodayKey } from '../utils/arabic';
import { playBeadSound, playRoundCompletionSound, triggerHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  STATE: 'istighfar_app_state_v1',
  SETTINGS: 'istighfar_app_settings_v1',
  HISTORY: 'istighfar_app_history_v1',
};

const DEFAULT_SETTINGS: UserSettings = {
  vibration: true,
  soundType: 'wood',
  soundVolume: 0.6,
  useArabicDigits: true,
  dailyGoal: 1000,
  roundLimit: 33,
  tapAnywhere: false,
  autoSpeed: 2500,
  theme: 'dark-emerald',
};

interface AppState {
  todayKey: string;
  todayCount: number;
  todayRounds: number;
  currentRoundCount: number;
  totalCount: number;
  totalRounds: number;
  selectedFormulaId: string;
}

export function useIstighfarState() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [state, setState] = useState<AppState>(() => {
    const today = getTodayKey();
    const fallback: AppState = {
      todayKey: today,
      todayCount: 0,
      todayRounds: 0,
      currentRoundCount: 0,
      totalCount: 0,
      totalRounds: 0,
      selectedFormulaId: 'prophetic-daily',
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATE);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If it's a new day, keep totalCount and totalRounds but reset today
        if (parsed.todayKey !== today) {
          return {
            ...parsed,
            todayKey: today,
            todayCount: 0,
            todayRounds: 0,
            currentRoundCount: 0,
          };
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return fallback;
  });

  const [history, setHistory] = useState<Record<string, { count: number; rounds: number }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const [isAutoActive, setIsAutoActive] = useState(false);
  const autoTimerRef = useRef<number | null>(null);

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Save state & sync history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(state));

      // Update history for today
      if (state.todayCount > 0) {
        setHistory((prev) => {
          const updated = {
            ...prev,
            [state.todayKey]: {
              count: state.todayCount,
              rounds: state.todayRounds,
            },
          };
          try {
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      }
    } catch {
      // ignore
    }
  }, [state]);

  // Check date shift (midnight crossover)
  useEffect(() => {
    const interval = setInterval(() => {
      const today = getTodayKey();
      if (state.todayKey !== today) {
        setState((prev) => ({
          ...prev,
          todayKey: today,
          todayCount: 0,
          todayRounds: 0,
          currentRoundCount: 0,
        }));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [state.todayKey]);

  // Trigger celebration confetti
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#059669', '#fbbf24', '#f59e0b'],
      });
    } catch {
      // ignore
    }
  }, []);

  // Increment counter
  const increment = useCallback(() => {
    // Audio and haptics feedback
    if (settings.vibration) triggerHaptic(20);
    playBeadSound(settings.soundType, settings.soundVolume);

    setState((prev) => {
      const nextCount = prev.todayCount + 1;
      const nextTotal = prev.totalCount + 1;
      const targetRound = settings.roundLimit;

      let nextCurrentRound = prev.currentRoundCount + 1;
      let nextTodayRounds = prev.todayRounds;
      let nextTotalRounds = prev.totalRounds;

      // Check if current round reached target
      if (targetRound > 0 && nextCurrentRound >= targetRound) {
        nextCurrentRound = 0;
        nextTodayRounds += 1;
        nextTotalRounds += 1;

        if (settings.vibration) triggerHaptic(60);
        playRoundCompletionSound(settings.soundVolume);
        triggerCelebration();
      }

      // Check if daily goal reached
      if (settings.dailyGoal > 0 && nextCount === settings.dailyGoal) {
        triggerCelebration();
        playRoundCompletionSound(settings.soundVolume);
      }

      return {
        ...prev,
        todayCount: nextCount,
        totalCount: nextTotal,
        todayRounds: nextTodayRounds,
        totalRounds: nextTotalRounds,
        currentRoundCount: nextCurrentRound,
      };
    });
  }, [settings, triggerCelebration]);

  // Decrement (undo)
  const decrement = useCallback(() => {
    setState((prev) => {
      if (prev.todayCount <= 0) return prev;
      return {
        ...prev,
        todayCount: Math.max(0, prev.todayCount - 1),
        totalCount: Math.max(0, prev.totalCount - 1),
        currentRoundCount: Math.max(0, prev.currentRoundCount - 1),
      };
    });
  }, []);

  // Reset current round
  const resetCurrentRound = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentRoundCount: 0,
    }));
  }, []);

  // Reset today
  const resetToday = useCallback(() => {
    setState((prev) => ({
      ...prev,
      todayCount: 0,
      todayRounds: 0,
      currentRoundCount: 0,
    }));
  }, []);

  // Full reset with prompt
  const resetAll = useCallback(() => {
    const today = getTodayKey();
    setState({
      todayKey: today,
      todayCount: 0,
      todayRounds: 0,
      currentRoundCount: 0,
      totalCount: 0,
      totalRounds: 0,
      selectedFormulaId: 'prophetic-daily',
    });
    setHistory({});
    try {
      localStorage.removeItem(STORAGE_KEYS.STATE);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {
      // ignore
    }
  }, []);

  // Auto counter loop
  useEffect(() => {
    if (!isAutoActive) {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
      return;
    }

    autoTimerRef.current = window.setInterval(() => {
      increment();
    }, settings.autoSpeed);

    return () => {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [isAutoActive, settings.autoSpeed, increment]);

  const toggleAuto = useCallback(() => {
    setIsAutoActive((prev) => !prev);
  }, []);

  // Formula selection
  const selectedFormula = ISTIGHFAR_FORMULAS.find(
    (f) => f.id === state.selectedFormulaId
  ) || ISTIGHFAR_FORMULAS[1];

  const selectFormula = useCallback((formula: DhikrFormula) => {
    setState((prev) => ({
      ...prev,
      selectedFormulaId: formula.id,
    }));
    if (formula.defaultTarget) {
      setSettings((prev) => ({
        ...prev,
        roundLimit: formula.defaultTarget || prev.roundLimit,
      }));
    }
  }, []);

  // Calculate streak (consecutive days with istighfar)
  const calculateStreak = useCallback(() => {
    let streak = 0;
    const date = new Date();

    // Check today
    const todayStr = getTodayKey();
    if ((history[todayStr]?.count || 0) > 0 || state.todayCount > 0) {
      streak += 1;
    }

    // Check backwards from yesterday
    for (let i = 1; i < 365; i++) {
      const prevDate = new Date();
      prevDate.setDate(date.getDate() - i);
      const year = prevDate.getFullYear();
      const month = String(prevDate.getMonth() + 1).padStart(2, '0');
      const day = String(prevDate.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;

      if (history[key] && history[key].count > 0) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  }, [history, state.todayCount]);

  return {
    state,
    settings,
    setSettings,
    history,
    selectedFormula,
    selectFormula,
    increment,
    decrement,
    resetCurrentRound,
    resetToday,
    resetAll,
    isAutoActive,
    toggleAuto,
    streak: calculateStreak(),
  };
}
