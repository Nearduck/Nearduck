import type { Metadata } from "next";
import { MemeStash } from "@/components/memes/MemeStash";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Meme Stash",
  description: `Every ${BRAND.symbol} meme in one place. Free to save, phone friendly.`,
};

export default function MemesPage() {
  return <MemeStash />;
}
