"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { Bubbles, Cloud, FlyingDuck, MARK, Reeds } from "@/components/art/Scenes";
import { BRAND, CHAIN, TOKEN } from "@/config/brand";
import { fmt, useAgo, useChainPulse } from "@/lib/chain";

export function Hero() {
  const pulse = useChainPulse();
  const ago = useAgo(pulse.updatedAt);
  const chart = TOKEN.chartUrl;

  return (
    <section id="surface" className="relative overflow-hidden">
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#2f8fd8_0%,#5fb4ea_38%,#a9dcf4_72%,#d8f0f7_100%)] lg:min-h-[860px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Cloud className="absolute top-[300px] -left-12 hidden w-44 opacity-95 xl:block" style={{ animation: "drift 18s ease-in-out infinite alternate" }} />
          <Cloud className="absolute top-[120px] right-[34%] hidden w-40 lg:block" style={{ animation: "drift 22s ease-in-out infinite alternate" }} />
          <Cloud className="absolute top-[150px] -right-14 w-44 lg:top-[230px] lg:-right-8 lg:w-56" style={{ animation: "drift 26s ease-in-out infinite alternate" }} />
          <Cloud className="absolute top-[470px] left-[42%] hidden w-32 opacity-90 lg:block" />
          <FlyingDuck className="absolute top-12 w-9" style={{ animation: "fly 28s linear infinite" }} />
          <FlyingDuck className="absolute top-24 w-6" style={{ animation: "fly 36s linear 6s infinite" }} />
          <FlyingDuck className="absolute top-40 w-5" style={{ animation: "fly 44s linear 14s infinite" }} />
          {/* on wide screens the pond starts behind the hero copy, as the ground does in the layout */}
          <div className="absolute inset-x-0 bottom-0 hidden h-[250px] bg-[linear-gradient(180deg,#3fb3d6_0%,#2c9cc0_45%,#1f7f9c_100%)] lg:block">
            <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(100deg,transparent_0_60px,rgba(255,255,255,0.08)_60px_90px)]" />
          </div>
          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[234px] hidden h-8 w-full lg:block">
            <path d="M0 20 Q60 6 120 20 T240 20 T360 20 T480 20 T600 20 T720 20 T840 20 T960 20 T1080 20 T1200 20 T1320 20 T1440 20 V40 H0 Z" fill="#3fb3d6" stroke="#141110" strokeWidth="4" />
          </svg>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[40px] h-[110px] w-full lg:bottom-[290px]">
            <path d="M0 80 C160 30 300 60 460 44 C640 26 760 70 940 50 C1100 32 1260 60 1440 40 V120 H0 Z" fill="#6fae57" stroke="#141110" strokeWidth="4" />
            <path d="M0 100 C200 70 420 96 700 80 C980 64 1200 96 1440 76 V120 H0 Z" fill="#4f9444" stroke="#141110" strokeWidth="4" />
          </svg>
          <Reeds className="absolute inset-x-0 bottom-0 h-[130px] w-full lg:bottom-[250px] lg:h-[150px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 pt-[96px] pb-6 sm:px-6 lg:pt-[100px] lg:pb-[150px] lg:px-10">
          <p className="inline-flex max-w-full items-center gap-2 rounded-md bg-white/75 px-2.5 py-1.5 font-mono text-[11px] tracking-[0.16em] text-soil uppercase shadow-sm sm:text-xs">
            <span className="size-2 shrink-0 rounded-full bg-mint animate-pulse-dot" />
            <span className="truncate">
              Duck on duty · <span className="hidden sm:inline">pond side, </span>
              {CHAIN.name}
            </span>
          </p>
          <h1 className="h-display mt-5 text-[76px] leading-[0.86] text-soil drop-shadow-[0_2px_0_rgba(255,255,255,0.35)] sm:text-[108px]">
            Near
            <br />
            Duck.
          </h1>
          <p className="mt-6 max-w-[490px] text-lg leading-[1.5] text-soil">
            Some ducks chase the market. This one pulls an armchair up to the water and waits for it to float
            by. <strong>{BRAND.symbol}</strong> is the laziest duck on <strong>{CHAIN.name}</strong>.
          </p>
          <div className="mt-7 flex max-w-[520px] flex-wrap gap-3">
            <Link href="/swap" className="btn btn-soil h-[58px] flex-col gap-0 px-8 leading-tight">
              <span className="text-base">Enter the pond</span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">Wallet · swap · {BRAND.ticker}</span>
            </Link>
            {chart ? (
              <a href={chart} target="_blank" rel="noreferrer" className="btn btn-glass h-[58px] px-6 text-base">
                Watch the chart
              </a>
            ) : (
              <span className="btn btn-glass h-[58px] cursor-default flex-col gap-0 px-6 leading-tight" title="The chart opens once the contract is live">
                <span className="text-base">Watch the chart</span>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase opacity-70">at launch</span>
              </span>
            )}
            <Link href="/memes" className="btn btn-glass h-12 px-6 text-base">
              Open meme stash
            </Link>
          </div>

          <div className="mt-8 max-w-[484px] overflow-hidden rounded-2xl border-l-4 border-mint bg-[#140f0b]/95 px-5 py-4 shadow-2xl" data-testid="hero-live">
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">{CHAIN.name} · latest block</p>
            <p className="mt-1 font-display text-[38px] leading-tight text-mint tabular-nums drop-shadow-[0_0_18px_rgba(0,236,151,0.45)] sm:text-5xl">
              #{fmt(pulse.block)}
            </p>
            <p className="mt-1 font-mono text-sm text-text">
              gas {pulse.gasGwei === null ? "—" : `${fmt(pulse.gasGwei, 4)} gwei`} · ETH {pulse.ethUsd ? `$${fmt(pulse.ethUsd, 2)}` : "—"}
            </p>
            <p className="mt-1 text-xs text-muted">
              {pulse.error && !pulse.block ? "RPC unreachable · retrying" : `Live · updated ${ago}`}
            </p>
          </div>

          <a href="#nest" className="mt-8 hidden items-center gap-2 font-mono text-xs tracking-[0.2em] text-white/85 uppercase lg:inline-flex">
            Dive <ArrowDown className="size-4" style={{ animation: "bob 1.6s ease-in-out infinite" }} />
          </a>
        </div>

        {/* mascot on its floating raft, sitting on the waterline */}
        <div className="pointer-events-none relative z-10 mx-auto -mb-2 w-[270px] sm:w-[340px] lg:absolute lg:right-[4%] lg:bottom-[236px] lg:mb-0 lg:w-[420px] xl:right-[8%] xl:w-[520px]">
          <div className="relative" style={{ animation: "bob 4.5s ease-in-out infinite" }}>
            <img src={MARK} alt={`${BRAND.name} mascot relaxing in an armchair`} className="relative z-10 w-full drop-shadow-[0_24px_30px_rgba(0,40,60,0.35)]" />
            <svg viewBox="0 0 300 60" className="absolute -bottom-7 left-1/2 w-[100%] -translate-x-1/2" aria-hidden="true">
              <ellipse cx="150" cy="30" rx="140" ry="22" fill="#9b6a3c" stroke="#141110" strokeWidth="4" />
              <ellipse cx="150" cy="24" rx="126" ry="14" fill="#c08a52" stroke="#141110" strokeWidth="3" />
            </svg>
          </div>
        </div>
      </div>

      {/* under the surface */}
      <div className="relative h-[380px] bg-[linear-gradient(180deg,#2c9cc0_0%,#1b6f86_22%,#124a52_48%,#0f2a2a_100%)] lg:h-[400px] lg:bg-[linear-gradient(180deg,#1f7f9c_0%,#1b6f86_15%,#124a52_45%,#0f2a2a_100%)]">
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="absolute inset-x-0 -top-4 z-20 h-8 w-full lg:hidden" aria-hidden="true">
          <path d="M0 20 Q60 6 120 20 T240 20 T360 20 T480 20 T600 20 T720 20 T840 20 T960 20 T1080 20 T1200 20 T1320 20 T1440 20 V40 H0 Z" fill="#3fb3d6" stroke="#141110" strokeWidth="4" />
        </svg>
        <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(100deg,transparent_0_60px,rgba(255,255,255,0.07)_60px_90px)]" />
        <Bubbles count={22} seed={4} />
        <svg viewBox="0 0 400 600" preserveAspectRatio="none" className="absolute top-8 left-1/2 h-[calc(100%-32px)] w-[260px] -translate-x-1/2 opacity-70" aria-hidden="true">
          <path d="M180 0 C120 120 260 200 190 320 C140 420 240 500 200 600 H240 C290 500 190 420 240 320 C310 200 170 120 240 0 Z" fill="#081716" />
        </svg>
        <a href="#nest" className="absolute top-8 left-4 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-white/80 uppercase lg:hidden">
          Dive <ArrowDown className="size-4" style={{ animation: "bob 1.6s ease-in-out infinite" }} />
        </a>
      </div>
    </section>
  );
}
