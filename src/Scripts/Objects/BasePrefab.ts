import "phaser";

export default abstract class BasePrefab extends Phaser.Physics.Arcade.Image
{
    public isOverlapEnter: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | integer)
    {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.isOverlapEnter = false;
    }

    public OnOverlapEnter(): void
    {
        if(this.isOverlapEnter)
            return;
        this.isOverlapEnter = true;

        this.setVelocity(0);
        this.setVisible(false);
    }

    public OnOverlapExit(): void
    {
        this.isOverlapEnter = false;
        this.setVisible(true);
    }
}