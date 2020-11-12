import "phaser";

export default class ObjectPoolManager
{
    private static instance: ObjectPoolManager;
    public pool: { [id: string] : Phaser.GameObjects.GameObject[] }

    private constructor()
    {
        this.pool = {};
        this.pool["obstacle_fence"] = [];
        this.pool["obstacle_spinner"] = [];
        this.pool["item_diamond"] = [];
    }
    
    public static GetInstance(): ObjectPoolManager
    {
        if(!ObjectPoolManager.instance)
            ObjectPoolManager.instance = new ObjectPoolManager();

        return ObjectPoolManager.instance;
    }

    public SpawnObjectFromPool(key: string): Phaser.GameObjects.GameObject
    {
        if(key in this.pool)
        {
            if(this.pool[key].length > 0)
            {
                var obj = this.pool[key].shift();
                // obj.setVisible(true);
                return obj;
            }
        }
        return null;
    }

    public StoreObjectToPool(obj: Phaser.GameObjects.GameObject, key: string): void{
        // obj.setVisible(false);
        if(!(key in this.pool))
            this.pool[key] = [];
        this.pool[key].push(obj);
    }

    public ResetPool()
    {
        this.pool = {};
        this.pool["obstacle_fence"] = [];
        this.pool["obstacle_spinner"] = [];
        this.pool["item_diamond"] = [];
    }
}
