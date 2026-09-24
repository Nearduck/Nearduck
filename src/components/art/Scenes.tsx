/* Hand-built SVG scenery. The mascot is always the owner's artwork
   (/brand/nearduck-mark.webp); everything around it is drawn here. */
import { DuckShape } from "./Duck";

export const MARK = "/brand/nearduck-mark.webp";
const INK = "#141110";

/* Deterministic pseudo-random numbers so server and client draw the same. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ---------------------------------------------------------------- */
/* Sky pieces                                                         */
/* ---------------------------------------------------------------- */

export function Cloud({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 220 110" className={className} style={style} aria-hidden="true">
      <path
        d="M34 96 C8 96 4 64 30 60 C26 34 58 22 76 40 C82 12 126 6 138 34 C150 18 186 24 184 52 C212 50 216 96 186 96 Z"
        fill="#fff"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M40 84 C60 90 150 90 176 84" fill="none" stroke="#dfe9ef" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

/** A little flying duck silhouette with flapping wings. */
export function FlyingDuck({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 20" className={className} style={style} aria-hidden="true">
      <g fill={INK}>
        <ellipse cx="20" cy="12" rx="9" ry="3.4" />
        <circle cx="30" cy="10" r="2.6" />
        <path d="M32 10 L37 11 L32 12 Z" />
        <g style={{ transformOrigin: "20px 11px", animation: "flap 0.5s ease-in-out infinite" }}>
          <path d="M14 11 Q18 1 25 10 Z" />
        </g>
      </g>
    </svg>
  );
}

/** Cattails and grass tufts along the bank. Stretches to any width. */
export function Reeds({ className = "", seed = 7, count = 46, tint = "#2f7d3a" }: { className?: string; seed?: number; count?: number; tint?: string }) {
  const r = seeded(seed);
  const blades = Array.from({ length: count }, (_, i) => {
    const x = (i / count) * 1440 + r() * 30;
    const h = 60 + r() * 110;
    const lean = (r() - 0.5) * 40;
    const cat = r() > 0.72;
    return { x, h, lean, cat, w: 5 + r() * 5 };
  });
  return (
    <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className={className} aria-hidden="true">
      {blades.map((b, i) => (
        <g key={i} style={{ transformOrigin: `${b.x}px 200px`, animation: `sway ${3 + (i % 5) * 0.6}s ease-in-out ${(i % 7) * 0.3}s infinite` }}>
          <path
            d={`M${b.x - b.w} 200 Q${b.x + b.lean * 0.4} ${200 - b.h * 0.6} ${b.x + b.lean} ${200 - b.h} Q${b.x + b.lean * 0.5} ${200 - b.h * 0.5} ${b.x + b.w} 200 Z`}
            fill={i % 3 === 0 ? "#3f9a45" : tint}
            stroke={INK}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {b.cat ? (
            <rect x={b.x + b.lean - 5} y={200 - b.h - 26} width="10" height="30" rx="5" fill="#7a4a24" stroke={INK} strokeWidth="2.5" />
          ) : null}
        </g>
      ))}
    </svg>
  );
}

/** Rising bubbles for any underwater area. Positioned by the parent. */
export function Bubbles({ count = 14, seed = 3, className = "" }: { count?: number; seed?: number; className?: string }) {
  const r = seeded(seed);
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const size = 4 + r() * 12;
        return (
          <span
            key={i}
            className="absolute rounded-full border border-white/40 bg-white/10"
            style={{
              left: `${r() * 100}%`,
              bottom: `${r() * 30}%`,
              width: size,
              height: size,
              animation: `rise ${6 + r() * 8}s linear ${r() * 8}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Section panels                                                     */
/* ---------------------------------------------------------------- */

function Rays({ w, id }: { w: number; id: string }) {
  return (
    <g style={{ animation: "glow 6s ease-in-out infinite" }}>
      <defs>
        <linearGradient id={`${id}-ray`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bff7e0" stopOpacity="0.22" />
          <stop offset="1" stopColor="#bff7e0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.12, 0.34, 0.58, 0.8].map((p, i) => (
        <polygon key={i} points={`${w * p},0 ${w * p + 50},0 ${w * p + 170 + i * 20},900 ${w * p - 40},900`} fill={`url(#${id}-ray)`} />
      ))}
    </g>
  );
}

function CoinPile({ x, y, w, n = 70, seed = 5, glow = true }: { x: number; y: number; w: number; n?: number; seed?: number; glow?: boolean }) {
  const r = seeded(seed);
  const coins = Array.from({ length: n }, () => {
    const t = r();
    const cx = x + (r() - 0.5) * w * (1 - t * 0.7);
    const cy = y - t * 110 + r() * 20;
    return { cx, cy, rot: (r() - 0.5) * 40 };
  }).sort((a, b) => a.cy - b.cy);
  return (
    <g>
      {glow ? <ellipse cx={x} cy={y + 20} rx={w * 0.6} ry="40" fill="#00ec97" opacity="0.22" style={{ filter: "blur(18px)" }} /> : null}
      {coins.map((c, i) => (
        <g key={i} transform={`translate(${c.cx} ${c.cy}) rotate(${c.rot})`}>
          <ellipse rx="22" ry="9" cy="4" fill="#07613f" stroke={INK} strokeWidth="2" />
          <ellipse rx="22" ry="9" fill="#19d48b" stroke={INK} strokeWidth="2" />
          <ellipse rx="12" ry="4.5" fill="none" stroke="#b6ffe0" strokeWidth="1.6" opacity="0.8" />
        </g>
      ))}
    </g>
  );
}

function Weed({ x, h, seed = 1, color = "#1f5c3c" }: { x: number; h: number; seed?: number; color?: string }) {
  const r = seeded(seed);
  const pts = Array.from({ length: 6 }, (_, i) => ({ dx: (r() - 0.5) * 36, y: -(i + 1) * (h / 6) }));
  const d = pts.reduce((acc, p) => `${acc} Q${x + p.dx * 1.6} ${p.y + h / 12} ${x + p.dx} ${p.y}`, `M${x} 0`);
  return (
    <path
      d={d}
      transform={`translate(0 0)`}
      fill="none"
      stroke={color}
      strokeWidth="9"
      strokeLinecap="round"
      style={{ transformOrigin: `${x}px 0px`, animation: `sway ${4 + r() * 3}s ease-in-out infinite` }}
    />
  );
}

/** Underwater hollow with a glowing coin pile and the mascot lounging on it. */
export function NestArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="The Nearduck mascot lounging on a pile of glowing green coins at the bottom of the pond">
      <defs>
        <linearGradient id="nest-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14403c" />
          <stop offset="0.55" stopColor="#0d2522" />
          <stop offset="1" stopColor="#081210" />
        </linearGradient>
        <radialGradient id="nest-glow" cx="0.5" cy="0.8" r="0.5">
          <stop offset="0" stopColor="#00ec97" stopOpacity="0.35" />
          <stop offset="1" stopColor="#00ec97" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="900" fill="url(#nest-bg)" />
      <Rays w={600} id="nest" />
      <rect width="600" height="900" fill="url(#nest-glow)" />
      <path d="M0 0 H90 C60 180 110 320 60 480 C30 600 70 760 40 900 H0 Z" fill="#0a1a17" stroke={INK} strokeWidth="4" />
      <path d="M600 0 H520 C560 160 500 300 560 460 C590 560 540 740 580 900 H600 Z" fill="#0a1a17" stroke={INK} strokeWidth="4" />
      <g transform="translate(0 900)">
        <Weed x={70} h={420} seed={2} />
        <Weed x={110} h={300} seed={4} color="#27704a" />
        <Weed x={540} h={380} seed={6} />
        <Weed x={500} h={250} seed={8} color="#27704a" />
      </g>
      <path d="M0 860 C120 830 220 850 300 840 C400 828 500 850 600 836 V900 H0 Z" fill="#2b2418" stroke={INK} strokeWidth="4" />
      <CoinPile x={300} y={840} w={560} n={110} />
      <image href={MARK} x="170" y="470" width="280" height="280" style={{ animation: "bob 5s ease-in-out infinite" }} />
      <CoinPile x={170} y={870} w={200} n={18} seed={11} />
      <CoinPile x={470} y={880} w={180} n={16} seed={13} />
    </svg>
  );
}

