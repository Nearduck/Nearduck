"use client";

import Link from "next/link";
import { useCopyCa } from "@/components/CopyCa";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useWalletModal } from "@/components/wallet/WalletButton";
import { shortAddress } from "@/config/brand";

/** Floating action bar on phones, as in the reference layout. */
export function MobileDock() {
  const { copied, copy, live } = useCopyCa();
  const { address } = useWallet();
  const { open } = useWalletModal();
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-1 rounded-full border border-line-2 bg-[#0d0a07]/95 p-1.5 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.9)] backdrop-blur">
        <Link href="/swap" className="btn btn-mint h-9 px-3.5 font-mono text-[10px] tracking-[0.12em] uppercase">
          Buy
        </Link>
        <Link href="/chat" className="px-1.5 font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
          Chat
        </Link>
        <Link href="/memes" className="px-1.5 font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
          Memes
        </Link>
        <button type="button" onClick={copy} disabled={!live} className="cursor-pointer px-1.5 disabled:cursor-default disabled:opacity-50 font-mono text-[10px] tracking-[0.1em] text-muted uppercase" data-testid="dock-copy">
          {!live ? "CA soon" : copied ? <span className="text-mint">Copied</span> : "Copy CA"}
        </button>
        {address ? (
          // Already connected: go to the wallet panel instead of reopening the connect list.
          <Link href="/swap" className="btn btn-mint h-9 px-3.5 font-mono text-[10px] tracking-[0.12em] uppercase">
            {shortAddress(address, 4, 3)}
          </Link>
        ) : (
          <button type="button" onClick={open} className="btn btn-mint h-9 px-3.5 font-mono text-[10px] tracking-[0.12em] uppercase">
            Enter
          </button>
        )}
      </div>
    </div>
  );
}
