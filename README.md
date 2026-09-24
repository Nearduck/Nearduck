# Nearduck

**$NEARDUCK — the laziest duck on Robinhood Chain.**

Website for the Nearduck meme token: a duck in an armchair, parked near the water, waiting for the market to
float by. Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

## Pages

| Route    | What it is |
| -------- | ---------- |
| `/`      | Landing page that "dives" through the pond: hero, dispatch, live chain stats (the nest), three steps, float calculator, the flock, the map, ways in. A depth meter in the header and a side rail follow the scroll. |
| `/swap`  | Wallet panel. Connects any EIP-6963 browser wallet, adds/switches to Robinhood Chain and shows the real ETH balance. Swaps open at launch. Includes a short guided tour. |
| `/memes` | Meme stash: searchable, filterable, every meme downloads as a PNG (share sheet on phones). |
| `/api/eth-price` | ETH/USD from a public exchange feed, cached for 60 seconds. |

## Run locally

```bash
npm install
npm run build
npm run start        # http://localhost:4670
```

`npm run dev` also serves on port 4670. `npm run brand` regenerates the brand images from the source artwork
(see `scripts/make-brand.mjs`; it reads the source artwork from `BRAND_SOURCE_DIR`, default `./brand-source/`, which is not part of this repository).

## Change the contract address

Everything reads the token identity from `src/config/brand.ts`. Replace the value of `CA`:

```ts
const CA = "0x...";   // 0x + 40 hex characters
```

The navbar pill, the footer, the entrance block, the swap panel and every explorer or chart link update from
that one line. Until `CA` is a real address, token-only figures show "at launch".

## Environment variables (all optional)

The site runs on public endpoints with no configuration. To use a private RPC (for example an Alchemy
Robinhood Chain endpoint), set:

| Name | Used by | Format |
| ---- | ------- | ------ |
| `NEXT_PUBLIC_ROBINHOOD_RPC_URL` | Browser reads (blocks, gas, balances) | `https://...` RPC URL |
| `ROBINHOOD_RPC_URL` | Server-side reads | `https://...` RPC URL |

Locally, put them in `.env.local`; on Vercel, add them under Project Settings → Environment Variables and
redeploy. If an endpoint fails, reads fall back to `https://robinhood-rpc.publicnode.com`.

## Network

- Robinhood Chain, chain id `4663` (`0x1237`), gas in ETH
- Public RPC `https://rpc.mainnet.chain.robinhood.com`
- Explorer `https://robinhoodchain.blockscout.com`

## Disclaimer

Community meme token with no promised returns. Not affiliated with Robinhood Markets. Nothing on the site is
financial advice.

## License

MIT, see [LICENSE](LICENSE).