/** Porthole to the night sky above a reed nest of sleeping ducklings. */
export function FlockArt({ className = "" }: { className?: string }) {
  const r = seeded(21);
  const stars = Array.from({ length: 40 }, () => ({ x: 120 + r() * 360, y: 70 + r() * 250, s: 0.8 + r() * 1.8 }));
  return (
    <svg viewBox="0 0 600 1000" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="A round window to the night sky above a reed nest where three ducklings sleep">
      <defs>
        <linearGradient id="flock-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f2622" />
          <stop offset="1" stopColor="#090f0d" />
        </linearGradient>
        <linearGradient id="flock-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1440" />
          <stop offset="1" stopColor="#1d3a6e" />
        </linearGradient>
        <clipPath id="flock-hole">
          <circle cx="300" cy="250" r="190" />
        </clipPath>
      </defs>
      <rect width="600" height="1000" fill="url(#flock-bg)" />
      <g clipPath="url(#flock-hole)">
        <rect x="100" y="50" width="400" height="400" fill="url(#flock-night)" />
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff" style={{ animation: `glow ${2 + (i % 4)}s ease-in-out ${i % 3}s infinite` }} />
        ))}
        <circle cx="400" cy="140" r="34" fill="#fff6d6" stroke={INK} strokeWidth="4" />
        <circle cx="388" cy="132" r="6" fill="#efe3b8" />
        <path d="M100 360 C200 340 400 380 500 350 V460 H100 Z" fill="#1c4a6a" stroke={INK} strokeWidth="4" />
        <image href={MARK} x="200" y="240" width="170" height="170" />
      </g>
      <circle cx="300" cy="250" r="190" fill="none" stroke="#3a2c1d" strokeWidth="26" />
      <circle cx="300" cy="250" r="203" fill="none" stroke={INK} strokeWidth="4" />
      <circle cx="300" cy="250" r="177" fill="none" stroke={INK} strokeWidth="4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <circle key={a} cx={300 + Math.cos((a * Math.PI) / 180) * 190} cy={250 + Math.sin((a * Math.PI) / 180) * 190} r="6" fill="#8a6a45" stroke={INK} strokeWidth="2.5" />
      ))}
      <g transform="translate(0 1000)">
        <Weed x={60} h={520} seed={3} />
        <Weed x={560} h={460} seed={9} color="#27704a" />
      </g>
      {/* reed nest */}
      <g>
        <ellipse cx="300" cy="820" rx="240" ry="90" fill="#5b3d20" stroke={INK} strokeWidth="5" />
        <ellipse cx="300" cy="790" rx="200" ry="60" fill="#3a2614" stroke={INK} strokeWidth="4" />
        <g transform="translate(92 676) scale(1.15)"><DuckShape mood="sleep" /></g>
        <g transform="translate(508 672) scale(-1.15 1.15)"><DuckShape mood="sleep" /></g>
        <g transform="translate(236 700) scale(1.1)"><DuckShape mood="sleep" /></g>
        {Array.from({ length: 16 }, (_, i) => (
          <path
            key={i}
            d={`M${70 + i * 30} ${800 + (i % 2) * 20} Q${120 + i * 26} ${870 - (i % 3) * 8} ${180 + i * 24} ${820 + (i % 2) * 24}`}
            fill="none"
            stroke={i % 2 ? "#8a6034" : "#6e4a26"}
            strokeWidth="7"
            strokeLinecap="round"
          />
        ))}
        <text x="400" y="640" fill="#bff7e0" opacity="0.7" fontFamily="monospace" fontSize="30" fontWeight="700" style={{ animation: "glow 3s ease-in-out infinite" }}>z</text>
        <text x="425" y="610" fill="#bff7e0" opacity="0.5" fontFamily="monospace" fontSize="22" fontWeight="700" style={{ animation: "glow 3s ease-in-out 1s infinite" }}>z</text>
      </g>
    </svg>
  );
}

