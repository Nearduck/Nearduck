import Link from "next/link";
import { BRAND } from "@/config/brand";
import { MemeArt } from "@/components/art/MemeArt";
import { MEME_OF_THE_WEEK } from "@/data/memes";

export function Dispatch() {
  return (
    <section className="relative z-20 mx-auto -mt-[150px] grid max-w-[1180px] grid-cols-1 gap-4 px-4 sm:px-6 md:-mt-[210px] lg:grid-cols-[1.65fr_1fr] lg:px-10">
      <div className="flex min-w-0 flex-col justify-between rounded-3xl border border-line bg-[#100c09]/95 p-7 shadow-2xl sm:p-10">
        <div>
          <p className="eyebrow">Pond dispatch</p>
          <h2 className="h-display mt-5 text-[36px] leading-[0.95] sm:text-5xl">The duck is still sitting.</h2>
          <p className="mt-4 max-w-xl text-muted">
            The armchair is set, the meme stash is open and the calculator works. The contract lands soon. Keep this
            pond bookmarked; the next word from the duck shows up here first.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <a href={BRAND.x} target="_blank" rel="noreferrer" className="font-mono text-xs tracking-[0.16em] text-mint uppercase hover:underline">
            Follow the duck ↗
          </a>
          <span className="font-mono text-[10px] tracking-[0.16em] text-dim uppercase">Updated September 24, 2026</span>
        </div>
      </div>
      <Link href="/memes" className="group relative block min-h-[300px] overflow-hidden rounded-3xl border border-line bg-[#0f0b08]">
        <MemeArt meme={MEME_OF_THE_WEEK} suffix="-week" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[linear-gradient(transparent,rgba(0,0,0,0.85))] px-5 pt-10 pb-4">
          <span className="font-mono text-[10px] tracking-[0.16em] text-mint uppercase">Meme of the week</span>
          <span className="font-mono text-[10px] tracking-[0.16em] text-text uppercase">Open the stash ↗</span>
        </div>
      </Link>
    </section>
  );
}
