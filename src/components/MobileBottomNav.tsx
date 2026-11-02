import React from 'react';
import { CircleDot, BookOpen, HeartHandshake, BarChart3 } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'counter' | 'formulas' | 'virtues' | 'history';
  setActiveTab: (tab: 'counter' | 'formulas' | 'virtues' | 'history') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: 'counter' as const, label: 'المسبحة', icon: CircleDot },
    { id: 'formulas' as const, label: 'الصيغ', icon: BookOpen },
    { id: 'virtues' as const, label: 'الفضائل', icon: HeartHandshake },
    { id: 'history' as const, label: 'السجل', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 pb-safe">
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors relative"
            >
              <Icon
                className={`h-5 w-5 transition-transform ${
                  isActive
                    ? 'text-emerald-400 scale-110'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              />
              <span
                className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
