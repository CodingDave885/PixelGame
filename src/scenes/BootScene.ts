import Phaser from "phaser";
import { TILE_SIZE, Tile } from "../world/tiles";

/**
 * Generates placeholder pixel-art textures at runtime so the game is playable
 * before the real spritesheets (assets/raw/*) are wired in. Swapping to the
 * real art means replacing this scene's texture generation with
 * this.load.spritesheet(...) calls keyed to the same texture names.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create(): void {
    this.makeTile(Tile.Grass, (g) => {
      g.fillStyle(0x5fa042, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(0x6bb04c, 1);
      g.fillRect(2, 3, 2, 2);
      g.fillRect(10, 8, 2, 2);
      g.fillRect(5, 12, 2, 2);
    });

    this.makeTile(Tile.GrassFlower, (g) => {
      g.fillStyle(0x5fa042, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(0xe8e25a, 1).fillRect(4, 5, 2, 2);
      g.fillStyle(0xe86a8a, 1).fillRect(9, 9, 2, 2);
      g.fillStyle(0xffffff, 1).fillRect(6, 10, 2, 2);
    });

    this.makeTile(Tile.Water, (g) => {
      g.fillStyle(0x3d6fd6, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(0x5a8ce8, 1);
      g.fillRect(0, 4, TILE_SIZE, 2);
      g.fillRect(0, 11, TILE_SIZE, 2);
    });

    this.makeTile(Tile.Path, (g) => {
      g.fillStyle(0xcbaa6d, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(0xb89560, 1);
      g.fillRect(3, 4, 2, 2);
      g.fillRect(11, 9, 2, 2);
      g.fillRect(7, 12, 2, 2);
    });

    this.makeTile(Tile.Tree, (g) => {
      g.fillStyle(0x5fa042, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(0x6b4226, 1).fillRect(6, 10, 4, 6);
      g.fillStyle(0x2e6b2e, 1).fillCircle(8, 6, 7);
      g.fillStyle(0x3a8a3a, 1).fillCircle(6, 4, 3);
    });

    this.makeTile(Tile.Fence, (g) => {
      g.fillStyle(0x5fa042, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(0xa9784a, 1);
      g.fillRect(1, 2, 3, 12);
      g.fillRect(12, 2, 3, 12);
      g.fillRect(0, 6, TILE_SIZE, 2);
    });

    this.makeTile(Tile.HouseRoof, (g) => {
      g.fillStyle(0x8b3a3a, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(0x6e2c2c, 1);
      for (let i = 0; i < TILE_SIZE; i += 4) g.fillRect(0, i, TILE_SIZE, 1);
    });

    this.makeTile(Tile.HouseWall, (g) => {
      g.fillStyle(0xe8d9b0, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(0xc9b083, 1);
      g.fillRect(0, 0, TILE_SIZE, 2);
      g.fillRect(0, 8, TILE_SIZE, 2);
      g.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2);
    });

    this.makeTile(Tile.HouseDoor, (g) => {
      g.fillStyle(0xe8d9b0, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(0x4a2e1a, 1).fillRect(3, 2, 10, 14);
      g.fillStyle(0xd8b45a, 1).fillCircle(11, 9, 1);
    });

    this.makeTile(Tile.Well, (g) => {
      g.fillStyle(0x5fa042, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(0x8a8a8a, 1).fillCircle(8, 8, 7);
      g.fillStyle(0x6a6a6a, 1).fillCircle(8, 8, 6);
      g.fillStyle(0x33475e, 1).fillCircle(8, 8, 4);
    });

    this.makeTile(Tile.Chest, (g) => {
      g.fillStyle(0x5fa042, 1).fillRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.fillStyle(0x8a5a2a, 1).fillRect(2, 6, 12, 8);
      g.fillStyle(0x6e431f, 1).fillRect(2, 6, 12, 2);
      g.fillStyle(0xd8b45a, 1).fillRect(7, 9, 2, 2);
    });

    this.makePlayerTextures();

    this.scene.start("Village");
  }

  private makeTile(key: Tile, draw: (g: Phaser.GameObjects.Graphics) => void): void {
    const g = this.add.graphics();
    draw(g);
    g.generateTexture(key, TILE_SIZE, TILE_SIZE);
    g.destroy();
  }

  /** Simple 16x20 humanoid placeholders, two frames per direction for a walk bob. */
  private makePlayerTextures(): void {
    const dirs: Record<string, { body: number; accent: number }> = {
      down: { body: 0x3a6ea8, accent: 0xf0c090 },
      up: { body: 0x3a6ea8, accent: 0x2b4a66 },
      left: { body: 0x3a6ea8, accent: 0xf0c090 },
      right: { body: 0x3a6ea8, accent: 0xf0c090 },
    };

    for (const [dir, colors] of Object.entries(dirs)) {
      for (let frame = 0; frame < 2; frame++) {
        const g = this.add.graphics();
        const bob = frame === 1 ? 1 : 0;
        // shadow
        g.fillStyle(0x000000, 0.25).fillEllipse(8, 19, 10, 4);
        // body
        g.fillStyle(colors.body, 1).fillRect(4, 8 - bob, 8, 10);
        // head
        g.fillStyle(0xf0c090, 1).fillRect(4, 1 - bob, 8, 7);
        // hair/back-of-head accent to hint direction
        g.fillStyle(0x5a3a20, 1);
        if (dir === "up") g.fillRect(4, 1 - bob, 8, 3);
        else if (dir === "down") g.fillRect(4, 1 - bob, 8, 2);
        else if (dir === "left") g.fillRect(4, 1 - bob, 3, 7);
        else g.fillRect(9, 1 - bob, 3, 7);
        // feet step
        g.fillStyle(0x2b2b2b, 1);
        if (frame === 0) {
          g.fillRect(4, 17, 3, 2);
          g.fillRect(9, 17, 3, 2);
        } else {
          g.fillRect(3, 17, 3, 2);
          g.fillRect(10, 16, 3, 2);
        }
        g.generateTexture(`player_${dir}_${frame}`, TILE_SIZE, 20);
        g.destroy();
      }
    }
  }
}
