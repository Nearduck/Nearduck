/** Small shared pieces for the home sections. */
export function DepthTag({ depth, label }: { depth: number; label: string }) {
  return (
    <span className="depth-chip whitespace-nowrap">
      <span className="size-1.5 rounded-full bg-mint animate-pulse-dot" />
      <span className="text-mint">−{depth} m</span>
      {label}
    </span>
  );
}

export function Stat({ label, value, sub, testId }: { label: string; value: React.ReactNode; sub?: React.ReactNode; testId?: string }) {
  return (
    <div className="tile min-w-0 px-4 py-3" data-testid={testId}>
      <p className="font-mono text-[10px] leading-snug tracking-[0.14em] text-dim uppercase">{label}</p>
      <p className="mt-1 truncate font-display text-[17px] text-text tabular-nums">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-dim">{sub}</p> : null}
    </div>
  );
}
