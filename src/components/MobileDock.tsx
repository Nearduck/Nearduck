"use client";

import Link from "next/link";
import { useCopyCa } from "@/components/CopyCa";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useWalletModal } from "@/components/wallet/WalletButton";
import { shortAddress } from "@/config/brand";

/** Floating action bar on phones, as in the reference layout. */
export function MobileDock() {
  const { copied, copy } = useCopyCa();
  const { address } = useWallet();
  const { open } = useWalletModal();
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-1 rounded-full border border-line-2 bg-[#0d0a07]/95 p-1.5 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.9)] backdrop-blur">
        <Link href="/swap" className="btn btn-mint h-9 px-3.5 font-mono text-[10px] tracking-[0.12em] uppercase">
          Buy
        </Link>
        <Link href="/#calculator" className="px-1.5 font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
          Calc
        </Link>
        <Link href="/memes" className="px-1.5 font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
          Memes
        </Link>
        <button type="button" onClick={copy} className="cursor-pointer px-1.5 font-mono text-[10px] tracking-[0.1em] text-muted uppercase" data-testid="dock-copy">
          {copied ? <span className="text-mint">Copied</span> : "Copy CA"}
        </button>
        <button type="button" onClick={open} className="btn btn-mint h-9 px-3.5 font-mono text-[10px] tracking-[0.12em] uppercase">
          {address ? shortAddress(address, 4, 3) : "Enter"}
        </button>
      </div>
    </div>
  );
}
