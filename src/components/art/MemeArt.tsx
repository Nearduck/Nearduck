import type { Meme } from "@/data/memes";
import { MARK } from "./Scenes";
import { DuckShape } from "./Duck";

const INK = "#141110";
const W = 600;
const H = 750;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Backdrop({ scene, uid }: { scene: Meme["scene"]; uid: string }) {
  const r = seeded(uid.length * 97 + 13);
  switch (scene) {
    case "sky":
      return (
        <>
          <defs>
            <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a98dc" />
              <stop offset="1" stopColor="#cdeef8" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill={`url(#${uid}-g)`} />
          <path d="M60 250 C30 250 30 210 62 210 C66 180 110 176 118 200 C140 180 180 196 172 226 C196 228 196 250 172 250 Z" fill="#fff" stroke={INK} strokeWidth="5" />
          <path d="M420 190 C396 190 394 160 420 158 C426 134 462 132 470 152 C490 140 520 156 512 176 C534 178 532 190 512 190 Z" fill="#fff" stroke={INK} strokeWidth="5" />
          <rect y="600" width={W} height="150" fill="#3fb3d6" stroke={INK} strokeWidth="5" />
        </>
      );
    case "night":
      return (
        <>
          <rect width={W} height={H} fill="#0d1742" />
          {Array.from({ length: 50 }, (_, i) => (
            <circle key={i} cx={r() * W} cy={r() * 520} r={0.8 + r() * 2} fill="#fff" opacity={0.5 + r() * 0.5} />
          ))}
          <circle cx="470" cy="150" r="54" fill="#fff6d6" stroke={INK} strokeWidth="5" />
          <rect y="600" width={W} height="150" fill="#1c4a6a" stroke={INK} strokeWidth="5" />
        </>
      );
    case "pump":
    case "dump": {
      const up = scene === "pump";
      const candles = Array.from({ length: 12 }, (_, i) => {
        const base = up ? 520 - i * 34 : 160 + i * 34;
        const h = 40 + r() * 50;
        return { x: 30 + i * 48, y: base - h / 2, h, green: up ? r() > 0.2 : r() > 0.85 };
      });
      return (
        <>
          <rect width={W} height={H} fill="#0e1311" />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="0" x2={W} y1={80 + i * 70} y2={80 + i * 70} stroke="#ffffff" strokeOpacity="0.06" />
          ))}
          {candles.map((c, i) => (
            <g key={i}>
              <line x1={c.x + 14} x2={c.x + 14} y1={c.y - 16} y2={c.y + c.h + 16} stroke={c.green ? "#00ec97" : "#ff5a4e"} strokeWidth="3" />
              <rect x={c.x} y={c.y} width="28" height={c.h} rx="3" fill={c.green ? "#00ec97" : "#ff5a4e"} />
            </g>
          ))}
          <rect y="620" width={W} height="130" fill="#161d1a" />
        </>
      );
    }
    case "sunset":
      return (
        <>
          <defs>
            <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff8a3d" />
              <stop offset="0.6" stopColor="#ffc86b" />
              <stop offset="1" stopColor="#ffe3a6" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill={`url(#${uid}-g)`} />
          <circle cx="300" cy="560" r="150" fill="#ffe95c" stroke={INK} strokeWidth="5" />
          <rect y="600" width={W} height="150" fill="#e0703a" stroke={INK} strokeWidth="5" />
          <path d="M40 640 H200 M260 680 H440 M470 650 H570" stroke="#ffd08a" strokeWidth="6" strokeLinecap="round" />
        </>
      );
    case "deep":
      return (
        <>
          <defs>
            <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1d7f93" />
              <stop offset="1" stopColor="#0a2422" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill={`url(#${uid}-g)`} />
          {Array.from({ length: 18 }, (_, i) => (
            <circle key={i} cx={r() * W} cy={r() * H} r={4 + r() * 12} fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2.5" />
          ))}
          {Array.from({ length: 26 }, (_, i) => (
            <g key={`c${i}`} transform={`translate(${40 + r() * 520} ${640 + r() * 80})`}>
              <ellipse rx="26" ry="10" fill="#19d48b" stroke={INK} strokeWidth="3" />
            </g>
          ))}
        </>
      );
    case "desk":
      return (
        <>
          <rect width={W} height={H} fill="#f7f2e3" />
          <rect x="60" y="120" width="480" height="300" rx="16" fill="#fff" stroke={INK} strokeWidth="5" />
          <text x="300" y="220" textAnchor="middle" fontFamily="Menlo, monospace" fontSize="44" fontWeight="700" fill={INK}>GAS = ETH</text>
          <text x="300" y="290" textAnchor="middle" fontFamily="Menlo, monospace" fontSize="30" fill="#0e9a45">chain 4663</text>
          <rect y="610" width={W} height="140" fill="#c08a52" stroke={INK} strokeWidth="5" />
          <g transform="translate(40 520) scale(1.1)">
            <DuckShape mood="awake" />
          </g>
        </>
      );
  }
}

function Caption({ text, y }: { text: string; y: number }) {
  // Archivo Black capitals run about 0.74em wide; keep every line inside the frame.
  const size = Math.min(64, Math.floor(548 / (text.length * 0.74)));
  return (
    <text
      x={W / 2}
      y={y}
      textAnchor="middle"
      fontFamily="'Archivo Black', Impact, 'Arial Black', sans-serif"
      fontSize={size}
      fill="#fff"
      stroke={INK}
      strokeWidth={size / 7}
      paintOrder="stroke"
      strokeLinejoin="round"
    >
      {text.toUpperCase()}
    </text>
  );
}

/** One meme as SVG; also the source the download button rasterises. */
export function MemeArt({ meme, className = "", suffix = "" }: { meme: Meme; className?: string; suffix?: string }) {
  const uid = `meme-${meme.id}${suffix}`;
  const markY = meme.scene === "desk" ? 250 : 190;
  const markSize = meme.scene === "desk" ? 360 : 440;
  const markX = meme.scene === "desk" ? 220 : (W - markSize) / 2;
  const tilt = meme.scene === "dump" ? -12 : meme.scene === "pump" ? 6 : 0;
  // Mirror every other meme so the grid does not read as one picture repeated.
  const flip = meme.id.length % 2 === 1 && meme.scene !== "desk";
  return (
    <svg
      id={uid}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`${meme.top} — ${meme.bottom}`}
    >
      <Backdrop scene={meme.scene} uid={uid} />
      <g transform={`rotate(${tilt} ${W / 2} ${H / 2})`}>
        <g transform={flip ? `translate(${W} 0) scale(-1 1)` : undefined}>
          <image href={MARK} x={markX} y={markY} width={markSize} height={markSize} />
        </g>
      </g>
      <Caption text={meme.top} y={92} />
      <Caption text={meme.bottom} y={H - 44} />
      <text x={W - 16} y={H - 12} textAnchor="end" fontFamily="Menlo, monospace" fontSize="14" fill="#fff" opacity="0.75">nearduck.xyz</text>
    </svg>
  );
}
