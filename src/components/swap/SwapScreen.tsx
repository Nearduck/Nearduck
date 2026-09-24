"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownUp, ArrowUpRight, Info, Pause, Play } from "lucide-react";
import { BRAND, CHAIN, TOKEN, explorerToken, isAddress, shortAddress } from "@/config/brand";
import { MarkBadge } from "@/components/Mark";
import { CopyCaPill } from "@/components/CopyCa";
import { PondScene } from "@/components/swap/PondScene";
import { NavWallet, useWalletModal } from "@/components/wallet/WalletButton";
import { useWallet } from "@/components/wallet/WalletProvider";
import { rpc } from "@/lib/rpc";

const TOUR_KEY = "nearduck.tour.done";

const TOUR = [
  { target: "swap-head", text: `welcome to the pond. this is where you'll pick up ${BRAND.symbol} once it's live.` },
  { target: "swap-send", text: "send: type how much you want to move. your real balance shows underneath." },
  { target: "swap-flip", text: "this little button flips the direction, in case you ever want to leave the pond." },
  { target: "swap-receive", text: "receive: the duck quotes what you'd get. quotes switch on at launch." },
  { target: "swap-cta", text: `the big button connects your wallet and moves it to ${CHAIN.name}, chain ${CHAIN.id}.` },
  { target: "swap-stats", text: "network, gas and contract live down here. always check the contract before a swap." },
];

function readFlag() {
  try {
    return window.localStorage.getItem(TOUR_KEY) === "1";
  } catch {
    return false;
  }
}
function writeFlag() {
  try {
    window.localStorage.setItem(TOUR_KEY, "1");
  } catch {
    // Tour simply shows again next time.
  }
}

function useLocalTime() {
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => {
    const read = () => setHour(new Date().getHours());
    read();
    const t = window.setInterval(read, 60000);
    return () => window.clearInterval(t);
  }, []);
  return hour;
}

/** ERC-20 balance of the token for the connected address, once the CA is real. */
function useTokenBalance(address: string | null) {
  const [value, setValue] = useState<string | null>(null);
  useEffect(() => {
    if (!address || !isAddress(BRAND.ca)) return;
    let cancelled = false;
    const data = `0x70a08231${address.slice(2).toLowerCase().padStart(64, "0")}`;
    rpc<string>("eth_call", [{ to: BRAND.ca, data }, "latest"])
      .then(async (raw) => {
        const decimalsHex = await rpc<string>("eth_call", [{ to: BRAND.ca, data: "0x313ce567" }, "latest"]).catch(() => "0x12");
        const decimals = Number.parseInt(decimalsHex, 16) || 18;
        const amount = Number(BigInt(raw)) / 10 ** decimals;
        if (!cancelled) setValue(amount.toLocaleString("en-US", { maximumFractionDigits: 2 }));
      })
      .catch(() => {
        if (!cancelled) setValue(null);
      });
    return () => {
      cancelled = true;
    };
  }, [address]);
  return address ? value : null;
}

