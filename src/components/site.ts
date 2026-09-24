import { BRAND, TOKEN } from "@/config/brand";

/** Depth stops shown in the header meter and the side rail. */
export const STOPS = [
  { id: "nest", label: "The nest", depth: 2 },
  { id: "calculator", label: "The calculator", depth: 22 },
  { id: "flock", label: "The flock", depth: 34 },
  { id: "map", label: "The map", depth: 49 },
  { id: "entrance", label: "The entrance", depth: 63 },
] as const;

export const MAX_DEPTH = 70;

export const NAV = [
  { href: "/#nest", label: "The nest" },
  { href: "/#calculator", label: "Calculator" },
  { href: "/#flock", label: "The flock" },
  { href: "/#map", label: "The map" },
  { href: "/#entrance", label: "Ways in" },
  { href: "/memes", label: "Memes" },
] as const;

export const LINKS = {
  x: BRAND.x,
  github: BRAND.github,
  chart: () => TOKEN.chartUrl,
  explorer: () => TOKEN.explorerUrl,
};
