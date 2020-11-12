import "phaser";

export class PreloadScene extends Phaser.Scene {

    constructor() {
        super({ key: "PreloadScene" });
    }

    preload(): void {
        this.load.path = "src/Assets/";
        this.load.image("background", "background.png");
        this.load.image("ground_bottom", "platformPack_tile004.png");
        this.load.image("ground_top", "platformPack_tile001.png");
        this.load.image("obstacle_fence", "platformPack_tile038.png");
        this.load.image("obstacle_spinner", "platformPack_tile024.png");
        this.load.image("item_diamond", "platformPack_item009.png");
        
        this.load.spritesheet("character", "platformerPack_character.png", { frameWidth: 96, frameHeight: 96 });

        this.load.audio("sfx_jump", "Mario_Jumping.wav");
        this.load.audio("sfx_scoring", "Arrow.wav");
        this.load.audio("sfx_gameover", "Smashing.wav");
    }
  
    create(): void {
        this.scene.start("GameScene");
    }
};
