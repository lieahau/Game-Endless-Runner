import "phaser";

export default class BackgroundContainer extends Phaser.GameObjects.Container
{
    constructor(scene: Phaser.Scene, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[])
    {
        if(!children)
        {
            children = [];

            for(var i = 0; i < 35; i++)
            {
                var ground_top = scene.add.image((i * 32) + 32, -64, "ground_top");
                var ground_mid = scene.add.image((i * 32) + 32, 0, "ground_bottom");
                var ground_bottom = scene.add.image((i * 32) + 32, 64, "ground_bottom");
                children.push(...[ground_top, ground_mid, ground_bottom]);
            }
        }
        
        super(scene, x, y, children);
        scene.add.existing(this);

        this.setSize(2304, 192);
        scene.physics.world.enable(this);
        (this.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    }

    update(time: number, delta: number): void
    {
        let deltaTime = delta/1000;
        this.setX(this.x - (200 * deltaTime));
        if(this.x <= -64)
            this.setX(0);
    }
}