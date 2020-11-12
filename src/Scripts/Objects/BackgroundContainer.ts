import "phaser";

export default class BackgroundContainer extends Phaser.GameObjects.Container
{
    constructor(scene: Phaser.Scene, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[])
    {
        if(!children)
        {
            var bg1 = scene.add.image(0, 0, "background");
            bg1.setDisplaySize(2160, 1440);
            var bg2 = scene.add.image(2160, 0, "background");
            bg2.setDisplaySize(2160, 1440);

            children = [bg1, bg2];
        }
        
        super(scene, x, y, children);
        scene.add.existing(this);
    }

    update(time: number, delta: number): void
    {
        let deltaTime = delta/1000;
        this.setX(this.x - (200 * deltaTime));
        if(this.x <= -2160)
            this.setX(0);
    }
}