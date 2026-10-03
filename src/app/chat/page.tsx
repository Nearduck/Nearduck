import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { ChatApp } from "@/components/chat/ChatApp";

export const metadata: Metadata = {
  title: `${BRAND.symbol} CHAT`,
  description: `Wallet-only group chat for ${BRAND.symbol} on Robinhood Chain. Connect, sign once, and join the groups.`,
};

export default function ChatPage() {
  return <ChatApp />;
}
