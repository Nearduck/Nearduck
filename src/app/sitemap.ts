import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/swap", "/memes", "/chat"].map((path) => ({ url: `${BRAND.url}${path}`, lastModified: new Date("2026-09-24") }));
}
