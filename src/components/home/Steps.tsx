import Link from "next/link";
import { BRAND, CHAIN } from "@/config/brand";

const STEPS = [
  { n: "01", title: "Set up a wallet.", body: `MetaMask, Rabby or any EVM wallet. The pond page adds ${CHAIN.name} for you in one click.` },
  { n: "02", title: "Bring a little ETH.", body: `Gas on ${CHAIN.name} is paid in ETH. A small amount covers many moves.` },
  { n: "03", title: "Sit near the duck.", body: `Pick up ${BRAND.symbol} once the contract is live. Check the address on this page before you do.` },
];

export function Steps() {
  return (
    <section id="start" className="relative mx-auto mt-24 max-w-[1080px] px-4 sm:px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-[44px] border border-line bg-[rgba(13,11,9,0.88)] bg-[radial-gradient(circle_at_82%_0,rgba(0,236,151,0.1),transparent_36%)] px-6 py-10 sm:px-14 sm:py-14">
        <p className="font-mono text-[11px] tracking-[0.16em] text-dim uppercase">New to {BRAND.name}?</p>
        <h2 id="start-heading" className="h-display mt-4 text-[36px] sm:text-[56px]">Three steps to the armchair.</h2>
        <ol className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="tile flex gap-3 p-4">
              <span className="font-mono text-xs text-mint">{s.n}</span>
              <div>
                <p className="font-bold">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/swap" className="btn btn-mint h-12 px-6 text-[15px]">Get {BRAND.symbol}</Link>
          <a href="#calculator" className="btn btn-ghost h-12 px-6 text-[15px]">Check the calculator</a>
        </div>
      </div>
    </section>
  );
}
