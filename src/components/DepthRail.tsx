"use client";

import { MAX_DEPTH, STOPS } from "@/components/site";
import { useDepth } from "@/components/useDepth";

const TOP = 190;
const SPAN = 520;

/** Fixed depth gauge on the right edge, desktop only. */
export function DepthRail() {
  const { depth, stop } = useDepth();
  const visible = depth > 0.4;
  return (
    <div
      className={`pointer-events-none fixed right-8 z-40 hidden transition-opacity duration-500 xl:block ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ top: TOP, height: SPAN }}
      aria-hidden={!visible}
    >
      <div className="absolute top-0 right-0 h-full w-2.5 rounded-full border border-line bg-[linear-gradient(#c9a878,#6b4a2c_35%,#1b120c_75%,#050403)]" />
      {Array.from({ length: 15 }, (_, i) => (
        <span key={i} className="absolute right-3.5 h-px w-2 bg-dim/60" style={{ top: (i / 14) * SPAN }} />
      ))}
      <span
        className="absolute right-[-3px] size-4 rounded-full bg-mint shadow-[0_0_14px_#00ec97] transition-[top] duration-200"
        style={{ top: (Math.min(depth, MAX_DEPTH) / MAX_DEPTH) * SPAN - 8 }}
      />
      {STOPS.map((s) => (
        <button
          key={s.id}
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
          className={`pointer-events-auto absolute right-7 -translate-y-1/2 cursor-pointer rounded-md px-2 py-1 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap uppercase transition-colors ${
            stop === s.id ? "border border-mint/50 bg-black/60 text-mint" : "text-dim hover:text-text"
          }`}
          style={{ top: (s.depth / MAX_DEPTH) * SPAN }}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
