import "phaser";

export class GameScene extends Phaser.Scene {
    walls: Phaser.Physics.Arcade.StaticGroup;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    target = new Phaser.Math.Vector2();
    info: Phaser.GameObjects.Text;
    isBuildingBarrier: boolean = true;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(params): void {
        // TODO
    }

    preload(): void {
        this.load.spritesheet('car', 'assets/sprites/car.png', {frameWidth: 80, frameHeight: 65})
        this.load.image('walls', 'assets/sprites/walls.png')
    }

    create(): void {
        this.player = this.physics.add.sprite(100, 500, 'car', 0);
        this.walls = this.physics.add.staticGroup();

        this.physics.add.collider(this.walls, this.player, () => {
            this.player.body.reset(this.player.x, this.player.y);
        });

        this.input.on('pointerup', this.handleClick, this);

        this.info = this.add.text(10, 10, 'Click anywhere in the area to create an barrier\n\nAfter you add all the barrier you need, press space to add a route', {font: '16px Arial Bold'});

        this.input.keyboard.addKey('SPACE').once('down', () => {
            this.isBuildingBarrier = false
            this.info.setText('Click anywhere in the area to plot a route for the car')
        });
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

    handleClick(pointer) {
        this.target.x = pointer.x;
        this.target.y = pointer.y;
        if (this.isBuildingBarrier) {
            this.buildingBarrier()
            return
        }
        this.carMovement()
    }

    carMovement() {
        this.physics.moveToObject(this.player, this.target, 200);
    }

    buildingBarrier() {
        this.walls.create(this.target.x, this.target.y, 'walls').setInteractive();
        this.walls.getChildren().forEach(wall => {
            wall.on('pointerup', () => {
                if (this.isBuildingBarrier) {
                    wall.destroy()
                }
            })
        })
    }
}