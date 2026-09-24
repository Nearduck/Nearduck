"use client";

import Link from "next/link";
import { CHAIN, TOKEN } from "@/config/brand";
import { NestArt } from "@/components/art/Scenes";
import { DepthTag, Stat } from "@/components/home/ui";
import { fmt, useAgo, useChainPulse } from "@/lib/chain";

export function Nest() {
  const p = useChainPulse();
  const ago = useAgo(p.updatedAt);
  const blockAgo = useAgo(p.timestamp ? p.timestamp * 1000 : null);
  const usd = (eth: number | null) => (eth !== null && p.ethUsd ? `≈ $${fmt(eth * p.ethUsd, 4)}` : "");
  const feeEth = p.gasGwei !== null ? (p.gasGwei * 21000) / 1e9 : null;

  return (
    <section id="nest" className="relative mx-auto mt-20 max-w-[1180px] scroll-mt-20 px-4 sm:px-6 lg:px-10">
      <div className="panel relative grid grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="absolute top-5 left-1/2 z-10 -translate-x-1/2">
          <DepthTag depth={2} label="The nest" />
        </div>
        <div className="relative h-[420px] lg:h-auto">
          <NestArt className="absolute inset-0 size-full" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_60%,rgba(13,11,9,0.95))] lg:bg-[linear-gradient(90deg,transparent_65%,rgba(13,11,9,0.98))]" />
        </div>

        <div className="min-w-0 px-5 pt-8 pb-10 sm:px-10 lg:pt-24">
          <p className="eyebrow">What the duck watches</p>
          <h2 className="h-display mt-4 text-[44px] sm:text-[66px]">Every block floats past the chair.</h2>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted">
            {CHAIN.name} keeps making blocks whether the duck is awake or not. Everything below is read straight from
            the chain&apos;s public RPC. No middleman, no made-up numbers, and no token figures until the token exists.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <Stat label="Chain id" value={CHAIN.id} />
            <Stat label="Latest block" value={fmt(p.block)} testId="stat-block" />
            <Stat label="Gas price" value={p.gasGwei === null ? "—" : `${fmt(p.gasGwei, 4)} gwei`} />
            <Stat label="Block time" value={p.blockTime === null ? "—" : `${fmt(p.blockTime, 2)} s`} />
            <Stat label="ETH price" value={p.ethUsd ? `$${fmt(p.ethUsd, 2)}` : "—"} />
            <Stat label="Market cap" value="At launch" />
            <Stat label="Holders" value="At launch" />
          </div>
          <p className="mt-4 font-mono text-xs text-dim">Live · updated {ago}</p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-dim">
            Read from {CHAIN.name} RPC{p.ethUsd ? ", ETH/USD from a public exchange feed" : ""}. {TOKEN.isLive ? "" : "Token stats appear once the contract is live."}
          </p>

          <div className="mt-7 rounded-2xl border border-line bg-black/40 p-5">
            <p className="eyebrow">Latest block receipt</p>
            <dl className="mt-3 divide-y divide-line text-sm">
              {[
                ["Block", p.block === null ? "—" : `#${fmt(p.block)}`],
                ["Produced", blockAgo],
                ["Transactions", fmt(p.txCount)],
                ["Gas used", p.gasUsedPct === null ? "—" : p.gasUsedPct < 0.01 ? "<0.01% of limit" : `${fmt(p.gasUsedPct, 2)}% of limit`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-mono text-text tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-dim">
              Each refresh reads the newest block directly. Explore any of them on{" "}
              <a href={p.block ? `${CHAIN.explorer}/block/${p.block}` : CHAIN.explorer} target="_blank" rel="noreferrer" className="text-mint hover:underline">
                Blockscout
              </a>
              .
            </p>
          </div>

          <div className="mt-3 rounded-2xl border border-line bg-black/40 p-5">
            <p className="eyebrow">Block history</p>
            <h3 className="mt-2 font-display text-xl">What the pond just moved.</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-start justify-between gap-4 rounded-xl bg-white/[0.03] px-3 py-2.5">
                <span className="text-xs text-muted">Transactions in the last 10 blocks</span>
                <span className="font-mono text-sm text-text tabular-nums">{fmt(p.recentTx)}</span>
              </div>
              <div className="flex items-start justify-between gap-4 rounded-xl bg-white/[0.03] px-3 py-2.5">
                <span className="text-xs text-muted">Cost of a plain ETH transfer now</span>
                <span className="text-right font-mono text-sm text-text tabular-nums">
                  {feeEth === null ? "—" : `${feeEth.toFixed(8)} ETH`}
                  <span className="block text-[11px] text-mint">{usd(feeEth)}</span>
                </span>
              </div>
            </div>
          </div>

          <h3 className="mt-6 font-display text-xl">Why {CHAIN.name}, not another pond.</h3>
          <p className="mt-2 text-muted">
            It is an EVM chain with ETH for gas, so any wallet that speaks Ethereum can sit here. Fast blocks and tiny
            fees mean the duck never has to get out of the chair to pay for a move.{" "}
            <Link href="/swap" className="text-mint hover:underline">Set up your wallet →</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
