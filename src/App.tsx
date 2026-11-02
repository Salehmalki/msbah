import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playBeadSound, triggerHaptic } from './utils/audio';

interface StateData {
  target: number;
  count: number;
  rounds: number;
  total: number;
  today: number;
  day: string;
}

const TARGETS = [33, 100, 500, 1000];
const KEY = 'istighfar-counter-v1';
const AR = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

function fa(n: number): string {
  return String(n)
    .replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
    .replace(/\d/g, (d) => AR[parseInt(d, 10)]);
}

function dayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const STAGES = [
  { line: 'ابدأ باسم الله، وأحضِر قلبك', ayah: 'فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا يُرْسِلِ السَّمَاءَ عَلَيْكُمْ مِدْرَارًا', ref: 'نوح · ١٠–١١' },
  { line: 'استغفر، ثم عُد إليه', ayah: 'وَأَنِ اسْتَغْفِرُوا رَبَّكُمْ ثُمَّ تُوبُوا إِلَيْهِ يُمَتِّعْكُم مَّتَاعًا حَسَنًا إِلَىٰ أَجَلٍ مُّسَمًّى وَيُؤْتِ ذَا كُلِّ فَضْلٍ فَضْلَهُ', ref: 'هود · ٣' },
  { line: 'مهما كان الذنب، باب الرجوع مفتوح', ayah: 'وَمَن يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَّحِيمًا', ref: 'النساء · ١١٠' },
  { line: 'الاستغفار أمانٌ لمن يلجأ إليه', ayah: 'وَمَا كَانَ اللَّهُ لِيُعَذِّبَهُمْ وَأَنتَ فِيهِمْ وَمَا كَانَ اللَّهُ مُعَذِّبَهُمْ وَهُمْ يَسْتَغْفِرُونَ', ref: 'الأنفال · ٣٣' },
  { line: 'ذكرٌ، ثم استغفار، ثم إقلاع', ayah: 'ذَكَرُوا اللَّهَ فَاسْتَغْفَرُوا لِذُنُوبِهِمْ وَمَن يَغْفِرُ الذُّنُوبَ إِلَّا اللَّهُ', ref: 'آل عمران · ١٣٥' },
  { line: 'هنيئًا لمن كان له وِردٌ في السحر', ayah: 'وَبِالْأَسْحَارِ هُمْ يَسْتَغْفِرُونَ', ref: 'الذاريات · ١٨' },
  { line: 'أُمر به نبيّك ﷺ، فواصل', ayah: 'فَاعْلَمْ أَنَّهُ لَا إِلَهَ إِلَّا اللَّهُ وَاسْتَغْفِرْ لِذَنْبِكَ وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ', ref: 'محمد · ١٩' },
  { line: 'اختم يومك بالتسبيح والاستغفار', ayah: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا', ref: 'النصر · ٣' },
  { line: 'أحسِن الظنّ بربّك', ayah: 'وَاسْتَغْفِرُوا اللَّهَ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ', ref: 'البقرة · ١٩٩' },
  { line: 'قل كما قال موسى عليه السلام', ayah: 'قَالَ رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي فَغَفَرَ لَهُ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ', ref: 'القصص · ١٦' },
  { line: 'دعاءُ أبينا آدم، وهو دعاؤنا', ayah: 'قَالَا رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ', ref: 'الأعراف · ٢٣' },
  { line: 'ولا تنسَ والديك من دعائك', ayah: 'رَّبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ', ref: 'نوح · ٢٨' },
];

export default function App() {
  const [data, setData] = useState<StateData>(() => {
    const today = dayKey();
    const fallback: StateData = { target: 33, count: 0, rounds: 0, total: 0, today: 0, day: today };
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && typeof raw === 'object') {
        const res = { ...fallback };
        (['target', 'count', 'rounds', 'total', 'today'] as const).forEach((k) => {
          if (typeof raw[k] === 'number' && raw[k] >= 0) res[k] = Math.floor(raw[k]);
        });
        if (typeof raw.day === 'string') res.day = raw.day;
        if (TARGETS.indexOf(res.target) < 0) res.target = 33;
        if (res.count >= res.target) res.count = 0;
        if (res.day !== today) {
          res.day = today;
          res.today = 0;
        }
        return res;
      }
    } catch {
      // ignore
    }
    return fallback;
  });

  const [taps, setTaps] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [isBump, setIsBump] = useState(false);
  const [hold, setHold] = useState(false);
  const [isArmed, setIsArmed] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [skyFlash, setSkyFlash] = useState(false);
  const [verseSwap, setVerseSwap] = useState(false);
  const [shareTextMsg, setShareTextMsg] = useState('نسخ نص المشاركة');
  const [hijriDate, setHijriDate] = useState('');

  const appRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shareboxRef = useRef<HTMLTextAreaElement>(null);
  const rippleLayerRef = useRef<HTMLSpanElement>(null);

  const armTimerRef = useRef<number | null>(null);
  const celTimerRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const lastFloatRef = useRef<number>(0);

  // Particles & stars system for canvas
  const starsRef = useRef<{ x: number; y: number; r: number; sp: number; ph: number }[]>([]);
  const partsRef = useRef<{ x: number; y: number; vx: number; vy: number; l: number; m: number; r: number; c: string }[]>([]);
  const curPRef = useRef(0);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  // Hijri Date
  useEffect(() => {
    try {
      const formatted = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date());
      setHijriDate(formatted);
    } catch {
      try {
        setHijriDate(new Intl.DateTimeFormat('ar', { dateStyle: 'long' }).format(new Date()));
      } catch {
        setHijriDate('');
      }
    }
  }, []);

  // Screen Wake Lock
  const lockWakeLock = useCallback(() => {
    try {
      if ('wakeLock' in navigator && document.visibilityState === 'visible') {
        navigator.wakeLock.request('screen').catch(() => {});
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const handleVis = () => {
      if (document.visibilityState === 'visible') lockWakeLock();
    };
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, [lockWakeLock]);

  // Canvas starfield & particle loop
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.floor(W * dpr);
      cv.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!starsRef.current.length) {
        for (let i = 0; i < 80; i++) {
          starsRef.current.push({
            x: Math.random(),
            y: Math.random() * 0.72,
            r: 0.5 + Math.random() * 1.3,
            sp: 0.6 + Math.random() * 1.6,
            ph: Math.random() * 6.28,
          });
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let animId: number;
    const loop = (ms: number) => {
      const t = ms / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';

      const fade = 1 - 0.75 * curPRef.current;
      const STAR_COLOR = '#ecfdf5';
      ctx.fillStyle = STAR_COLOR;

      for (let i = 0; i < starsRef.current.length; i++) {
        const s = starsRef.current[i];
        const al = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
        ctx.globalAlpha = al * fade;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, 6.2832);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'lighter';
      const parts = partsRef.current;
      for (let j = parts.length - 1; j >= 0; j--) {
        const q = parts[j];
        q.l++;
        if (q.l > q.m) {
          parts.splice(j, 1);
          continue;
        }
        q.x += q.vx;
        q.y += q.vy;
        q.vx *= 0.97;
        q.vy = q.vy * 0.97 - 0.02;
        ctx.globalAlpha = Math.max(0, 1 - q.l / q.m) * 0.9;
        ctx.fillStyle = q.c;
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.r, 0, 6.2832);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const burst = (x: number, y: number, n: number, spd: number) => {
    const COL = ['#34d399', '#10b981', '#6ee7b7', '#059669', '#a7f3d0'];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.2832;
      const v = (0.5 + Math.random()) * spd;
      partsRef.current.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - spd * 0.5,
        l: 0,
        m: 38 + Math.random() * 40,
        r: 1.2 + Math.random() * 2.4,
        c: COL[(Math.random() * 5) | 0],
      });
    }
    if (partsRef.current.length > 320) {
      partsRef.current.splice(0, partsRef.current.length - 320);
    }
  };

  const triggerFx = (x: number, y: number) => {
    const rl = rippleLayerRef.current;
    if (rl) {
      const b = rl.getBoundingClientRect();
      const rp = document.createElement('span');
      rp.className = 'ripple';
      rp.style.left = `${x - b.left}px`;
      rp.style.top = `${y - b.top}px`;
      rp.addEventListener('animationend', () => rp.remove());
      rl.appendChild(rp);
    }

    burst(x, y, 7, 2.2);

    const now = Date.now();
    const stage = stageRef.current;
    if (stage && now - lastFloatRef.current > 260 && stage.querySelectorAll('.float').length < 8) {
      lastFloatRef.current = now;
      const f = document.createElement('span');
      f.className = 'float';
      f.textContent = 'أستغفر الله';
      f.style.setProperty('--dx', `${Math.random() * 120 - 60}px`);
      f.style.transform = 'translateX(-50%)';
      f.addEventListener('animationend', () => f.remove());
      stage.appendChild(f);
    }
  };

  const celebrate = () => {
    setCelebrating(true);
    if (celTimerRef.current) clearTimeout(celTimerRef.current);

    setSkyFlash(true);
    setTimeout(() => setSkyFlash(false), 1300);

    const btn = btnRef.current;
    if (btn) {
      const b = btn.getBoundingClientRect();
      burst(b.left + b.width / 2, b.top + b.height / 2, 90, 4.2);
    }

    try {
      if (navigator.vibrate) navigator.vibrate([30, 40, 60]);
    } catch {
      // ignore
    }

    celTimerRef.current = window.setTimeout(() => {
      setCelebrating(false);
    }, 4200);
  };

  // Perform tap count
  const handleTap = (px?: number, py?: number) => {
    playBeadSound('wood', 0.5);

    let clientX = px;
    let clientY = py;

    if (clientX === undefined || clientY === undefined) {
      if (btnRef.current) {
        const r = btnRef.current.getBoundingClientRect();
        clientX = r.left + r.width / 2;
        clientY = r.top + r.height / 2;
      } else {
        clientX = window.innerWidth / 2;
        clientY = window.innerHeight / 2;
      }
    }

    setTaps((prev) => prev + 1);

    setData((prev) => {
      const nextCount = prev.count + 1;
      const nextToday = prev.today + 1;
      const nextTotal = prev.total + 1;
      let nextRounds = prev.rounds;
      let isDone = false;

      let finalCount = nextCount;
      if (nextCount >= prev.target) {
        nextRounds += 1;
        finalCount = 0;
        isDone = true;
      }

      if (isDone) {
        setHold(true);
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        holdTimerRef.current = window.setTimeout(() => {
          setHold(false);
        }, 650);
        celebrate();
      }

      return {
        ...prev,
        count: finalCount,
        today: nextToday,
        total: nextTotal,
        rounds: nextRounds,
      };
    });

    setIsBump(true);
    setTimeout(() => setIsBump(false), 220);

    triggerFx(clientX, clientY);
    triggerHaptic(8);
    lockWakeLock();
  };

  // Keyboard shortcut listener (Space or Enter)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Compute stage
  const stageIndex = (Math.floor(taps / 11) + offset) % STAGES.length;
  const isIdle = taps === 0 && data.count === 0 && offset === 0;
  const currentStage = STAGES[stageIndex];

  const handleNextVerse = () => {
    setOffset((prev) => prev + 1);
    setVerseSwap(true);
    setTimeout(() => setVerseSwap(false), 450);
  };

  // Reset button logic (2-step armed)
  const handleReset = () => {
    if (!isArmed) {
      setIsArmed(true);
      if (armTimerRef.current) clearTimeout(armTimerRef.current);
      armTimerRef.current = window.setTimeout(() => {
        setIsArmed(false);
      }, 3000);
      return;
    }
    if (armTimerRef.current) clearTimeout(armTimerRef.current);
    setIsArmed(false);
    setData({
      target: 33,
      count: 0,
      rounds: 0,
      total: 0,
      today: 0,
      day: dayKey(),
    });
    setTaps(0);
    setOffset(0);
    setHold(false);
    setCelebrating(false);
  };

  // Share text
  const getShareText = () => {
    const head = data.today > 0 ? `استغفرتُ الله اليوم ${fa(data.today)} مرّة.` : 'أستغفر الله وأتوب إليه.';
    return `${head}\n\n﴿${currentStage.ayah}﴾ ${currentStage.ref}\n\nاللهم اغفر لنا ولكم. ذكّر غيرك بالاستغفار.`;
  };

  const handleShare = () => {
    const text = getShareText();
    const flashMsg = (msg: string) => {
      setShareTextMsg(msg);
      setTimeout(() => setShareTextMsg('نسخ نص المشاركة'), 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => flashMsg('تم نسخ الرسالة بنجاح ✓'),
        () => {
          if (shareboxRef.current) {
            shareboxRef.current.value = text;
            shareboxRef.current.hidden = false;
            shareboxRef.current.select();
            document.execCommand('copy');
            shareboxRef.current.hidden = true;
            flashMsg('تم نسخ الرسالة بنجاح ✓');
          }
        }
      );
    } else if (shareboxRef.current) {
      shareboxRef.current.value = text;
      shareboxRef.current.hidden = false;
      shareboxRef.current.select();
      document.execCommand('copy');
      shareboxRef.current.hidden = true;
      flashMsg('تم نسخ الرسالة بنجاح ✓');
    }
  };

  // Calculation of progress & beads
  const shownCount = hold ? data.target : data.count;
  const p = shownCount / data.target;
  curPRef.current = p;

  // Set CSS variable --p on container
  useEffect(() => {
    if (appRef.current) {
      appRef.current.style.setProperty('--p', p.toFixed(3));
    }
  }, [p]);

  const R = 116;
  const C = 2 * Math.PI * R;
  const arcStrokeDashoffset = C * (1 - p);
  const litBeads = Math.floor(p * 33 + 1e-6);

  // Generate 33 beads coordinate array
  const beadsCoords = [];
  for (let i = 0; i < 33; i++) {
    const a = (i / 33) * Math.PI * 2 - Math.PI / 2;
    beadsCoords.push({
      cx: (140 + 132 * Math.cos(a)).toFixed(2),
      cy: (140 + 132 * Math.sin(a)).toFixed(2),
      index: i,
    });
  }

  return (
    <div id="app-container" ref={appRef} dir="rtl" lang="ar">
      {/* Night Sky with rising dawn horizon */}
      <div className={`sky ${skyFlash ? 'flash' : ''}`} aria-hidden="true" />
      
      {/* 2D Canvas Starfield & Particle bursts */}
      <canvas id="fx" ref={canvasRef} aria-hidden="true" />

      {/* Top Header */}
      <header className="top">
        <div className="brand">
          <span>استغفر</span>
          <span className="moon" aria-hidden="true" />
        </div>
        <div className="date">{hijriDate}</div>
        <button
          onClick={handleReset}
          className={`ghost ${isArmed ? 'armed' : ''}`}
          type="button"
        >
          {isArmed ? 'اضغط للتأكيد' : 'تصفير'}
        </button>
      </header>

      {/* Quranic Verse Section */}
      <section className={`verse ${verseSwap ? 'swap' : ''}`} aria-live="polite">
        {celebrating ? (
          <>
            <p className="line gold">
              تقبّل الله منك. أتممتَ {fa(data.target)} استغفارة
            </p>
            <blockquote className="ayah">
              ﴿{currentStage.ayah}﴾
            </blockquote>
            <div className="refrow">
              <span className="ref">{currentStage.ref}</span>
            </div>
          </>
        ) : (
          <>
            <p className="line">
              {isIdle ? 'المس الدائرة وابدأ باسم الله' : currentStage.line}
            </p>
            <blockquote className="ayah">
              ﴿{currentStage.ayah}﴾
            </blockquote>
            <div className="refrow">
              <span className="ref">{currentStage.ref}</span>
              <button onClick={handleNextVerse} className="next" type="button">
                الآية التالية
              </button>
            </div>
          </>
        )}
      </section>

      {/* Main Tactile Stage */}
      <main className="stage" ref={stageRef}>
        <div className="ringwrap">
          <svg viewBox="0 0 280 280" aria-hidden="true">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" style={{ stopColor: 'var(--rose)' }} />
                <stop offset="1" style={{ stopColor: 'var(--amber)' }} />
              </linearGradient>
            </defs>
            {/* Background Track */}
            <circle className="track" cx="140" cy="140" r={R} />
            {/* Gradient Progress Arc */}
            <circle
              className="arc"
              cx="140"
              cy="140"
              r={R}
              transform="rotate(-90 140 140)"
              style={{
                strokeDasharray: C,
                strokeDashoffset: arcStrokeDashoffset,
              }}
            />
            {/* 33 Glowing Subha Beads */}
            <g id="beads">
              {beadsCoords.map((b) => {
                const isOn = b.index < litBeads;
                const isLast = b.index === litBeads - 1;
                return (
                  <circle
                    key={b.index}
                    cx={b.cx}
                    cy={b.cy}
                    r={isLast ? 4.8 : 3.2}
                    className={`bead ${isOn ? 'on' : ''} ${isLast ? 'last' : ''}`}
                  />
                );
              })}
            </g>
          </svg>

          {/* Center Tap Circle Button */}
          <button
            ref={btnRef}
            type="button"
            aria-label={`أستغفر الله، العدد ${fa(shownCount)} من ${fa(data.target)}`}
            onPointerDown={(e) => {
              if (e.button > 0) return;
              e.preventDefault();
              setIsPressing(true);
              handleTap(e.clientX, e.clientY);
            }}
            onPointerUp={() => setIsPressing(false)}
            onPointerLeave={() => setIsPressing(false)}
            onPointerCancel={() => setIsPressing(false)}
            onContextMenu={(e) => e.preventDefault()}
            className={`tap ${isPressing ? 'press' : ''}`}
          >
            <span className="phrase">أستغفر الله</span>
            <span className={`count ${isBump ? 'bump' : ''}`}>
              {fa(shownCount)}
            </span>
            <span className="of">من {fa(data.target)}</span>
          </button>

          {/* Ripple Effect Layer */}
          <span className="rl" ref={rippleLayerRef} />
        </div>
      </main>

      {/* Dock Controls & Stats */}
      <section className="dock">
        {/* Target Chips */}
        <div className="chips" role="group" aria-label="هدف الجولة">
          {TARGETS.map((t) => (
            <button
              key={t}
              type="button"
              data-t={t}
              aria-pressed={data.target === t}
              onClick={() => {
                setData((prev) => ({
                  ...prev,
                  target: t,
                  count: prev.count >= t ? 0 : prev.count,
                }));
              }}
              className="chip"
            >
              {fa(t)}
            </button>
          ))}
        </div>

        {/* 3 Core Stats */}
        <div className="stats">
          <div className="stat">
            <b>{fa(data.today)}</b>
            <span>استغفار اليوم</span>
          </div>
          <div className="stat">
            <b>{fa(data.rounds)}</b>
            <span>جولات مكتملة</span>
          </div>
          <div className="stat">
            <b>{fa(data.total)}</b>
            <span>إجمالي الاستغفار</span>
          </div>
        </div>

        {/* Share Button */}
        <button onClick={handleShare} className="share" type="button">
          {shareTextMsg}
        </button>
        <textarea
          ref={shareboxRef}
          className="sharebox"
          rows={4}
          readOnly
          hidden
          aria-label="نص المشاركة"
        />
      </section>
    </div>
  );
}
