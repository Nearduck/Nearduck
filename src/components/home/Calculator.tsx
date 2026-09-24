"use client";

import { useMemo, useState } from "react";
import { BRAND } from "@/config/brand";
import { DepthTag } from "@/components/home/ui";
import { downloadSvgAsPng } from "@/lib/download";

/** Assumed until the contract is live; shown on the page as an assumption. */
const SUPPLY = 1_000_000_000;
const CAPS = [1e6, 1e7, 1e8, 1e9];
const BAGS = [1e6, 5e6, 1e7, 5e7];
const ARMCHAIR_USD = 1200;
const BREAD_USD = 3;

const short = (n: number) =>
  n >= 1e9 ? `${n / 1e9}B` : n >= 1e6 ? `${n / 1e6}M` : n >= 1e3 ? `${n / 1e3}K` : String(n);
const money = (n: number) =>
  n >= 100 ? `$${Math.round(n).toLocaleString("en-US")}` : `$${n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
const num = (n: number, d = 0) => n.toLocaleString("en-US", { maximumFractionDigits: d });

export function Calculator() {
  const [unit, setUnit] = useState<"token" | "usd">("token");
  const [raw, setRaw] = useState("10000000");
  const [cap, setCap] = useState(1e7);
  const [busy, setBusy] = useState(false);

  const r = useMemo(() => {
    const value = Math.max(0, Number(raw.replace(/[^0-9.]/g, "")) || 0);
    const price = cap / SUPPLY;
    const tokens = unit === "token" ? value : price > 0 ? value / price : 0;
    const worth = tokens * price;
    const share = (tokens / SUPPLY) * 100;
    return { tokens, worth, share, price, chairs: worth / ARMCHAIR_USD, bread: worth / BREAD_USD, x10: worth * 10 };
  }, [raw, cap, unit]);

  const download = async () => {
    setBusy(true);
    try {
      const out = await downloadSvgAsPng("float-card", `nearduck-float-card.png`, 1200);
      out.save();
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="calculator" className="relative mx-auto mt-24 max-w-[1180px] scroll-mt-20 px-4 sm:px-6 lg:px-10">
      <div className="panel relative overflow-hidden bg-[radial-gradient(circle_at_85%_10%,rgba(0,236,151,0.12),transparent_40%)] px-5 pt-20 pb-10 sm:px-16">
        <div className="absolute top-5 left-1/2 -translate-x-1/2">
          <DepthTag depth={22} label="The calculator" />
        </div>
        <p className="eyebrow">Float estimator</p>
        <h2 className="h-display mt-4 text-[40px] sm:text-[66px]">What&apos;s my float worth?</h2>
        <p className="mt-4 max-w-2xl text-muted">
          Pick a bag and a market cap and the duck does the maths. It is a what-if tool for a token that has not
          launched yet, not a price target and not a promise.
        </p>
        <p className="mt-5 font-mono text-[11px] tracking-[0.16em] text-mint uppercase">
          Scenario mode · supply assumed {short(SUPPLY)}
        </p>

        <div className="mt-6 flex gap-2">
          {(["token", "usd"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => {
                if (u === unit) return;
                setRaw(String(Math.round(u === "usd" ? r.worth : r.tokens)));
                setUnit(u);
              }}
              className={`btn h-12 px-5 text-[15px] ${unit === u ? "btn-mint" : "btn-ghost"}`}
            >
              {u === "token" ? BRAND.ticker : "USD"}
            </button>
          ))}
        </div>

        <label className="mt-5 flex items-center gap-4 rounded-2xl border border-line bg-black/40 px-4 py-3 focus-within:border-mint/50">
          <span className="w-24 shrink-0 text-sm leading-tight text-muted">Enter what you hold</span>
          <input
            inputMode="decimal"
            value={raw === "" ? "" : num(Number(raw) || 0, 2)}
            onChange={(e) => setRaw(e.target.value.replace(/[^0-9.]/g, ""))}
            className="min-w-0 flex-1 bg-transparent font-mono text-2xl text-text outline-none"
            aria-label={unit === "token" ? `Amount of ${BRAND.ticker}` : "Amount in USD"}
            data-testid="calc-input"
          />
          <span className="font-mono text-xs text-dim">{unit === "token" ? BRAND.ticker : "USD"}</span>
        </label>

        {unit === "token" ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {BAGS.map((b) => (
              <button key={b} type="button" onClick={() => setRaw(String(b))} className="btn btn-ghost h-8 px-3.5 text-[13px]">
                {short(b)}
              </button>
            ))}
          </div>
        ) : null}

        <p className="mt-6 font-mono text-[10px] tracking-[0.16em] text-dim uppercase">Market cap scenario</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CAPS.map((c) => (
            <button key={c} type="button" onClick={() => setCap(c)} className={`btn h-9 px-4 text-[13px] ${cap === c ? "btn-mint" : "btn-ghost"}`}>
              ${short(c)}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 md:grid-cols-4">
          <Tile label="Worth at this cap" value={money(r.worth)} sub={`at $${r.price.toPrecision(3)} each`} testId="calc-worth" />
          <Tile label="If it does 10×" value={money(r.x10)} sub="purely hypothetical" />
          <Tile label="Share of supply" value={`${r.share < 0.001 && r.share > 0 ? "<0.001" : num(r.share, 3)}%`} />
          <Tile label="Position" value={num(r.tokens)} sub={BRAND.ticker} />
          <Tile label="Armchairs" value={num(r.chairs, 1)} sub={`at $${ARMCHAIR_USD} a chair`} />
          <Tile label="Bread for the pond" value={`${num(r.bread)} loaves`} sub="ducks accept bread" />
          <Tile label="Wen bigger chair" value={r.chairs >= 1 ? "Now" : r.worth > 0 ? `${money(ARMCHAIR_USD - r.worth)} to go` : "—"} />
        </div>

        <p className="mt-6 border-t border-line pt-5 font-mono text-xs leading-relaxed text-muted">
          {num(r.tokens)} {BRAND.ticker} ÷ {short(SUPPLY)} supply × ${short(cap)} market cap ={" "}
          <span className="text-mint">{money(r.worth)}</span>
        </p>

        <button type="button" onClick={download} disabled={busy} className="btn btn-mint mt-6 h-12 px-6 text-[15px]">
          {busy ? "Drawing…" : "Download float card"}
        </button>
        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-dim">
          Supply is an assumption until the contract is published; the real figure replaces it at launch. Market caps
          are scenarios you pick, not forecasts. Nothing here is financial advice.
        </p>

        {/* Off-screen source for the downloadable card. */}
        <svg id="float-card" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" className="absolute -left-[9999px] h-px w-px" aria-hidden="true">
          <rect width="1200" height="630" fill="#0b0806" />
          <rect x="24" y="24" width="1152" height="582" rx="36" fill="#15110d" stroke="#00ec97" strokeOpacity="0.4" strokeWidth="2" />
          <image href="/brand/nearduck-mark.webp" x="760" y="150" width="400" height="400" />
          <text x="72" y="110" fontFamily="Menlo, monospace" fontSize="22" letterSpacing="4" fill="#00ec97">{BRAND.symbol} · FLOAT CARD</text>
          <text x="72" y="210" fontFamily="'Archivo Black', Impact, sans-serif" fontSize="76" fill="#f3ead8">{money(r.worth)}</text>
          <text x="72" y="262" fontFamily="Menlo, monospace" fontSize="24" fill="#c9c0ad">{num(r.tokens)} {BRAND.ticker} at a ${short(cap)} cap</text>
          <text x="72" y="340" fontFamily="Menlo, monospace" fontSize="24" fill="#c9c0ad">share of supply {num(r.share, 3)}%</text>
          <text x="72" y="380" fontFamily="Menlo, monospace" fontSize="24" fill="#c9c0ad">armchairs {num(r.chairs, 1)}</text>
          <text x="72" y="540" fontFamily="Menlo, monospace" fontSize="18" fill="#8a8272">scenario, not a forecast · {BRAND.domain}</text>
        </svg>
      </div>
    </section>
  );
}

function Tile({ label, value, sub, testId }: { label: string; value: string; sub?: string; testId?: string }) {
  return (
    <div className="tile min-w-0 px-4 py-4" data-testid={testId}>
      <p className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">{label}</p>
      <p className="mt-2 font-display text-lg break-words text-text sm:text-2xl">{value}</p>
      {sub ? <p className="mt-1 text-xs text-dim">{sub}</p> : null}
    </div>
  );
}
