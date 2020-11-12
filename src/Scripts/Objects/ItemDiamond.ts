import "phaser";
import BasePrefab from "./BasePrefab";

export default class ItemDiamond extends BasePrefab
{
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | integer)
    {
        super(scene, x, y, texture, frame);

        this.setDisplaySize(32, 32);
    }
}