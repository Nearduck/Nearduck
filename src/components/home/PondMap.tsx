"use client";

import { useEffect, useRef, useState } from "react";
import { CHAIN } from "@/config/brand";
import { DepthTag } from "@/components/home/ui";
import { MarkBadge } from "@/components/Mark";

const NODES = [
  { id: "wallets", label: "Wallets", x: 160, y: 120 },
  { id: "memes", label: "Meme stash", x: 330, y: 70 },
  { id: "ethereum", label: "Ethereum", x: 500, y: 70 },
  { id: "bridge", label: "Bridge", x: 840, y: 110 },
  { id: "explorer", label: "Blockscout", x: 110, y: 260 },
  { id: "rpc", label: "Public RPC", x: 890, y: 260 },
  { id: "contracts", label: "Contracts", x: 170, y: 410 },
  { id: "stocks", label: "Stock tokens", x: 380, y: 450 },
  { id: "gas", label: "ETH gas", x: 620, y: 450 },
  { id: "dex", label: "DEX pools", x: 830, y: 410 },
] as const;

const CENTER = { x: 500, y: 260 };

const ROUTES: [string, string][] = [
  ["wallets", "explorer"],
  ["ethereum", "gas"],
  ["bridge", "wallets"],
  ["memes", "dex"],
  ["rpc", "contracts"],
  ["stocks", "wallets"],
];

const CARDS = [
  { title: "EVM, all the way down", body: "Solidity contracts, familiar tooling and the wallets you already use. Nothing new to learn to sit near the duck." },
  { title: "ETH pays the gas", body: `Fees on ${CHAIN.name} are paid in ETH, and they are small enough that the duck barely notices them.` },
  { title: "An open explorer", body: "Every block, transfer and contract is public on Blockscout. Check the token address there before you trust any link." },
  { title: "Public endpoints", body: `The numbers on this page come from ${CHAIN.name}'s public RPC, read in your browser, with a second endpoint as backup.` },
];

function curve(a: { x: number; y: number }) {
  const mx = (a.x + CENTER.x) / 2;
  const my = (a.y + CENTER.y) / 2 + (a.y < CENTER.y ? 30 : -30);
  return `M${a.x} ${a.y} Q${mx} ${my} ${CENTER.x} ${CENTER.y}`;
}

export function PondMap() {
  const [route, setRoute] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);
  useEffect(() => {
    const t = window.setInterval(() => setRoute((r) => (r + 1) % ROUTES.length), 3200);
    return () => window.clearInterval(t);
  }, []);
  const [from, to] = ROUTES[route];
  const label = (id: string) => NODES.find((n) => n.id === id)!.label;

  return (
    <section id="map" className="relative mx-auto mt-6 max-w-[1180px] scroll-mt-20 px-4 sm:px-6 lg:px-10">
      <div className="panel relative overflow-hidden bg-[radial-gradient(circle_at_80%_0,rgba(0,236,151,0.14),transparent_45%)] px-5 pt-20 pb-12 sm:px-16">
        <div className="absolute top-5 left-1/2 -translate-x-1/2">
          <DepthTag depth={49} label="The map" />
        </div>
        <h2 className="h-display text-[44px] sm:text-[66px]">
          One pond.
          <br />
          <span className="text-mint">Every stream.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">
          {CHAIN.name} is an EVM network, so the tools you already have plug straight in. Wallets, contracts, pools and
          the explorer all flow into the same pond, and the duck can see every one of them from the chair.
        </p>

        <div ref={scroller} className="-mx-2 mt-8 overflow-x-auto sm:mx-0">
          <svg viewBox="0 0 1000 520" className="mx-auto w-full min-w-[600px]" role="img" aria-label={`Diagram: tools around ${CHAIN.name}`}>
            {NODES.map((n) => {
              const hot = n.id === from || n.id === to;
              return (
                <g key={n.id}>
                  <path d={curve(n)} fill="none" stroke="#050403" strokeWidth="22" strokeLinecap="round" />
                  <path d={curve(n)} fill="none" stroke="#3a3326" strokeWidth="16" strokeLinecap="round" opacity="0.8" />
                  {hot ? (
                    <path
                      d={curve(n)}
                      fill="none"
                      stroke="#00ec97"
                      strokeWidth="4"
                      strokeDasharray="12 8"
                      style={{ animation: "route-flow 0.8s linear infinite" }}
                    />
                  ) : null}
                </g>
              );
            })}
            {NODES.map((n) => {
              const hot = n.id === from || n.id === to;
              return (
                <g key={`${n.id}-node`}>
                  <ellipse cx={n.x} cy={n.y} rx="62" ry="28" fill="#15110d" stroke={hot ? "#00ec97" : "#4a4030"} strokeWidth="6" />
                  <text x={n.x} y={n.y + 5} textAnchor="middle" fontFamily="var(--font-spacemono), monospace" fontSize="14" fill={hot ? "#00ec97" : "#f3ead8"}>
                    {n.label}
                  </text>
                </g>
              );
            })}
            <ellipse cx={CENTER.x} cy={CENTER.y} rx="100" ry="54" fill="#15110d" stroke="#4a4030" strokeWidth="8" />
            <foreignObject x={CENTER.x - 16} y={CENTER.y - 40} width="32" height="32">
              <MarkBadge size={32} />
            </foreignObject>
            <text x={CENTER.x} y={CENTER.y + 22} textAnchor="middle" fontFamily="var(--font-spacemono), monospace" fontWeight="700" fontSize="15" fill="#f3ead8">
              {CHAIN.name}
            </text>
          </svg>
        </div>
        <p className="mt-4 flex items-center gap-2 font-mono text-xs text-muted">
          <span className="size-2 rounded-full bg-mint animate-pulse-dot" />
          Tracing {label(from)} to {label(to)} · illustration
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {CARDS.map((c) => (
            <div key={c.title} className="tile px-5 py-4">
              <h3 className="font-display text-xl">{c.title}</h3>
              <p className="mt-1.5 leading-relaxed text-muted">{c.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 font-mono text-[11px] text-dim">
          Explore the chain at{" "}
          <a href={CHAIN.explorer} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-text">
            robinhoodchain.blockscout.com
          </a>
          . Not affiliated with Robinhood Markets.
        </p>
      </div>
    </section>
  );
}
