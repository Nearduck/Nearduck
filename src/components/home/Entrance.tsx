import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BRAND, CHAIN, TOKEN } from "@/config/brand";
import { EntranceArt } from "@/components/art/Scenes";
import { CopyCaBlock } from "@/components/CopyCa";
import { DepthTag } from "@/components/home/ui";

export function Entrance() {
  const tiles = [
    { title: "Enter the pond", sub: "wallet · swap panel", href: "/swap", internal: true },
    { title: "Blockscout", sub: TOKEN.isLive ? "the contract" : `${CHAIN.name} explorer`, href: TOKEN.explorerUrl ?? CHAIN.explorer },
    { title: "Chart", sub: TOKEN.chartUrl ? "live price" : "opens at launch", href: TOKEN.chartUrl },
    { title: BRAND.xHandle, sub: "the duck line", href: BRAND.x },
    { title: "GitHub", sub: "the source", href: BRAND.github },
    { title: "Meme Stash", sub: "save from the pond", href: "/memes", internal: true },
  ];
  const cls = "tile group flex items-center justify-between gap-3 px-4 py-4 transition-colors hover:border-mint/40";

  return (
    <section id="entrance" className="relative mx-auto mt-6 max-w-[1180px] scroll-mt-20 px-4 sm:px-6 lg:px-10">
      <div className="panel relative grid grid-cols-1 overflow-hidden lg:grid-cols-[1fr_0.9fr]">
        <div className="absolute top-5 left-1/2 z-10 -translate-x-1/2">
          <DepthTag depth={63} label="The entrance" />
        </div>
        <div className="relative order-1 h-[360px] lg:order-2 lg:h-auto">
          <EntranceArt className="absolute inset-0 size-full" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_55%,rgba(13,11,9,0.95))] lg:bg-[linear-gradient(270deg,transparent_60%,rgba(13,11,9,0.98))]" />
        </div>
        <div className="order-2 min-w-0 px-5 pt-8 pb-12 sm:px-10 lg:order-1 lg:pt-24 lg:pl-16">
          <p className="eyebrow">Ways in</p>
          <h2 className="h-display mt-4 text-[44px] sm:text-[66px]">Never one pond.</h2>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
            Hold {BRAND.symbol} and you are sitting with the duck. Swaps open at launch; until then, set up your wallet
            on {CHAIN.name} and keep the address below close.
          </p>
          <CopyCaBlock className="mt-6 max-w-md" />
          <ul className="mt-4 grid max-w-md grid-cols-1 gap-2.5 sm:grid-cols-2">
            {tiles.map((t) => (
              <li key={t.title}>
                {!t.href ? (
                  <span className={`${cls} cursor-default opacity-60`}>
                    <span>
                      <span className="block font-bold">{t.title}</span>
                      <span className="block text-xs text-dim">{t.sub}</span>
                    </span>
                  </span>
                ) : t.internal ? (
                  <Link href={t.href} className={cls}>
                    <span>
                      <span className="block font-bold">{t.title}</span>
                      <span className="block text-xs text-dim">{t.sub}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-dim group-hover:text-mint" />
                  </Link>
                ) : (
                  <a href={t.href} target="_blank" rel="noreferrer" className={cls}>
                    <span>
                      <span className="block font-bold">{t.title}</span>
                      <span className="block text-xs text-dim">{t.sub}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-dim group-hover:text-mint" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
