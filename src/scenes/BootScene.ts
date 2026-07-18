import Phaser from "phaser";
import { TILE_SIZE } from "../world/tileset";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload(): void {
    // BASE_URL accounts for deployments served from a sub-path (e.g. GitHub Pages'
    // /PixelGame/) — a hardcoded leading "/" would 404 there since Vite only
    // rewrites asset paths it processes at build time, not runtime string literals.
    const assets = `${import.meta.env.BASE_URL}game-assets/`;
    this.load.spritesheet("basictiles", `${assets}basictiles.png`, {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });
    this.load.spritesheet("things", `${assets}things.png`, {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });
    this.load.spritesheet("characters", `${assets}characters.png`, {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });
    this.load.spritesheet("dead", `${assets}dead.png`, {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });
    // Loaded as a plain image; BitmapFont slices exact per-glyph sub-frames on first use
    // since the sheet's rows aren't uniform height (lowercase rows include descenders).
    this.load.image("font", `${assets}fontlarge.png`);
  }

  create(): void {
    this.scene.start("Village");
  }
}
