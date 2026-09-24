import { CHAIN } from "@/config/brand";
import { FlockArt } from "@/components/art/Scenes";
import { DepthTag } from "@/components/home/ui";

const WALLETS = [
  { tag: "MM", name: "MetaMask", sub: "extension · mobile app" },
  { tag: "RB", name: "Rabby", sub: "multi-chain · desktop" },
  { tag: "CB", name: "Coinbase Wallet", sub: "extension · app" },
  { tag: "OKX", name: "OKX Wallet", sub: "extension · app" },
  { tag: "EVM", name: "Any EVM wallet", sub: `custom network · chain ${CHAIN.id}` },
];

const IDEAS = [
  {
    title: "Many feet, one duck.",
    body: "Under the water a duck's feet never stop. Nodes, sequencers and validators do the paddling so the surface can stay flat.",
  },
  {
    title: "Quiet surface, no panic.",
    body: "Red candles, green candles, the duck stays in the chair. The meme is patience, not predictions.",
  },
  {
    title: "Flock first, no king.",
    body: "Ducks fly in a V and take turns at the front. Holders, meme makers and builders are the flock; the mascot just keeps the seat warm.",
  },
];

export function Flock() {
  return (
    <section id="flock" className="relative mx-auto mt-6 max-w-[1180px] scroll-mt-20 px-4 sm:px-6 lg:px-10">
      <div className="panel relative grid grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="absolute top-5 left-1/2 z-10 -translate-x-1/2">
          <DepthTag depth={34} label="The flock" />
        </div>
        <div className="relative h-[460px] lg:h-auto">
          <FlockArt className="absolute inset-0 size-full" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_60%,rgba(13,11,9,0.95))] lg:bg-[linear-gradient(90deg,transparent_65%,rgba(13,11,9,0.98))]" />
        </div>
        <div className="min-w-0 px-5 pt-8 pb-12 sm:px-10 lg:pt-24">
          <p className="eyebrow">Why ducks</p>
          <h2 className="h-display mt-4 text-[44px] sm:text-[66px]">Calm on top, busy underneath.</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">
            A duck on a pond looks like it is doing nothing. Below the waterline it is working the whole time. That is
            the deal here: a calm surface for holders, and a fast chain doing the work beneath it.
          </p>
          <ul className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {WALLETS.map((w) => (
              <li key={w.name} className="tile flex items-center gap-3 px-3.5 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-mint/40 bg-black/40 font-mono text-[10px] text-mint">
                  {w.tag}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{w.name}</span>
                  <span className="block text-xs text-dim">{w.sub}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2.5">
            {IDEAS.map((i) => (
              <div key={i.title} className="tile px-4 py-3.5">
                <h3 className="font-display text-xl">{i.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{i.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 inline-block -rotate-3 rounded-md border-2 border-mint px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-mint uppercase">
            Lookout · water calm
          </p>
        </div>
      </div>
    </section>
  );
}
