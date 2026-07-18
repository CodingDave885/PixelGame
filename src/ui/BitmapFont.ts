import Phaser from "phaser";

// Measured from assets/raw/fontlarge.png: 4 glyph rows (upper A-M/N-Z, lower a-m/n-z),
// each with a blue set (cols 0-12) then an orange set (cols 13-25), 16px-wide columns.
// Row heights aren't uniform because the lowercase rows include descenders (g, j, p, q, y).
const COL_WIDTH = 16;
const ROW_BANDS = [
  { y: 0, h: 16 }, // A-M
  { y: 18, h: 16 }, // N-Z
  { y: 36, h: 23 }, // a-m
  { y: 61, h: 22 }, // n-z
];

export type FontColor = "blue" | "orange";

function glyphSpec(ch: string): { row: number; col: number } | null {
  if (ch >= "A" && ch <= "M") return { row: 0, col: ch.charCodeAt(0) - "A".charCodeAt(0) };
  if (ch >= "N" && ch <= "Z") return { row: 1, col: ch.charCodeAt(0) - "N".charCodeAt(0) };
  if (ch >= "a" && ch <= "m") return { row: 2, col: ch.charCodeAt(0) - "a".charCodeAt(0) };
  if (ch >= "n" && ch <= "z") return { row: 3, col: ch.charCodeAt(0) - "n".charCodeAt(0) };
  return null;
}

let framesReady = false;

/** Slices fontlarge.png into per-glyph sub-frames on first use. */
function ensureFrames(scene: Phaser.Scene): void {
  if (framesReady) return;
  const texture = scene.textures.get("font");
  for (let row = 0; row < ROW_BANDS.length; row++) {
    const { y, h } = ROW_BANDS[row];
    for (let col = 0; col < 26; col++) {
      const key = `font_${row}_${col}`;
      if (!texture.has(key)) {
        texture.add(key, 0, col * COL_WIDTH, y, COL_WIDTH, h);
      }
    }
  }
  framesReady = true;
}

/**
 * Renders `text` (letters only; anything else becomes a space) using the
 * hand-painted bitmap font. Returns the individual glyph images (rather than
 * a Container) since Phaser Containers don't reliably honor scrollFactor 0
 * on a zoomed camera.
 */
export function createBitmapText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  color: FontColor = "blue",
  scale = 1,
): Phaser.GameObjects.Image[] {
  ensureFrames(scene);
  const images: Phaser.GameObjects.Image[] = [];
  let cursor = x;
  for (const ch of text) {
    const spec = glyphSpec(ch);
    if (!spec) {
      cursor += COL_WIDTH * scale * 0.6;
      continue;
    }
    const col = spec.col + (color === "orange" ? 13 : 0);
    const img = scene.add.image(cursor, y, "font", `font_${spec.row}_${col}`);
    img.setOrigin(0, 0);
    img.setScale(scale);
    img.setScrollFactor(0);
    images.push(img);
    cursor += COL_WIDTH * scale;
  }
  return images;
}
