import Phaser from "phaser";
import { TILE_SIZE, isSolid } from "../world/tiles";
import { buildVillageMap, MAP_W, MAP_H, SPAWN } from "../world/map";
import { Player, type Direction } from "../entities/Player";

export class VillageScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
  private grid = buildVillageMap();

  constructor() {
    super("Village");
  }

  create(): void {
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const tile = this.grid[y][x];
        this.add
          .image(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, tile)
          .setDepth(0);
      }
    }

    this.player = new Player(this, SPAWN.x, SPAWN.y, (tx, ty) => this.isBlocked(tx, ty));

    const worldW = MAP_W * TILE_SIZE;
    const worldH = MAP_H * TILE_SIZE;
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player.sprite, true, 0.2, 0.2);
    this.cameras.main.setZoom(3);
    this.cameras.main.roundPixels = true;

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey("W"),
      A: this.input.keyboard!.addKey("A"),
      S: this.input.keyboard!.addKey("S"),
      D: this.input.keyboard!.addKey("D"),
    };
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta, this.heldDirection());
  }

  private heldDirection(): Direction | null {
    if (this.cursors.up.isDown || this.wasd.W.isDown) return "up";
    if (this.cursors.down.isDown || this.wasd.S.isDown) return "down";
    if (this.cursors.left.isDown || this.wasd.A.isDown) return "left";
    if (this.cursors.right.isDown || this.wasd.D.isDown) return "right";
    return null;
  }

  private isBlocked(tileX: number, tileY: number): boolean {
    if (tileX < 0 || tileY < 0 || tileX >= MAP_W || tileY >= MAP_H) return true;
    return isSolid(this.grid[tileY][tileX]);
  }
}