/** A glowing green opening in the reeds, the mascot waiting in front. */
export function EntranceArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="The Nearduck mascot in front of a glowing green opening in the reeds">
      <defs>
        <radialGradient id="door" cx="0.82" cy="0.46" r="0.5">
          <stop offset="0" stopColor="#b8ffd9" />
          <stop offset="0.25" stopColor="#36f09e" />
          <stop offset="0.6" stopColor="#0e6b43" />
          <stop offset="1" stopColor="#0a1512" />
        </radialGradient>
      </defs>
      <rect width="600" height="760" fill="url(#door)" />
      <g opacity="0.9">
        {Array.from({ length: 22 }, (_, i) => (
          <path
            key={i}
            d={`M${i * 30 - 20} 760 Q${i * 30 + 10} ${420 - (i % 4) * 40} ${i * 30 - 30 + (i % 3) * 20} ${140 + (i % 5) * 30}`}
            fill="none"
            stroke={i % 2 ? "#123a26" : "#0d2a1c"}
            strokeWidth={14 + (i % 3) * 4}
            strokeLinecap="round"
            opacity={i > 12 && i < 20 ? 0.25 : 0.9}
          />
        ))}
      </g>
      <ellipse cx="300" cy="700" rx="260" ry="46" fill="#0a1a12" opacity="0.8" />
      <image href={MARK} x="90" y="300" width="400" height="400" />
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/* Between-section props                                              */
/* ---------------------------------------------------------------- */

