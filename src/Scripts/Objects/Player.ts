import "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite
{
    public isRunning: boolean;
    public isJumping: boolean;
    public isDucking: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | integer)
    {
        super(scene, x, y, texture, frame);
        // scene.physics.add.existing(this);
        scene.add.existing(this);
        scene.physics.world.enable(this);

        scene.anims.create({
            key: "run",
            frames: scene.anims.generateFrameNumbers("character", { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        scene.anims.create({
            key: "jump",
            frames: [{ key: "character", frame: 1 }],
            frameRate: 5
        });
        scene.anims.create({
            key: "duck",
            frames: [{ key: "character", frame: 6 }],
            frameRate: 5
        });

        this.isRunning = false;
        this.isJumping = false;
        this.isDucking = false;
        this.Run();
        this.setGravityY(1000);
        scene.sound.add("sfx_jump");

        scene.input.keyboard.addKey("up").on("down", () => {
            if(this.isRunning)
                this.Jump();
        });

        scene.input.keyboard.addKey("down").on("down", () => {
            if(this.isRunning)
                this.Duck();
        });
    }

    public Run(): void {
        if(this.isRunning)
            return;

        this.isRunning = true;
        this.isJumping = false;
        this.isDucking = false;

        this.anims.play("run", true);
        this.body.setSize(76, 66);
        this.body.setOffset(10, 30);
    }

    public Dead(): void
    {
        if(!this.isJumping)
        {
            this.anims.play("jump", true);
            this.body.setSize(76, 71);
            this.body.setOffset(10, 25);
        }
        this.setVelocityY(-650);
    }

    public Jump(): void
    {
        if(this.isJumping)
            return;
        
        this.isRunning = false;
        this.isJumping = true;
        this.isDucking = false;

        this.anims.play("jump", true);
        this.body.setSize(76, 71);
        this.body.setOffset(10, 25);
        this.setVelocityY(-650);
        this.scene.sound.play("sfx_jump");
    }

    public Duck(): void
    {
        if(this.isDucking)
            return;
        
        this.isRunning = false;
        this.isJumping = false;
        this.isDucking = true;

        this.anims.play("duck", true);
        this.body.setSize(80, 60);
        this.body.setOffset(10, 36);
        this.scene.time.addEvent({
            delay: 1500,
            callback: () => {
                this.Run();
            }
        });
    }
}