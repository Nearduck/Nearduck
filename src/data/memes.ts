export type MemeCategory = "degen" | "chill" | "price" | "vibes";
export type MemeScene = "sky" | "night" | "pump" | "dump" | "sunset" | "deep" | "desk";

export type Meme = {
  id: string;
  title: string;
  category: MemeCategory;
  scene: MemeScene;
  top: string;
  bottom: string;
};

export const CATEGORIES: { id: MemeCategory | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "" },
  { id: "degen", label: "Degen", emoji: "🦆" },
  { id: "chill", label: "Chill", emoji: "🪑" },
  { id: "price", label: "Price", emoji: "📈" },
  { id: "vibes", label: "Vibes", emoji: "✨" },
];

export const EMOJI: Record<MemeCategory, string> = { degen: "🦆", chill: "🪑", price: "📈", vibes: "✨" };

/** Original memes drawn on the fly from the mascot plus hand-built scenes. */
export const MEMES: Meme[] = [
  { id: "gm-armchair", title: "gm from the armchair", category: "chill", scene: "sky", top: "gm from the armchair", bottom: "the chart can come to me" },
  { id: "i-am-the-dip", title: "I am the dip", category: "degen", scene: "deep", top: "they said buy the dip", bottom: "i am the dip. i live here." },
  { id: "chain-4663", title: "Chain 4663", category: "vibes", scene: "night", top: "4663", bottom: "the only chain id i know by heart" },
  { id: "red-candle-nap", title: "Red candle nap", category: "price", scene: "dump", top: "red candle?", bottom: "sir, this is a nap" },
  { id: "green-candle", title: "Green candle", category: "price", scene: "pump", top: "green candle?", bottom: "still not getting up" },
  { id: "strategy", title: "The strategy", category: "chill", scene: "sunset", top: "portfolio strategy:", bottom: "sit. wait. quack." },
  { id: "gas-talk", title: "Gas talk", category: "degen", scene: "desk", top: "me explaining gas", bottom: "to a duck that pays in ETH" },
  { id: "wen-chair", title: "Wen armchair", category: "vibes", scene: "sky", top: "wen lambo", bottom: "wen bigger armchair" },
  { id: "diamond-boots", title: "Diamond boots", category: "degen", scene: "deep", top: "diamond hands?", bottom: "green boots. never selling." },
  { id: "flock-3am", title: "The flock at 3am", category: "vibes", scene: "night", top: "the flock at 3am", bottom: "watching blocks, not charts" },
  { id: "paper-hands", title: "Paper hands", category: "price", scene: "sunset", top: "paper hands", bottom: "ducks don't have hands" },
  { id: "near-the-top", title: "Near the top", category: "chill", scene: "pump", top: "near the water", bottom: "near the top, eventually" },
];

export const MEME_OF_THE_WEEK = MEMES[0];
