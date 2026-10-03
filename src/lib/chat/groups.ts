// Groups of the $NEARDUCK chat. Shared by the server (which enforces them)
// and the page (which lists them). Add a group here and it appears everywhere.

export type ChatGroup = {
  id: string;
  name: string;
  about: string;
  /** Only wallets holding the token can read or post. Checked on the server. */
  holdersOnly?: boolean;
};

export const GROUPS: ChatGroup[] = [
  { id: "pond", name: "The Pond", about: "General chat for every duck with a wallet." },
  { id: "chart", name: "Price & Chart", about: "Candles, curve progress and the graduation watch." },
  { id: "memes", name: "Meme Lab", about: "Drop memes, roast memes, request memes." },
  { id: "holders", name: "Holders' Nest", about: "Only wallets holding the token get in.", holdersOnly: true },
];

export const findGroup = (id: unknown) => GROUPS.find((g) => g.id === id) ?? null;

export const MAX_LENGTH = 280;
