import type { Metadata } from "next";
import { SwapScreen } from "@/components/swap/SwapScreen";
import { BRAND, CHAIN } from "@/config/brand";

export const metadata: Metadata = {
  title: "Enter the pond",
  description: `Connect a wallet to ${CHAIN.name} and get ready for ${BRAND.symbol}. Swaps open at launch.`,
};

export default function SwapPage() {
  return <SwapScreen />;
}
