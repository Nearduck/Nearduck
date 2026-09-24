import { DuckShape } from "@/components/art/Duck";
import { Cloud, FlyingDuck, Reeds } from "@/components/art/Scenes";

const INK = "#141110";

/** A duck's head and back poking out of the water, with its ripple ring. */
function Peeker({ x, y, s, flip, delay }: { x: number; y: number; s: number; flip?: boolean; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="0" rx={70 * s} ry={16 * s} fill="#2d86a8" stroke={INK} strokeWidth="3" />
      <ellipse cx="0" cy="0" rx={70 * s} ry={16 * s} fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="2" style={{ transformOrigin: `${x}px ${y}px`, transformBox: "fill-box", animation: `ripple 3.4s ease-out ${delay}s infinite` }} />
      <g style={{ animation: `bob 3.6s ease-in-out ${delay}s infinite` }}>
        <svg x={-60 * s} y={-80 * s} width={120 * s} height={90 * s} viewBox="0 0 120 90" overflow="hidden">
          <g transform={flip ? "translate(120 0) scale(-1 1)" : undefined}>
            <DuckShape mood={delay > 1 ? "wink" : "awake"} />
          </g>
        </svg>
      </g>
    </g>
  );
}

function LilyPad({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      d={`M${x} ${y} L${x + r} ${y - r * 0.12} A${r} ${r * 0.42} 0 1 1 ${x + r * 0.9} ${y + r * 0.2} Z`}
      fill="#3f9a45"
      stroke={INK}
      strokeWidth="3"
    />
  );
}

export function PondScene({ night }: { night: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={`absolute inset-0 ${
          night
            ? "bg-[linear-gradient(180deg,#0b1440_0%,#1f3b78_55%,#3b5f96_100%)]"
            : "bg-[linear-gradient(180deg,#6cc0ea_0%,#a8dcf2_50%,#d8f0f7_100%)]"
        }`}
      />
      {night ? (
        <div className="absolute top-16 right-[18%] size-20 rounded-full border-4 border-[#141110] bg-[#fff6d6] shadow-[0_0_60px_rgba(255,246,214,0.6)]" />
      ) : (
        <>
          <Cloud className="absolute top-[70px] -left-6 hidden w-44 md:block" style={{ animation: "drift 20s ease-in-out infinite alternate" }} />
          <Cloud className="absolute top-[150px] right-[6%] hidden w-52 md:block" style={{ animation: "drift 26s ease-in-out infinite alternate" }} />
          <Cloud className="absolute top-[300px] left-[12%] hidden w-32 md:block" />
          <FlyingDuck className="absolute top-28 w-8" style={{ animation: "fly 30s linear infinite" }} />
          <FlyingDuck className="absolute top-40 w-6" style={{ animation: "fly 40s linear 9s infinite" }} />
        </>
      )}
      <svg viewBox="0 0 1440 520" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[58%] w-full">
        <path d="M0 40 C200 0 420 30 700 16 C980 2 1200 34 1440 10 V520 H0 Z" fill={night ? "#2f5a3a" : "#7cbc5e"} stroke={INK} strokeWidth="4" />
        <path d="M-40 150 C300 90 1100 90 1480 150 V520 H-40 Z" fill={night ? "#1e4c66" : "#3fb3d6"} stroke={INK} strokeWidth="5" />
        <path d="M-40 260 C300 220 1100 220 1480 260 V520 H-40 Z" fill={night ? "#1a4058" : "#2e9cc4"} opacity="0.7" />
        <path d="M80 200 H300 M1080 230 H1320 M520 330 H760" stroke="#fff" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[58%] w-full">
        <LilyPad x={160} y={300} r={60} />
        <LilyPad x={1240} y={260} r={50} />
        <LilyPad x={1000} y={420} r={70} />
        <LilyPad x={380} y={440} r={44} />
        <Peeker x={250} y={250} s={1.1} delay={0} />
        <Peeker x={1180} y={380} s={1.3} flip delay={1.4} />
        <Peeker x={90} y={430} s={0.9} delay={2.2} />
        <Peeker x={1340} y={210} s={0.8} flip delay={0.7} />
      </svg>
      <Reeds className="absolute inset-x-0 top-[calc(42%-78px)] h-[90px] w-full opacity-90" seed={11} />
    </div>
  );
}
