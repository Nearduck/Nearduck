"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  MessageCircle,
  TriangleAlert,
  Wallet,
  X,
} from "lucide-react";
import { BRAND, CHAIN as chain, explorerAddress, shortAddress } from "@/config/brand";
import { WALLETCONNECT_RDNS, useWallet, type DiscoveredWallet } from "@/components/wallet/WalletProvider";
import { WALLET_CATALOG, catalogIcon } from "@/config/wallets";

/* ------------------------------------------------------------------ */
/* One dialog for the whole site. Every "connect" / "get access" button */
/* opens it through this context instead of owning a copy of it.        */
/* ------------------------------------------------------------------ */

const ModalContext = createContext<{ open: () => void } | null>(null);

export function WalletModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useCallback(() => setOpen(true), []);
  return (
    <ModalContext.Provider value={{ open: value }}>
      {children}
      {open ? <WalletDialog onClose={() => setOpen(false)} /> : null}
    </ModalContext.Provider>
  );
}

export function useWalletModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useWalletModal must be used inside WalletModalProvider");
  return context;
}

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function WalletIcon({ src }: { src: string | null }) {
  return src ? (
    <img src={src} alt="" width={28} height={28} className="size-7 shrink-0 rounded-lg" />
  ) : (
    <Wallet className="size-7 shrink-0 rounded-lg bg-white/10 p-1 text-mint" />
  );
}