/** An empty armchair on the pond floor with a "still holding" sign. */
export function SunkenChair({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 -44 320 244" className={className} role="img" aria-label="An empty armchair on the pond floor with a sign that says still holding">
      <ellipse cx="160" cy="176" rx="150" ry="22" fill="#2b2418" stroke={INK} strokeWidth="4" />
      <g stroke={INK} strokeWidth="5" strokeLinejoin="round">
        <path d="M70 90 C70 60 90 50 120 50 H200 C230 50 244 64 244 92 V150 H70 Z" fill="#e9ecef" />
        <path d="M50 110 C50 94 70 90 84 96 V168 H56 C52 168 50 164 50 160 Z" fill="#f7f8f9" />
        <path d="M264 110 C264 94 244 90 230 96 V168 H258 C262 168 264 164 264 160 Z" fill="#cfd5da" />
        <path d="M84 130 H230 V168 H84 Z" fill="#f2f4f6" />
      </g>
      <path d="M150 40 V10" stroke={INK} strokeWidth="4" />
      <g transform="translate(150 0) rotate(-6)">
        <rect x="-44" y="-4" width="96" height="30" rx="6" fill="#c8a36b" stroke={INK} strokeWidth="4" />
        <text x="4" y="16" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={INK}>STILL HOLDING</text>
      </g>
      <g transform="translate(270 60)" style={{ animation: "bob 4s ease-in-out infinite" }}>
        <path d="M0 10 C10 -4 34 -2 40 10 C34 22 10 24 0 10 Z M40 10 L54 0 V20 Z" fill="#f07a12" stroke={INK} strokeWidth="3" />
        <circle cx="10" cy="8" r="2" fill={INK} />
      </g>
    </svg>
  );
}

/** Half-buried chest spilling green coins. */
export function Chest({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 200" className={className} role="img" aria-label="A sunken chest spilling glowing green coins">
      <ellipse cx="130" cy="170" rx="120" ry="26" fill="#2b2418" stroke={INK} strokeWidth="4" />
      <g stroke={INK} strokeWidth="5" strokeLinejoin="round">
        <path d="M40 34 C40 10 180 10 190 34 L182 60 H46 Z" fill="#6b3f1f" transform="rotate(-14 110 50)" />
        <path d="M46 80 H190 V160 H46 Z" fill="#7a4a24" />
        <path d="M46 80 H190" />
        <rect x="104" y="96" width="26" height="30" rx="4" fill="#d9b25c" />
      </g>
      <CoinPile x={118} y={84} w={120} n={14} seed={17} glow={false} />
      <CoinPile x={214} y={172} w={70} n={6} seed={19} glow={false} />
    </svg>
  );
}

/** A spiral snail shell resting in a ring of pebbles. */
export function Shell({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="A snail shell on the pond floor">
      <circle cx="60" cy="60" r="54" fill="#1b1712" stroke={INK} strokeWidth="4" />
      <circle cx="60" cy="60" r="40" fill="#cdb48c" stroke={INK} strokeWidth="4" />
      <path d="M60 60 m0 -4 a4 4 0 1 1 -4 4 a10 10 0 1 1 10 10 a18 18 0 1 1 -18 -18 a26 26 0 1 1 26 26" fill="none" stroke="#6b5234" strokeWidth="3.5" />
    </svg>
  );
}

/** A single kelp strand that links two panels, like a root through soil. */
export function Kelp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 240" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M40 0 C10 40 70 80 40 120 C10 160 70 200 40 240" fill="none" stroke="#163f2b" strokeWidth="26" strokeLinecap="round" />
      <path d="M40 0 C10 40 70 80 40 120 C10 160 70 200 40 240" fill="none" stroke="#2a7a50" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
