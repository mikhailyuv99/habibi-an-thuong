/**
 * Extract square dish thumbnails from Habibi menu board photography.
 * Layout verified against probe grids in public/photos/dishes/_probe/.
 * Run: node scripts/extract-order-dish-photos.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/photos/dishes");

/** Standard 420×560 menu board cell */
function cell(col, row) {
  return { left: col ? 228 : 12, top: 42 + row * 128, width: 180, height: 118 };
}

/** @type {Record<string, { src: string; left: number; top: number; width: number; height: number }>} */
const CROPS = {
  // Appetizers (photos: row1 col1, row3 col0, row3 col1)
  hummus: { src: "menu-hd/appetizers.jpg", ...cell(1, 1) },
  mutabel: { src: "menu-hd/appetizers.jpg", ...cell(0, 3) },
  fattoush: { src: "menu-hd/appetizers.jpg", ...cell(1, 3) },

  // Cold plates
  "mixed-cold": { src: "menu-hd/cold-plates.jpg", ...cell(0, 1) },
  "green-salad": { src: "menu-hd/cold-plates.jpg", ...cell(1, 1) },
  tabbouleh: { src: "menu-hd/cold-plates.jpg", ...cell(0, 2) },
  falafel: { src: "menu-hd/cold-plates.jpg", ...cell(1, 3) },

  // Salads & sides
  "napa-cabbage": { src: "menu-hd/salads.jpg", ...cell(0, 2) },
  "homemade-potatoes": { src: "menu-hd/salads.jpg", ...cell(1, 3) },

  // Soups
  "lamb-soup": { src: "menu-hd/soups.jpg", ...cell(0, 0) },
  "lentil-soup": { src: "menu-hd/soups.jpg", ...cell(1, 1) },
  "couscous-chicken": { src: "menu-hd/soups.jpg", ...cell(0, 3) },

  // Mandi
  "mandi-chicken-thigh": { src: "menu-hd/mandi.jpg", ...cell(1, 1) },
  "mandi-half-chicken": { src: "menu-hd/mandi.jpg", ...cell(1, 2) },
  "mandi-lamb": { src: "menu-hd/mandi.jpg", ...cell(0, 3) },

  // Slavic snacks
  "piroshki-potato": { src: "menu-hd/slavic-snacks.jpg", ...cell(1, 0) },
  "piroshki-chicken": { src: "menu-hd/slavic-snacks.jpg", ...cell(1, 0) },
  "piroshki-cheese": { src: "menu-hd/slavic-snacks.jpg", ...cell(1, 0) },
  "falafel-wrap": { src: "menu-hd/slavic-snacks.jpg", ...cell(0, 2) },
  "zucchini-rolls": { src: "menu-hd/slavic-snacks.jpg", ...cell(1, 3) },

  // Kebabs
  "chicken-shish": { src: "menu-hd/kebabs.jpg", ...cell(0, 0) },
  "lamb-kebab": { src: "menu-hd/kebabs.jpg", ...cell(1, 1) },
  "chicken-kebab": { src: "menu-hd/kebabs.jpg", ...cell(1, 3) },
  "chicken-wings": { src: "menu-hd/kebabs.jpg", ...cell(1, 2) },

  // Arabic grill — eggplant only (mix grill + shashlik use real photos)
  "eggplant-kebab": { src: "menu-hd/arabic-grill.jpg", ...cell(1, 2) },

  // Drinks
  cappuccino: { src: "menu-hd/drinks.jpg", ...cell(0, 3) },
  espresso: { src: "menu-hd/drinks.jpg", ...cell(1, 3) },

  // Wraps board (900×900)
  "gyros-wrap": { src: "menu-hd/_preview/board-12.jpg", left: 480, top: 40, width: 400, height: 280 },
  "placinta-apple": { src: "menu-hd/_preview/board-12.jpg", left: 20, top: 280, width: 400, height: 300 },
  "placinta-potato": { src: "menu-hd/_preview/board-12.jpg", left: 20, top: 280, width: 400, height: 300 },
  "placinta-mozzarella": { src: "menu-hd/_preview/board-12.jpg", left: 20, top: 280, width: 400, height: 300 },
  "placinta-cottage": { src: "menu-hd/_preview/board-12.jpg", left: 20, top: 280, width: 400, height: 300 },
  "french-fries": { src: "menu-hd/_preview/board-12.jpg", left: 480, top: 520, width: 400, height: 360 },
};

fs.mkdirSync(OUT, { recursive: true });

let ok = 0;
for (const [id, crop] of Object.entries(CROPS)) {
  const input = path.join(ROOT, "public", crop.src);
  const output = path.join(OUT, `${id}.jpg`);
  if (!fs.existsSync(input)) {
    console.error("missing source:", input);
    continue;
  }
  await sharp(input)
    .extract({
      left: crop.left,
      top: crop.top,
      width: crop.width,
      height: crop.height,
    })
    .resize(400, 400, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88 })
    .toFile(output);
  ok += 1;
}

console.log(`Wrote ${ok} dish thumbnails to public/photos/dishes/`);
