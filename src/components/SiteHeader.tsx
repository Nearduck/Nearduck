"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/config/brand";
import { CopyCaPill } from "@/components/CopyCa";
import { MarkBadge } from "@/components/Mark";
import { NAV, STOPS } from "@/components/site";
import { useDepth } from "@/components/useDepth";
import { NavWallet } from "@/components/wallet/WalletButton";

export function SiteHeader() {
  const { depth, stop } = useDepth();
  const [open, setOpen] = useState(false);
  const label = stop ? STOPS.find((s) => s.id === stop)?.label : "Surface";

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, [open]);

  return (
    <header
      id="top"
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-[linear-gradient(rgba(11,8,6,0.92),rgba(11,8,6,0.72))] backdrop-blur-md"
    >
      <div className="flex h-[66px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${BRAND.name} home`}>
          <MarkBadge />
          <span className="hidden font-display text-xl tracking-[0.02em] sm:inline">{BRAND.ticker}</span>
        </Link>

        <div className="flex min-w-0 items-center gap-2 sm:ml-3 sm:gap-3" aria-live="off">
          <span className="hidden font-mono text-[11px] tracking-[0.14em] text-dim md:inline">DEPTH</span>
          <span className="font-mono text-sm whitespace-nowrap text-mint tabular-nums sm:text-base" data-testid="depth">
            {depth < 0.05 ? "0.0" : `−${depth.toFixed(1)}`} m
          </span>
          <span className="hidden rounded-md border border-mint/40 px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-mint uppercase sm:inline">
            {label}
          </span>
        </div>

        <nav className="ml-auto hidden items-center gap-4 min-[1380px]:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-semibold text-muted transition-colors hover:text-text">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 min-[1380px]:ml-4">
          <CopyCaPill />
          <div className="hidden lg:block">
            <NavWallet compact />
          </div>
          <Link href="/swap" className="btn btn-mint hidden h-11 px-5 text-sm md:inline-flex">
            Enter the pond
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-2 text-text min-[1380px]:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-ground/95 px-4 pt-3 pb-5 min-[1380px]:hidden">
          <nav className="grid grid-cols-1 gap-1 sm:grid-cols-2" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-semibold text-muted hover:bg-white/5 hover:text-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <NavWallet />
            <Link href="/swap" onClick={() => setOpen(false)} className="btn btn-mint h-11 px-5 text-sm">
              Enter the pond
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
