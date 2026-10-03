"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { BRAND, CHAIN, TOKEN, shortAddress } from "@/config/brand";

export function useCopyCa() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  // Until the contract is published there is nothing worth copying.
  const live = TOKEN.isLive;
  const copy = async () => {
    if (!live) return;
    try {
      await navigator.clipboard.writeText(BRAND.ca);
    } catch {
      // Older browsers and some embedded views refuse the async clipboard.
      const area = document.createElement("textarea");
      area.value = BRAND.ca;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };
  return { copied, copy, live };
}

/** Compact pill for the navbar: "CA", the short address and a copy icon. */
export function CopyCaPill({ className = "" }: { className?: string }) {
  const { copied, copy, live } = useCopyCa();
  return (
    <button
      type="button"
      onClick={copy}
      disabled={!live}
      title={live ? `Copy ${BRAND.ca}` : "Contract address is published at launch"}
      aria-label="Copy contract address"
      data-testid="ca-pill"
      className={`flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-line-2 bg-black/30 px-3 font-mono text-[11px] text-muted transition-colors enabled:hover:border-mint/50 enabled:hover:text-text disabled:cursor-default ${className}`}
    >
      <span className="text-[9px] tracking-[0.2em] text-mint">CA</span>
      <span className={copied ? "text-mint" : ""}>{!live ? "At launch" : copied ? "Copied" : shortAddress(BRAND.ca, 5, 4)}</span>
      {!live ? null : copied ? <Check className="size-3.5 text-mint" /> : <Copy className="size-3.5 text-dim" />}
    </button>
  );
}

/** Contract block: label, full address and a mint "Copy CA" button. */
export function CopyCaBlock({ className = "" }: { className?: string }) {
  const { copied, copy, live } = useCopyCa();
  return (
    <div className={`rounded-2xl border border-mint/30 bg-black/40 p-4 ${className}`}>
      <p className="font-mono text-[10px] tracking-[0.16em] text-dim uppercase">
        Contract · {CHAIN.name}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <code className="min-w-0 flex-1 font-mono text-[13px] leading-snug break-all text-mint">
          {live ? BRAND.ca : "Published at launch"}
        </code>
        <button type="button" onClick={copy} disabled={!live} className="btn btn-mint h-10 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50" data-testid="ca-copy">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {!live ? "Not live yet" : copied ? "Copied" : "Copy CA"}
        </button>
      </div>
    </div>
  );
}
