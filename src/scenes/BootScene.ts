import Phaser from "phaser";
import { TILE_SIZE } from "../world/tileset";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload(): void {
    this.load.spritesheet("basictiles", "/game-assets/basictiles.png", {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });
    this.load.spritesheet("things", "/game-assets/things.png", {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });
    this.load.spritesheet("characters", "/game-assets/characters.png", {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });
    this.load.spritesheet("dead", "/game-assets/dead.png", {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });
    // Loaded as a plain image; BitmapFont slices exact per-glyph sub-frames on first use
    // since the sheet's rows aren't uniform height (lowercase rows include descenders).
    this.load.image("font", "/game-assets/fontlarge.png");
  }

  create(): void {
    this.scene.start("Village");
  }
}
