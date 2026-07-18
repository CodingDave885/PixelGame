import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { VillageScene } from "./scenes/VillageScene";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-root",
  pixelArt: true,
  backgroundColor: "#5fa042",
  width: 480,
  height: 320,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, VillageScene],
});
