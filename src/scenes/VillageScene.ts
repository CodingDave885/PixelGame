import Phaser from "phaser";
import { TILE_SIZE } from "../world/tileset";
import { TILE_FRAMES, isSolid } from "../world/tiles";
import { buildVillageMap, buildOverlays, MAP_W, MAP_H, SPAWN, type Overlay } from "../world/map";
import { Player, type Direction } from "../entities/Player";
import { createBitmapText } from "../ui/BitmapFont";

export class VillageScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>;
  private grid = buildVillageMap();
  private overlaySolids = new Set<string>();

  constructor() {
    super("Village");
  }

  create(): void {
    const worldLayer = this.add.layer();

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const tile = this.grid[y][x];
        const img = this.add
          .image(
            x * TILE_SIZE + TILE_SIZE / 2,
            y * TILE_SIZE + TILE_SIZE / 2,
            "basictiles",
            TILE_FRAMES[tile],
          )
          .setDepth(0);
        worldLayer.add(img);
      }
    }

    const overlays = buildOverlays(this.grid);
    for (const o of overlays) worldLayer.add(this.placeOverlay(o));

    this.player = new Player(this, SPAWN.x, SPAWN.y, (tx, ty) => this.isBlocked(tx, ty));
    worldLayer.add(this.player.sprite);

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
    this.input.keyboard!.addKey("F").on("down", () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
      else this.scale.startFullscreen();
    });

    // A zoomed, player-following main camera can't reliably show scrollFactor(0)
    // HUD elements (Phaser renders them at the wrong scale/position), so HUD
    // text lives on its own unzoomed camera that ignores the world, while the
    // main camera ignores the HUD layer.
    const uiLayer = this.add.layer();
    const title = createBitmapText(this, 8, 6, "PIXEL VILLAGE", "orange", 1);
    uiLayer.add(title);
    const hint = createBitmapText(this, 8, 300, "F FOR FULLSCREEN", "blue", 1);
    uiLayer.add(hint);

    const uiCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);
    uiCamera.ignore(worldLayer);
    this.cameras.main.ignore(uiLayer);
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta, this.heldDirection());
  }

  private placeOverlay(o: Overlay): Phaser.GameObjects.Image {
    const img = this.add
      .image(o.x * TILE_SIZE + TILE_SIZE / 2, o.y * TILE_SIZE + TILE_SIZE, o.texture, o.frame)
      .setOrigin(0.5, 1)
      .setDepth(5);
    if (o.solid) this.overlaySolids.add(`${o.x},${o.y}`);
    return img;
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
    if (this.overlaySolids.has(`${tileX},${tileY}`)) return true;
    return isSolid(this.grid[tileY][tileX]);
  }
}
