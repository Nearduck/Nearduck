/* A small duck drawn in the same cartoon line style as the mascot: flat
   yellow, orange bill, heavy dark outline. Used for decorative extras; the
   mascot itself is always the owner-supplied artwork. */

type Mood = "awake" | "sleep" | "wink";

export const DUCK = {
  body: "#ffd92e",
  shade: "#f2bf14",
  bill: "#f07a12",
  boot: "#0e9a45",
  ink: "#141110",
};

export function DuckShape({
  mood = "awake",
  boots = false,
  stroke = 4,
}: {
  mood?: Mood;
  boots?: boolean;
  stroke?: number;
}) {
  const s = { stroke: DUCK.ink, strokeWidth: stroke, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <g>
      {boots ? (
        <>
          <path d="M44 84 C40 96 50 102 60 100 C66 99 66 92 60 88 Z" fill={DUCK.boot} {...s} />
          <path d="M70 84 C66 96 76 102 86 100 C92 99 92 92 86 88 Z" fill={DUCK.boot} {...s} />
        </>
      ) : null}
      <path
        d="M30 52 C16 44 20 14 42 12 C62 11 66 32 58 46 C74 44 96 40 110 26 C117 46 112 66 100 76 C88 90 62 92 44 89 C24 86 14 74 17 62 C18 57 23 54 30 52 Z"
        fill={DUCK.body}
        {...s}
      />
      <path d="M50 64 C62 54 82 56 90 66 C80 74 62 76 50 64 Z" fill={DUCK.shade} {...s} strokeWidth={stroke * 0.75} />
      <path d="M24 30 C12 24 2 30 4 38 C6 46 18 46 26 40 C29 37 28 32 24 30 Z" fill={DUCK.bill} {...s} />
      {mood === "awake" ? <circle cx="38" cy="26" r="3.6" fill={DUCK.ink} /> : null}
      {mood === "sleep" ? <path d="M32 27 Q38 32 44 27" fill="none" {...s} strokeWidth={stroke * 0.8} /> : null}
      {mood === "wink" ? (
        <>
          <path d="M33 26 L42 24" fill="none" {...s} strokeWidth={stroke * 0.8} />
        </>
      ) : null}
    </g>
  );
}

/** Standalone duck, sized by the caller. viewBox is 0 0 120 104. */
export function Duck({
  mood = "awake",
  boots = false,
  flip = false,
  className = "",
  title,
}: {
  mood?: Mood;
  boots?: boolean;
  flip?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <svg viewBox="0 0 120 104" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <g transform={flip ? "translate(120 0) scale(-1 1)" : undefined}>
        <DuckShape mood={mood} boots={boots} />
      </g>
    </svg>
  );
}
