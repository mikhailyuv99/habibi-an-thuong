import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const boards = [
  "appetizers",
  "cold-plates",
  "salads",
  "soups",
  "mandi",
  "kebabs",
  "arabic-grill",
  "slavic-snacks",
  "drinks",
];

for (const board of boards) {
  const src = `public/menu-hd/${board}.jpg`;
  const out = `public/photos/dishes/_probe/${board}`;
  fs.mkdirSync(out, { recursive: true });
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 2; c++) {
      const left = c ? 228 : 12;
      const top = 42 + r * 128;
      await sharp(src)
        .extract({ left, top, width: 180, height: 118 })
        .resize(200, 200, { fit: "cover" })
        .toFile(path.join(out, `r${r}c${c}.jpg`));
    }
  }
}

console.log("probe grids written");
