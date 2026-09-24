/* Renders the site's brand files from the owner-supplied artwork.
 *
 *   npm run brand
 *
 * Reads the source artwork from BRAND_SOURCE_DIR (default: ./brand-source/,
 * not committed) and writes
 * public/brand/{nearduck-mark.webp, nearduck-plate.webp, og.webp} plus
 * src/app/{favicon.ico, icon.png, apple-icon.png}. Every shipped image is
 * .webp except the browser icons, which browsers read as ICO/PNG.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const SRC = process.env.BRAND_SOURCE_DIR
  ? `${resolve(process.env.BRAND_SOURCE_DIR)}/`
  : fileURLToPath(new URL("../brand-source/", import.meta.url));
const OUT = fileURLToPath(new URL("../public/brand/", import.meta.url));
const APP = fileURLToPath(new URL("../src/app/", import.meta.url));
const CREAM = { r: 247, g: 242, b: 227, alpha: 1 };

await mkdir(OUT, { recursive: true });

// Mark without its empty canvas, so it fills the boxes it is placed in.
const trimmed = await sharp(`${SRC}nearduck-mark-source.png`).trim().png().toBuffer();
await sharp(trimmed).resize(720, 720, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 92 }).toFile(`${OUT}nearduck-mark.webp`);
await sharp(`${SRC}nearduck-mark-plate.webp`).resize(512, 512).webp({ quality: 90 }).toFile(`${OUT}nearduck-plate.webp`);

// Social card: the banner centred on its own cream.
const banner = await sharp(`${SRC}nearduck-banner.webp`).resize(1200).toBuffer();
const bannerMeta = await sharp(banner).metadata();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: CREAM } })
  .composite([{ input: banner, top: Math.round((630 - bannerMeta.height) / 2), left: 0 }])
  .webp({ quality: 88 })
  .toFile(`${OUT}og.webp`);

// Tab icon: the duck's head reads at 16px where the whole armchair does not.
const head = await sharp(`${SRC}nearduck-mark-source.png`)
  .extract({ left: 392, top: 176, width: 330, height: 330 })
  .toBuffer();
const favPng = (size) => sharp(head).resize(size, size).ensureAlpha().png({ compressionLevel: 9 }).toBuffer();

function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

// App icons: the full mark on cream, opaque, as home screens expect.
const plateIcon = async (size, pad) => {
  const inner = await sharp(trimmed).resize(size - pad * 2, size - pad * 2, { fit: "contain", background: { ...CREAM } }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: CREAM } })
    .composite([{ input: inner, top: pad, left: pad }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

const ico = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await favPng(size) })));
await writeFile(`${APP}favicon.ico`, buildIco(ico));
await writeFile(`${APP}icon.png`, await plateIcon(192, 14));
await writeFile(`${APP}apple-icon.png`, await plateIcon(180, 14));
console.log("brand assets written");
