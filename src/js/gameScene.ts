import "phaser";

export class GameScene extends Phaser.Scene {
    walls: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    info: Phaser.GameObjects.Text;
    target = new Phaser.Math.Vector2();
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(params): void {
        // TODO
    }

    preload(): void {
        this.load.spritesheet('car', 'assets/sprites/car.png', {frameWidth: 100, frameHeight: 65})
        this.load.image('walls', 'assets/sprites/walls.png')
    }

    create(): void {
        this.anims.create({
            key: "turnCarToRight",
            frameRate: 25,
            frames:  this.anims.generateFrameNumbers("car", { start: 0, end: 8 }),
            repeat: 0
        });
        this.player = this.physics.add.sprite(100, 500, 'car');
        this.walls = this.physics.add.image(200, 250, 'walls');
        this.player.play('turnCarToRight')
        this.input.on('pointerup', this.carMovement.bind(this))
    }

    update(time): void {
        let distance = Phaser.Math.Distance.Between(this.player['x'], this.player['y'], this.target.x, this.target.y);

        if (this.player.body.speed > 0) {
            //  4 is our distance tolerance, i.e. how close the source can get to the target
            //  before it is considered as being there. The faster it moves, the more tolerance is required.
            if (distance < 4) {
                this.player.body.reset(this.target.x, this.target.y);
            }
        }
    }

    carMovement(pointer) {
        this.target.x = pointer.x;
        this.target.y = pointer.y;
        this.physics.moveToObject(this.player, this.target, 200);
    }
}