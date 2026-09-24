"use client";

import { useEffect, useState } from "react";
import { MAX_DEPTH, STOPS } from "@/components/site";

/**
 * Maps the scroll position to a pond depth: 0 m at the surface, then each
 * section's own depth when its top reaches the upper third of the screen,
 * interpolated in between.
 */
export function useDepth() {
  const [state, setState] = useState<{ depth: number; stop: string | null }>({ depth: 0, stop: null });

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.scrollY + window.innerHeight / 3;
      const points = [{ id: null as string | null, depth: 0, top: window.innerHeight / 3 }];
      for (const s of STOPS) {
        const el = document.getElementById(s.id);
        if (el) points.push({ id: s.id, depth: s.depth, top: el.getBoundingClientRect().top + window.scrollY });
      }
      const docEnd = document.documentElement.scrollHeight;
      points.push({ id: points[points.length - 1].id, depth: MAX_DEPTH, top: docEnd });
      let depth = 0;
      let stop: string | null = null;
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        if (line >= a.top && line < b.top) {
          const t = (line - a.top) / Math.max(1, b.top - a.top);
          depth = a.depth + (b.depth - a.depth) * t;
          stop = a.id;
          break;
        }
        if (line >= b.top) {
          depth = b.depth;
          stop = b.id;
        }
      }
      setState({ depth, stop });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
