import "phaser";
import BackgroundContainer from "../Objects/BackgroundContainer";
import GroundContainer from "../Objects/GroundContainer";
import Player from "../Objects/Player";
import ObstacleFence from "../Objects/ObstacleFence";
import ObstacleSpinner from "../Objects/ObstacleSpinner";
import ItemDiamond from "../Objects/ItemDiamond";
import ObjectPoolManager from "../Managers/ObjectPoolManager";
import BasePrefab from "../Objects/BasePrefab";

export class GameScene extends Phaser.Scene
{
    bgContainer: BackgroundContainer;
    groundContainer: GroundContainer;
    offScreen: Phaser.GameObjects.Container;

    player: Player;

    minSpawnTime: number; // in seconds
    maxSpawnTime: number; // in seconds
    spawnTime: number; // in seconds
    curSpawnTime: number; // in seconds
    spawnXPosition: number;
    spawnedObject: Phaser.Physics.Arcade.Image[];

    score: number;
    gainScoreOvertime: number; // in seconds
    curScoreTime: number;

    isGameOver: boolean;

    scoreText: Phaser.GameObjects.Text;
    guideText: Phaser.GameObjects.Text;
    fpsText: Phaser.GameObjects.Text;
    gameOverText: Phaser.GameObjects.Text;

    constructor()
    {
        super({ key: "GameScene" });
    }

    init(): void
    {
        this.minSpawnTime = 2;
        this.maxSpawnTime = 5;
        this.spawnTime = Phaser.Math.FloatBetween(this.minSpawnTime, this.maxSpawnTime);
        this.curSpawnTime = 0;
        this.spawnXPosition = 1112;
        this.spawnedObject = [];

        this.score = 0;
        this.gainScoreOvertime = 1;
        this.curScoreTime = 0;

        this.isGameOver = false;
    }
  
    create(): void
    {
        this.bgContainer = new BackgroundContainer(this);
        this.groundContainer = new GroundContainer(this, 0, 624);
        this.player = new Player(this, 200, this.groundContainer.y - 144, "character");

        this.CreateOffscreen();
        this.CreateInputEvent();
        this.CreateText();
        this.CreateAudio();

        this.physics.add.collider(this.player, this.groundContainer, () => {
            if(this.player.isJumping)
                this.player.Run();
        }, () => { return !this.isGameOver }, this);
    }

    private CreateOffscreen(): void
    {
        this.offScreen = this.add.container(32, 0);
        this.offScreen.setSize(64, 1440);
        this.physics.world.enable(this.offScreen);
        (this.offScreen.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    }

    private CreateInputEvent(): void
    {
        this.input.keyboard.addKey("R").on("down", () => {
            if(this.isGameOver)
            {
                ObjectPoolManager.GetInstance().ResetPool();
                this.input.keyboard.removeAllKeys();
                this.scene.restart();
            }
        })
    }

    private CreateText(): void
    {
        this.scoreText = this.add.text(540, 75, "0", { 
            font: "48px Arial Bold", fill: "#000000"
        });
        
        this.guideText = this.add.text(100, 75, "Up Arrow - Jump" + "\n\n" + "Down Arrow - Duck", {
            font: "24px Arial Bold", fill: "#000000"
        });

        this.fpsText = this.add.text(100, 25, "FPS: " + Math.round(this.game.loop.actualFps), {
            font: "24px Arial", fill: "#000000"
        });

        this.gameOverText = this.add.text(450, 300, "", { 
            font: "48px Arial Bold", fill: "#000000", align: "center"
        });
    }

    private CreateAudio(): void
    {
        this.sound.add("sfx_scoring");
        this.sound.add("sfx_gameover");
    }

    update(time: number, delta: number): void
    {
        if(this.isGameOver)
            return;
        let deltaTime = delta/1000; // delta in seconds

        this.bgContainer.update(time, delta);
        this.groundContainer.update(time, delta);
        
        // spawn
        this.curSpawnTime += deltaTime;
        if(this.curSpawnTime >= this.spawnTime)
        {
            this.RandomSpawning();

            // reset and update spawn time
            this.curSpawnTime = 0;
            this.spawnTime = Phaser.Math.FloatBetween(this.minSpawnTime, this.maxSpawnTime);
        }

        // score
        this.curScoreTime += deltaTime;
        if(this.curScoreTime >= this.gainScoreOvertime)
        {
            this.UpdateScore(100);
            // reset time
            this.curScoreTime = 0;
        }

        // update text
        this.fpsText.setText("FPS: " + Math.round(this.game.loop.actualFps));
    }

    private UpdateScore(val: number): void {
        this.score += val;
        this.scoreText.setText(this.score.toString());
    }

    private RandomSpawning(): void
    {
        let obj: BasePrefab;
        let yPos: number;
        let key: string = "";

        let rnd = Phaser.Math.Between(2, 2); // 0 = fence, 1 = spinner, 2 = diamond
        if(rnd == 0)
        {
            key = "obstacle_fence";
            yPos = this.groundContainer.y - 128;
        }
        else if(rnd == 1)
        {
            yPos = this.groundContainer.y - 191;
            key = "obstacle_spinner";
        }
        else if(rnd == 2)
        {
            yPos = this.groundContainer.y - 200;
            key = "item_diamond";
        }
        
        obj = ObjectPoolManager.GetInstance().SpawnObjectFromPool(key) as BasePrefab;
        if(obj == null)
        {
            if(rnd == 0 || rnd == 1)
            {
                if(rnd == 0)
                    obj = new ObstacleFence(this, this.spawnXPosition, yPos, key);
                else if(rnd == 1)
                    obj = new ObstacleSpinner(this, this.spawnXPosition, yPos, key);
                
                this.physics.add.overlap(obj, this.player, this.OverlapPlayerObstacle(), null, this);
            }
            else if(rnd == 2)
            {
                obj = new ItemDiamond(this, this.spawnXPosition, yPos, key);
                this.physics.add.overlap(obj, this.player, this.OverlapPlayerItem(obj, key), () => { return !obj.isOverlapEnter }, this);
            }
            
            this.physics.add.overlap(obj, this.offScreen, this.OverlapOffScreen(obj, key), () => { return !obj.isOverlapEnter }, this);

            this.spawnedObject.push(obj);
        }
        else
        {
            obj.setPosition(this.spawnXPosition, yPos);
            obj.OnOverlapExit();
        }
        obj.setVelocityX(-200);
    }

    private OverlapOffScreen(obj: BasePrefab, key: string): () => void
    {
        return function()
        {
            obj.OnOverlapEnter();
            ObjectPoolManager.GetInstance().StoreObjectToPool(obj, key);
        }
    }

    private OverlapPlayerItem(item: ItemDiamond, key: string): () => void
    {
        return function()
        {
            item.OnOverlapEnter();
            ObjectPoolManager.GetInstance().StoreObjectToPool(item, key);
            this.UpdateScore(300);

            this.sound.play("sfx_scoring");
        }
    }

    private OverlapPlayerObstacle(): () => void
    {
        return function()
        {
            this.isGameOver = true;
            
            this.spawnedObject.forEach(function(obj: Phaser.Physics.Arcade.Image){
                obj.body.enable = false;
            });

            this.player.Dead();
            
            this.gameOverText.setText("Game Over" + "\n" + "R - Restart");
            
            this.sound.play("sfx_gameover");
        }
    }
};
