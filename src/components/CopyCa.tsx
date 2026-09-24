"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { BRAND, CHAIN, shortAddress } from "@/config/brand";

export function useCopyCa() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
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
  return { copied, copy };
}

/** Compact pill for the navbar: "CA", the short address and a copy icon. */
export function CopyCaPill({ className = "" }: { className?: string }) {
  const { copied, copy } = useCopyCa();
  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy ${BRAND.ca}`}
      aria-label="Copy contract address"
      data-testid="ca-pill"
      className={`flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-line-2 bg-black/30 px-3 font-mono text-[11px] text-muted transition-colors hover:border-mint/50 hover:text-text ${className}`}
    >
      <span className="text-[9px] tracking-[0.2em] text-mint">CA</span>
      <span className={copied ? "text-mint" : ""}>{copied ? "Copied" : shortAddress(BRAND.ca, 5, 4)}</span>
      {copied ? <Check className="size-3.5 text-mint" /> : <Copy className="size-3.5 text-dim" />}
    </button>
  );
}

/** Contract block: label, full address and a mint "Copy CA" button. */
export function CopyCaBlock({ className = "" }: { className?: string }) {
  const { copied, copy } = useCopyCa();
  return (
    <div className={`rounded-2xl border border-mint/30 bg-black/40 p-4 ${className}`}>
      <p className="font-mono text-[10px] tracking-[0.16em] text-dim uppercase">
        Contract · {CHAIN.name}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <code className="min-w-0 flex-1 font-mono text-[13px] leading-snug break-all text-mint">{BRAND.ca}</code>
        <button type="button" onClick={copy} className="btn btn-mint h-10 px-4 text-sm" data-testid="ca-copy">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy CA"}
        </button>
      </div>
    </div>
  );
}
