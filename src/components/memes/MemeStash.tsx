"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Download, Search, X } from "lucide-react";
import { BRAND } from "@/config/brand";
import { MarkBadge } from "@/components/Mark";
import { CopyCaPill } from "@/components/CopyCa";
import { MemeArt } from "@/components/art/MemeArt";
import { useWallet } from "@/components/wallet/WalletProvider";
import { NavWallet, useWalletModal } from "@/components/wallet/WalletButton";
import { CATEGORIES, EMOJI, MEMES, type Meme, type MemeCategory } from "@/data/memes";
import { downloadSvgAsPng } from "@/lib/download";

async function saveMeme(meme: Meme, svgId: string, share: boolean) {
  const out = await downloadSvgAsPng(svgId, `nearduck-${meme.id}.png`);
  if (share) {
    const file = new File([out.blob], `nearduck-${meme.id}.png`, { type: "image/png" });
    const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: meme.title });
        return;
      } catch {
        // Share sheet dismissed; fall back to a plain download.
      }
    }
  }
  out.save();
}

export function MemeStash() {
  const [filter, setFilter] = useState<MemeCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [openMeme, setOpenMeme] = useState<Meme | null>(null);
  const [failedId, setFailedId] = useState<string | null>(null);
  const touch = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(pointer: coarse)").matches,
    () => false,
  );
  const { address } = useWallet();
  const { open } = useWalletModal();

  const list = useMemo(
    () =>
      MEMES.filter(
        (m) =>
          (filter === "all" || m.category === filter) &&
          `${m.title} ${m.top} ${m.bottom}`.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [filter, query],
  );

  return (
    <div className="min-h-dvh bg-[#111214] font-inter text-white">
      <nav className="sticky top-0 z-30 border-b border-white/5 bg-[#0a0b0c]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-2 px-3 sm:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <MarkBadge size={30} />
            <span className="hidden text-sm font-black tracking-[0.06em] sm:inline">{BRAND.ticker}</span>
          </Link>
          <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-white/60 uppercase md:flex">
            <span className="size-1.5 rounded-full bg-[#00e676]" /> Meme stash · active
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <CopyCaPill className="h-8 border-white/10 bg-white/5" />
            <Link href="/" className="hidden text-[13px] font-semibold text-white/45 hover:text-white sm:inline">
              Main site
            </Link>
            {address ? (
              <NavWallet compact />
            ) : (
              <button
                type="button"
                onClick={open}
                className="h-8 cursor-pointer rounded-lg border border-white/15 px-3 text-xs font-bold tracking-[0.06em] text-white/60 uppercase hover:text-white"
                data-testid="pond-access"
              >
                Pond access
              </button>
            )}
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden border-b border-white/5 bg-[#0c0d0f]">
        <div className="pointer-events-none absolute -top-20 right-0 size-[520px] rounded-full bg-[radial-gradient(circle,rgba(0,230,118,0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1100px] px-4 py-14 sm:px-6 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-white/60 uppercase">
            <span className="size-1.5 rounded-full bg-[#00e676]" /> Pond meme drop · free to save
          </p>
          <h1 className="mt-5 text-[52px] leading-[0.95] font-black tracking-[-0.03em] sm:text-[80px]">
            The Flock&apos;s
            <br />
            <span className="text-[#00e676]">Meme Stash.</span>
          </h1>
          <p className="mt-5 max-w-md text-white/55">
            Every duck meme the flock made, kept in one pond. Tap save, pick your phone, and spread the calm.
          </p>
          <div className="mt-7 flex gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3">
              <p className="text-2xl font-black text-[#00e676]">{MEMES.length}</p>
              <p className="text-[10px] font-bold tracking-[0.1em] text-white/45 uppercase">Memes dropped</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3">
              <p className="text-2xl font-black text-[#00e676]">Ready</p>
              <p className="text-[10px] font-bold tracking-[0.1em] text-white/45 uppercase">Phone friendly</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1060px] px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[#18191c] px-3">
            <Search className="size-4 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the stash..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={`h-11 cursor-pointer rounded-[10px] border px-4 text-[13px] font-semibold ${
                  filter === c.id ? "border-[#00e676] bg-[#00e676]/10 text-[#00e676]" : "border-white/10 bg-[#18191c] text-white/45 hover:text-white"
                }`}
              >
                {c.emoji ? `${c.emoji} ` : ""}
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#00e676]/30 bg-[#00e676]/5 p-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#00e676] text-black">
            <Download className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold">{touch ? "Saving on a phone" : "Saving on a computer"}</p>
            <p className="text-xs text-white/55">
              {touch
                ? "Tap a meme, then Save to phone. The share sheet opens so you can keep it in your photos."
                : "Press Download under any picture. The full-size file goes straight to your Downloads folder."}
            </p>
          </div>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="meme-grid">
          {list.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#18191c]">
              <button type="button" onClick={() => setOpenMeme(m)} className="block w-full cursor-zoom-in bg-black" aria-label={`Open ${m.title}`}>
                <MemeArt meme={m} className="aspect-[4/5] w-full" />
              </button>
              <div className="flex items-center justify-between gap-2 px-3 py-3">
                <span className="min-w-0 truncate text-[13px] font-bold">
                  {EMOJI[m.category]} {m.title}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFailedId(null);
                    saveMeme(m, `meme-${m.id}`, false).catch(() => setFailedId(m.id));
                  }}
                  className="h-8 shrink-0 cursor-pointer rounded-[7px] bg-[#00e676] px-3 text-xs font-black text-black uppercase hover:brightness-110"
                >
                  {failedId === m.id ? "Retry" : "↓ Download"}
                </button>
              </div>
              {failedId === m.id ? (
                <p role="alert" className="px-3 pb-3 text-xs text-[#ff6b6b]">
                  This browser could not draw the image. Press and hold the picture to save it instead.
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        {list.length === 0 ? <p className="mt-10 text-center text-white/45">No memes match that. The pond is quiet.</p> : null}
        <p className="mt-6 text-xs text-white/40">
          On iPhone, Save opens the share sheet; choose &ldquo;Save Image&rdquo;. You can also press and hold any full-size picture.
        </p>
      </main>

      <footer className="border-t border-white/5 px-4 py-6 sm:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 text-[13px] text-white/50">
          <span>
            🦆 Nearduck Meme Stash —{" "}
            <Link href="/" className="font-bold text-[#00e676]">
              {BRAND.domain}
            </Link>
          </span>
          <span>{BRAND.symbol} sits near the water</span>
        </div>
      </footer>

      {openMeme ? <MemeModal meme={openMeme} onClose={() => setOpenMeme(null)} /> : null}
    </div>
  );
}

function MemeModal({ meme, onClose }: { meme: Meme; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={meme.title} className="fixed inset-0 z-[70] flex items-center justify-center p-4 font-inter">
      <div className="absolute inset-0 bg-black/85" onClick={onClose} />
      <div className="relative w-full max-w-[440px]">
        <MemeArt meme={meme} suffix="-modal" className="w-full rounded-2xl" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white"
        >
          <X className="size-4" />
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setFailed(false);
            try {
              await saveMeme(meme, `meme-${meme.id}-modal`, true);
            } catch {
              setFailed(true);
            } finally {
              setBusy(false);
            }
          }}
          className="absolute right-3 bottom-3 h-9 cursor-pointer rounded-[7px] bg-[#00e676] px-4 text-xs font-black text-black uppercase"
        >
          {busy ? "Saving…" : failed ? "Failed · retry" : "↓ Save to phone"}
        </button>
      </div>
    </div>,
    document.body,
  );
}