export function SwapScreen() {
  const hour = useLocalTime();
  const night = hour !== null && (hour < 6 || hour >= 19);
  const [paused, setPaused] = useState(false);
  const [info, setInfo] = useState(true);
  const [reverse, setReverse] = useState(false);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<number | null>(null);
  const [anchor, setAnchor] = useState(0);
  const card = useRef<HTMLDivElement>(null);

  const { address, balance, chainId, onRobinhoodChain, switchNetwork, switching } = useWallet();
  const { open } = useWalletModal();
  const tokenBalance = useTokenBalance(address);

  useEffect(() => {
    // A short pause so the tour opens after the pond has drawn.
    const t = window.setTimeout(() => {
      if (!readFlag()) setStep(0);
    }, 500);
    return () => window.clearTimeout(t);
  }, []);

  const place = useCallback(() => {
    if (step === null || !card.current) return;
    const el = document.getElementById(TOUR[step].target);
    if (!el) return;
    const c = card.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setAnchor(r.top - c.top + r.height / 2);
  }, [step]);

  useEffect(() => {
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [place, info]);

  const endTour = () => {
    setStep(null);
    writeFlag();
  };

  const wrong = address !== null && chainId !== null && !onRobinhoodChain;
  const sendToken = reverse ? BRAND.ticker : "ETH";
  const receiveToken = reverse ? "ETH" : BRAND.ticker;
  const sendBalance = reverse ? tokenBalance : balance;
  const receiveBalance = reverse ? balance : tokenBalance;
  const ring = (id: string) =>
    step !== null && TOUR[step].target === id ? "ring-2 ring-mint ring-offset-2 ring-offset-[#14100c]" : "";

  return (
    <div className={`relative min-h-dvh overflow-hidden ${paused ? "anim-paused" : ""}`}>
      <PondScene night={night} />

      <header className="relative z-20 border-b border-white/20 bg-[rgba(243,234,216,0.24)] backdrop-blur-md">
        <div className="mx-auto flex h-[53px] max-w-[1200px] items-center justify-between gap-2 px-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 rounded-2xl px-1 py-1">
            <MarkBadge size={32} />
            <span className="hidden font-display text-xl text-soil sm:inline">{BRAND.ticker}</span>
          </Link>
          <div className="flex items-center gap-2">
            <CopyCaPill className="border-[#050403]! bg-[#14100c]! text-text!" />
            <NavWallet compact />
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 pt-4 pb-10">
        <p className="text-center">
          <Link href="/" className="font-mono text-[10px] tracking-[0.16em] text-[#3f493c] uppercase hover:underline">
            ↖ {BRAND.ticker} home
          </Link>
        </p>
        <p className={`mt-3 text-center font-mono text-[10px] tracking-[0.16em] uppercase ${night ? "text-white/80" : "text-soil"}`}>
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-mint align-middle" />
          {night ? "The moonlit side · night" : "The sunny side · day"} / local time
        </p>
        <h1 className={`h-display mt-2 text-center text-[32px] ${night ? "text-white" : "text-soil"}`}>Hey, pond hopper.</h1>
        <p className={`mt-1 text-center text-sm ${night ? "text-white/80" : "text-soil"}`}>Different chain. Same suspiciously relaxed duck.</p>

        <div ref={card} className="relative mx-auto mt-6 w-full max-w-[430px]">
          <div className="rounded-[28px] border-2 border-[#050403] bg-[#14100c] p-4 text-text shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] sm:p-5">
            <div id="swap-head" className={`flex items-center gap-2 rounded-lg ${ring("swap-head")}`}>
              <h2 className="font-display text-lg">Swap</h2>
              <button type="button" onClick={() => setInfo((v) => !v)} aria-label="About this panel" className="cursor-pointer text-dim hover:text-text">
                <Info className="size-4" />
              </button>
            </div>

            {info ? (
              <div className="mt-3 rounded-2xl border-2 border-mint/80 bg-black/40 p-4 text-sm leading-relaxed shadow-[0_0_24px_rgba(0,236,151,0.35)]">
                <p>
                  <strong>{BRAND.symbol} lives on {CHAIN.name}.</strong> Swaps open the moment the contract is published.
                  Until then this panel connects your wallet, puts it on the right network and shows your real ETH
                  balance.
                </p>
                <a href={CHAIN.explorer} target="_blank" rel="noreferrer" className="mt-3 inline-block font-mono text-[10px] tracking-[0.16em] text-mint uppercase hover:underline">
                  Open the chain explorer →
                </a>
              </div>
            ) : null}

            <div id="swap-send" className={`mt-3 rounded-xl ${ring("swap-send")}`}>
              <p className="text-sm text-muted">Send</p>
              <div className="mt-1 flex items-center gap-2 rounded-2xl border border-line bg-black/40 px-4 py-3">
                <input
                  inputMode="decimal"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  className="min-w-0 flex-1 bg-transparent font-mono text-2xl outline-none placeholder:text-dim"
                  aria-label={`Amount of ${sendToken} to send`}
                />
                <TokenBadge token={sendToken} />
              </div>
              <p className="mt-1 text-right text-xs text-dim">Balance: {sendBalance ?? "–"}</p>
            </div>

            <div className="relative -my-1 flex justify-center">
              <button
                id="swap-flip"
                type="button"
                onClick={() => setReverse((v) => !v)}
                aria-label="Flip direction"
                className={`flex size-11 cursor-pointer items-center justify-center rounded-full border-4 border-[#14100c] bg-white/5 hover:bg-white/10 ${ring("swap-flip")}`}
              >
                <ArrowDownUp className="size-4" />
              </button>
            </div>

            <div id="swap-receive" className={`rounded-xl ${ring("swap-receive")}`}>
              <p className="text-sm text-muted">Receive</p>
              <div className="mt-1 flex items-center gap-2 rounded-2xl border border-line bg-black/40 px-4 py-3">
                <span className="min-w-0 flex-1 font-mono text-2xl text-dim">0</span>
                <TokenBadge token={receiveToken} />
              </div>
              <div className="mt-1 flex justify-between text-xs text-dim">
                <span>quote opens at launch</span>
                <span>Balance: {receiveBalance ?? "–"}</span>
              </div>
            </div>

            <div id="swap-cta" className={`mt-4 rounded-full ${ring("swap-cta")}`}>
              {!address ? (
                <button type="button" onClick={open} className="btn btn-mint h-[60px] w-full text-base" data-testid="swap-connect">
                  Connect wallet
                </button>
              ) : wrong ? (
                <button type="button" onClick={switchNetwork} disabled={switching} className="btn btn-mint h-[60px] w-full text-base">
                  {switching ? "Confirm in wallet…" : `Switch to ${CHAIN.name}`}
                </button>
              ) : (
                <button type="button" disabled className="btn btn-mint h-[60px] w-full text-base">
                  {TOKEN.isLive ? "Swaps open soon" : "Swaps open at launch"}
                </button>
              )}
            </div>

            <a
              href={CHAIN.explorer}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center gap-3 rounded-xl border border-mint/25 bg-mint/5 px-3 py-2.5 transition-colors hover:border-mint/50"
            >
              <MarkBadge size={28} />
              <span className="min-w-0 flex-1 text-sm leading-tight">
                <span className="block font-bold">Want to see more?</span>
                <span className="text-muted">
                  Explore <span className="text-mint">{CHAIN.name}</span> on Blockscout.
                </span>
              </span>
              <ArrowUpRight className="size-4 text-mint" />
            </a>

            <div id="swap-stats" className={`mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-xs ${ring("swap-stats")}`}>
              <div>
                <p className="text-dim">Network</p>
                <p className="mt-0.5 font-bold text-text">{CHAIN.name}</p>
                <p className="text-dim">chain id {CHAIN.id}</p>
              </div>
              <div>
                <p className="text-dim">Gas</p>
                <p className="mt-0.5 font-bold text-text">{CHAIN.nativeSymbol}</p>
                <p className="text-dim">paid per move</p>
              </div>
              <div className="min-w-0">
                <p className="text-dim">Contract</p>
                {isAddress(BRAND.ca) ? (
                  <a href={explorerToken(BRAND.ca)} target="_blank" rel="noreferrer" className="mt-0.5 block truncate font-mono font-bold text-mint">
                    {shortAddress(BRAND.ca, 4, 4)}
                  </a>
                ) : (
                  <p className="mt-0.5 font-bold text-mint">At launch</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(0)}
              className="mt-4 w-full cursor-pointer border-t border-line pt-3 font-mono text-[11px] text-dim hover:text-text"
            >
              new here? let the duck show you around
            </button>
          </div>

          {step !== null ? (
            <div
              role="dialog"
              aria-label="Guided tour"
              className="fixed inset-x-3 bottom-3 z-30 rounded-2xl border border-line-2 bg-[#14100c] p-4 text-sm text-text shadow-2xl lg:absolute lg:inset-x-auto lg:right-[calc(100%+28px)] lg:bottom-auto lg:w-[300px] lg:-translate-y-1/2"
              style={{ animation: "bubble-in 0.25s ease-out", ...(typeof window !== "undefined" && window.innerWidth >= 1024 ? { top: anchor } : {}) }}
            >
              <p className="leading-relaxed">{TOUR[step].text}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[11px] text-dim">
                  {step + 1} of {TOUR.length}
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={endTour} className="btn btn-ghost h-8 px-3 text-xs">
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={() => (step + 1 < TOUR.length ? setStep(step + 1) : endTour())}
                    className="btn btn-mint h-8 px-3 text-xs"
                  >
                    {step + 1 < TOUR.length ? "Next" : "Done"}
                  </button>
                </div>
              </div>
              <span className="absolute top-1/2 -right-2 hidden size-4 -translate-y-1/2 rotate-45 border-t border-r border-line-2 bg-[#14100c] lg:block" />
            </div>
          ) : null}
        </div>
      </main>

      <footer className="relative z-10 flex flex-wrap items-center justify-center gap-3 px-4 pb-24 font-mono text-[10px] tracking-[0.16em] uppercase lg:pb-6">
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#8c5a32]/40 bg-[rgba(243,234,216,0.6)] px-3 py-1.5 text-[#493b29]"
        >
          {paused ? <Play className="size-3" /> : <Pause className="size-3" />}
          {paused ? "Play the ripples" : "Pause the ripples"}
        </button>
        <span className={night ? "text-white/80" : "text-soil"}>
          © {BRAND.ticker} 2026 · {night ? "moon up" : "sun out"} · duck seated · same pond
        </span>
      </footer>
    </div>
  );
}

function TokenBadge({ token }: { token: string }) {
  return (
    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1.5 text-sm font-bold">
      {token === "ETH" ? (
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#627eea" />
          <path d="M12 3.5 6.8 12.2 12 15.3l5.2-3.1z M12 16.3 6.8 13.2 12 20.5l5.2-7.3z" fill="#fff" />
        </svg>
      ) : (
        <MarkBadge size={22} />
      )}
      {token}
    </span>
  );
}
