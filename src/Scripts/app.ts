import "phaser";

import { PreloadScene } from "./Scenes/PreloadScene";
import { GameScene } from "./Scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  title: "Endless Runner",
  width: 1080,
  height: 720,
  parent: "game",
  scene: [PreloadScene, GameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  backgroundColor: "#000033"
};

export class EndlessRunner extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new EndlessRunner(config);
};