import Link from "next/link";
import { BRAND, CHAIN, TOKEN } from "@/config/brand";
import { CopyCaBlock } from "@/components/CopyCa";

export function SiteFooter() {
  const explorer = TOKEN.explorerUrl ?? CHAIN.explorer;
  return (
    <footer className="relative bg-[linear-gradient(transparent,#000_60%)] px-4 pt-16 pb-28 text-center sm:px-6 md:pb-12">
      <p className="font-display text-base text-mint">
        {BRAND.symbol} · the laziest duck on {CHAIN.name} ·{" "}
        <a href={BRAND.x} target="_blank" rel="noreferrer" className="underline underline-offset-4">
          {BRAND.xHandle}
        </a>
      </p>
      <div className="mx-auto mt-6 max-w-xl text-left">
        <CopyCaBlock />
      </div>
      <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-muted" aria-label="Footer">
        <Link href="/swap" className="hover:text-text">Enter the pond</Link>
        <Link href="/#calculator" className="hover:text-text">Calculator</Link>
        <Link href="/memes" className="hover:text-text">Memes</Link>
        <a href={BRAND.x} target="_blank" rel="noreferrer" className="hover:text-text">X</a>
        <a href={BRAND.github} target="_blank" rel="noreferrer" className="hover:text-text">GitHub</a>
        <a href={explorer} target="_blank" rel="noreferrer" className="hover:text-text">Blockscout</a>
      </nav>
      <p className="mx-auto mt-6 max-w-2xl text-xs leading-relaxed text-dim">
        Community meme token with no promised returns. Not affiliated with Robinhood Markets. Not financial
        advice. Swaps settle on {CHAIN.name}; prices, fees and timing are set by the market, not by this page.
        DYOR.
      </p>
      <p className="mt-6 font-mono text-[10px] tracking-[0.24em] text-dim/70 uppercase">Duck seated · water calm</p>
    </footer>
  );
}
