import Phaser from "phaser";
import { TILE_SIZE } from "../world/tiles";

export type Direction = "up" | "down" | "left" | "right";

const DELTA: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

const MOVE_MS = 150;

/**
 * Pokemon-style grid-locked player: moves exactly one tile per input, tweened
 * smoothly, and cannot start a new move until the current one finishes.
 */
export class Player {
  readonly sprite: Phaser.GameObjects.Sprite;
  tileX: number;
  tileY: number;
  private facing: Direction = "down";
  private moving = false;
  private walkFrame = 0;
  private frameTimer = 0;

  constructor(
    scene: Phaser.Scene,
    tileX: number,
    tileY: number,
    private readonly isBlocked: (tileX: number, tileY: number) => boolean,
  ) {
    this.tileX = tileX;
    this.tileY = tileY;
    const world = this.worldPos(tileX, tileY);
    this.sprite = scene.add.sprite(world.x, world.y, "player_down_0");
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setDepth(10);
  }

  private worldPos(tileX: number, tileY: number): { x: number; y: number } {
    return {
      x: tileX * TILE_SIZE + TILE_SIZE / 2,
      y: tileY * TILE_SIZE + TILE_SIZE,
    };
  }

  isMoving(): boolean {
    return this.moving;
  }

  /** Call every frame with the currently-held direction (or null). */
  update(_time: number, delta: number, heldDirection: Direction | null): void {
    if (!this.moving) {
      if (heldDirection) {
        this.tryMove(heldDirection);
      } else {
        this.sprite.setTexture(`player_${this.facing}_0`);
      }
      return;
    }

    this.frameTimer += delta;
    if (this.frameTimer > MOVE_MS / 2) {
      this.frameTimer = 0;
      this.walkFrame = 1 - this.walkFrame;
      this.sprite.setTexture(`player_${this.facing}_${this.walkFrame}`);
    }
  }

  private tryMove(dir: Direction): void {
    this.facing = dir;
    const { dx, dy } = DELTA[dir];
    const targetX = this.tileX + dx;
    const targetY = this.tileY + dy;

    this.sprite.setTexture(`player_${this.facing}_0`);

    if (this.isBlocked(targetX, targetY)) return;

    this.moving = true;
    this.tileX = targetX;
    this.tileY = targetY;
    const dest = this.worldPos(targetX, targetY);

    this.sprite.scene.tweens.add({
      targets: this.sprite,
      x: dest.x,
      y: dest.y,
      duration: MOVE_MS,
      ease: "Linear",
      onComplete: () => {
        this.moving = false;
        this.walkFrame = 0;
        this.frameTimer = 0;
      },
    });
  }
}