function WalletDialog({ onClose }: { onClose: () => void }) {
  const { wallets, connect, connecting, error, clearError } = useWallet();
  const [pending, setPending] = useState<string | null>(null);

  const close = useCallback(() => {
    onClose();
    clearError();
  }, [onClose, clearError]);

  useEffect(() => {
    // Late-loading extensions announce on request, so ask again on open.
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  const installed = wallets
    .filter((w) => w.rdns !== WALLETCONNECT_RDNS)
    .sort((a, b) => Number(Boolean(a.unsupported)) - Number(Boolean(b.unsupported)));
  const walletConnect = wallets.find((w) => w.rdns === WALLETCONNECT_RDNS) ?? null;
  const detected = new Set(wallets.map((w) => w.rdns));
  const more = WALLET_CATALOG.filter((c) => !c.rdns.some((r) => detected.has(r)));
  const mobile = isMobile();
  const here = window.location.href;

  async function pick(wallet: DiscoveredWallet) {
    setPending(wallet.rdns);
    const ok = await connect(wallet);
    setPending(null);
    if (ok) onClose();
  }

  const row =
    "flex w-full items-center gap-3 rounded-xl border border-line bg-ground px-3.5 py-3 text-left font-mono text-sm";
  const heading = "px-1 pb-2 font-mono text-[10px] tracking-[0.2em] text-dim uppercase";

  // The header blurs what is behind it, and a backdrop filter turns it into
  // the containing block for fixed children. Rendered in place, the dialog
  // would be clipped to the header, so it always goes to <body>.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-dialog-title"
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={close} />
      <div className="relative flex max-h-[92dvh] w-full max-w-sm flex-col overflow-hidden rounded-t-3xl border border-line bg-card shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="wallet-dialog-title" className="font-mono text-xs tracking-[0.25em] text-text uppercase">
            <span className="text-mint">●</span> Connect wallet
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="cursor-pointer p-1 text-dim transition-colors hover:text-mint"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="px-5 pt-4 font-mono text-[11px] leading-relaxed text-muted">
          Any EVM wallet that can add a custom network works on {chain.name}. Connecting only shares your address;
          signatures and swaps are asked for separately.
        </p>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-2">
          {installed.length ? (
            <>
              <p className={heading}>Detected in this browser</p>
              <ul className="flex flex-col gap-2">
                {installed.map((wallet) => (
                  <li key={wallet.rdns}>
                    <button
                      type="button"
                      disabled={connecting || Boolean(wallet.unsupported)}
                      onClick={() => pick(wallet)}
                      className={`${row} cursor-pointer transition-colors enabled:hover:border-mint/50 enabled:hover:bg-card-2 disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <WalletIcon src={wallet.icon || catalogIcon(wallet.rdns)} />
                      <span className="min-w-0 flex-1">
                        <span className="block">{wallet.name}</span>
                        <span className="block text-[10px] text-dim">
                          {wallet.unsupported ? `Not supported · ${wallet.unsupported}` : "Installed"}
                        </span>
                      </span>
                      {pending === wallet.rdns ? (
                        <span className="text-[10px] tracking-widest text-dim uppercase">Check wallet</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <p className={`${heading} pt-4`}>Mobile and other wallets</p>
          {walletConnect ? (
            <button
              type="button"
              disabled={connecting}
              onClick={() => pick(walletConnect)}
              className={`${row} cursor-pointer transition-colors enabled:hover:border-mint/50 enabled:hover:bg-card-2 disabled:opacity-50`}
              data-testid="wallet-walletconnect"
            >
              <WalletIcon src="/wallets/walletconnect.webp" />
              <span className="min-w-0 flex-1">
                <span className="block">WalletConnect</span>
                <span className="block text-[10px] text-dim">Scan a QR code with a mobile wallet</span>
              </span>
              {pending === WALLETCONNECT_RDNS ? (
                <span className="text-[10px] tracking-widest text-dim uppercase">Opening</span>
              ) : null}
            </button>
          ) : (
            <div className={`${row} opacity-50`} data-testid="wallet-walletconnect">
              <WalletIcon src="/wallets/walletconnect.webp" />
              <span className="min-w-0 flex-1">
                <span className="block">WalletConnect</span>
                <span className="block text-[10px] text-dim">Not configured on this site yet</span>
              </span>
            </div>
          )}

          {more.length ? (
            <>
              <p className={`${heading} pt-4`}>
                {mobile ? "Open this site in a wallet app" : `Not installed · supports ${chain.name}`}
              </p>
              <ul className="flex flex-col gap-2">
                {more.map((w) => {
                  const href = mobile && w.deepLink ? w.deepLink(here) : w.install;
                  const label = mobile && w.deepLink ? "Open" : "Install";
                  return (
                    <li key={w.id}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className={`${row} transition-colors hover:border-mint/50 hover:bg-card-2`}
                      >
                        <WalletIcon src={`/wallets/${w.id}.webp`} />
                        <span className="min-w-0 flex-1">{w.name}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] tracking-widest text-mint uppercase">
                          {label} <ExternalLink className="size-3" />
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </div>

        {error ? (
          <p className="flex items-start gap-2 border-t border-line px-5 py-3 font-mono text-[11px] leading-relaxed text-red">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : null}

        <p className="border-t border-line px-5 py-3 font-mono text-[10px] tracking-[0.15em] text-dim uppercase">
          {chain.name} · chain id {chain.id} · added to your wallet on connect
        </p>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/* Navbar control                                                      */
/* ------------------------------------------------------------------ */

export function NavWallet({ compact = false }: { compact?: boolean }) {
  const { address } = useWallet();
  const { open } = useWalletModal();
  if (address) return <AccountMenu compact={compact} />;
  return (
    <button
      type="button"
      onClick={open}
      className={`btn btn-mint whitespace-nowrap ${compact ? "h-10 px-4 text-[13px]" : "h-11 px-5 text-sm"}`}
    >
      {compact ? "Connect" : "Connect wallet"} <span aria-hidden="true">→</span>
    </button>
  );
}

function AccountMenu({ compact }: { compact: boolean }) {
  const {
    address,
    walletName,
    chainId,
    balance,
    onRobinhoodChain,
    switchNetwork,
    switching,
    disconnect,
    error,
  } = useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [place, setPlace] = useState<{ top: number; left: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const WIDTH = 272;
    const position = () => {
      const rect = root.current?.getBoundingClientRect();
      if (!rect) return;
      const left = Math.max(8, Math.min(rect.right - WIDTH, window.innerWidth - WIDTH - 8));
      setPlace({ top: rect.bottom + 8, left });
    };
    position();
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!root.current?.contains(target) && !menu.current?.contains(target)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", position, true);
    window.addEventListener("resize", position);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", position, true);
      window.removeEventListener("resize", position);
    };
  }, [open]);

  if (!address) return null;
  const wrongNetwork = chainId !== null && !onRobinhoodChain;

  return (
    <div ref={root} className="flex items-center gap-2">
      {wrongNetwork ? (
        <button
          type="button"
          onClick={switchNetwork}
          disabled={switching}
          title={`Wallet is on chain ${chainId}. Switch to ${chain.name}.`}
          className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-red/60 bg-[#1a0f0c] px-3 font-mono text-[10px] tracking-[0.15em] text-red uppercase transition-colors hover:bg-[#2a1410] disabled:opacity-60"
        >
          <TriangleAlert className="size-3.5" />
          {switching ? "Confirm…" : compact ? `Chain ${chainId}` : `Wrong network · ${chainId}`}
        </button>
      ) : null}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-mint/40 bg-card px-3 font-mono text-[11px] text-text transition-colors hover:border-mint"
      >
        <span className={`size-1.5 rounded-full ${onRobinhoodChain ? "bg-green" : "bg-red"}`} />
        <span>{shortAddress(address, compact ? 4 : 6, 4)}</span>
        {!compact && balance !== null ? (
          <span className="hidden text-mint lg:inline">{balance} ETH</span>
        ) : null}
        <ChevronDown className="size-3 text-dim" />
      </button>

      {open && place
        ? createPortal(
            <div
              ref={menu}
              role="menu"
              style={{ position: "fixed", top: place.top, left: place.left }}
              className="z-[80] w-[272px] overflow-hidden rounded-2xl border border-line bg-card font-mono shadow-2xl"
            >
              <div className="border-b border-line px-4 py-3">
                <p className="text-[10px] tracking-[0.2em] text-dim uppercase">{walletName ?? "Wallet"}</p>
                <p className="mt-1 text-xs text-text">{shortAddress(address, 10, 8)}</p>
                <p className="mt-2 text-sm text-mint">
                  {balance === null ? "…" : `${balance} ${chain.nativeSymbol}`}
                </p>
                <p className={`mt-1 text-[10px] tracking-wider ${wrongNetwork ? "text-red" : "text-dim"}`}>
                  {chainId === null
                    ? "Reading network…"
                    : onRobinhoodChain
                      ? `On ${chain.name}`
                      : `On chain ${chainId}, not ${chain.name}`}
                </p>
              </div>

              {wrongNetwork ? (
                <div className="border-b border-line p-2">
                  <button
                    type="button"
                    role="menuitem"
                    disabled={switching}
                    onClick={switchNetwork}
                    className="btn btn-mint w-full justify-center px-3 py-2 text-[10px] disabled:opacity-60"
                  >
                    {switching ? "Confirm in wallet…" : `Switch to ${chain.name}`}
                  </button>
                  {error ? <p className="mt-2 px-1 text-[10px] leading-relaxed text-red">{error}</p> : null}
                </div>
              ) : null}

              <div className="flex flex-col p-1.5 text-[11px]">
                <button
                  type="button"
                  role="menuitem"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(address);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1400);
                    } catch {
                      // Clipboard refused; the address above stays readable.
                    }
                  }}
                  className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2 text-left text-muted transition-colors hover:bg-card-2 hover:text-text"
                >
                  {copied ? <Check className="size-3.5 text-mint" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy address"}
                </button>
                <Link
                  role="menuitem"
                  href="/chat"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-muted transition-colors hover:bg-card-2 hover:text-text"
                >
                  <MessageCircle className="size-3.5" />
                  Open {BRAND.symbol} chat
                </Link>
                <Link
                  role="menuitem"
                  href="/swap"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-muted transition-colors hover:bg-card-2 hover:text-text"
                >
                  <ArrowLeftRight className="size-3.5" />
                  Open swap
                </Link>
                <a
                  role="menuitem"
                  href={explorerAddress(address)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-2.5 py-2 text-muted transition-colors hover:bg-card-2 hover:text-text"
                >
                  <ExternalLink className="size-3.5" />
                  View on explorer
                </a>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    disconnect();
                  }}
                  className="flex cursor-pointer items-center gap-2.5 px-2.5 py-2 text-left text-red transition-colors hover:bg-red/10"
                >
                  <LogOut className="size-3.5" />
                  Disconnect
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Large call-to-action ("Connect wallet")                          */
/* ------------------------------------------------------------------ */

export function AccessButton({ className = "" }: { className?: string }) {
  const { address, onRobinhoodChain, chainId, switchNetwork, switching } = useWallet();
  const { open } = useWalletModal();

  if (address && chainId !== null && !onRobinhoodChain) {
    return (
      <button type="button" onClick={switchNetwork} disabled={switching} className={`btn btn-mint ${className}`}>
        {switching ? "Confirm in wallet…" : `Switch to ${chain.name}`}
        <span aria-hidden="true">→</span>
      </button>
    );
  }
  if (address) {
    return (
      <Link href="/swap" className={`btn btn-mint ${className}`}>
        <span>
          Wallet linked · <span className="normal-case">{shortAddress(address, 4, 4)}</span>
        </span>
        <span aria-hidden="true">→</span>
      </Link>
    );
  }
  return (
    <button type="button" onClick={open} className={`btn btn-mint ${className}`}>
      Connect wallet
      <span aria-hidden="true">→</span>
    </button>
  );
}
