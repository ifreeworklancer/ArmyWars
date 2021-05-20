import "phaser";

export class GameScene extends Phaser.Scene {
    map: Phaser.Tilemaps.Tilemap;
    marker: Phaser.GameObjects.Graphics;
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
        this.load.image('tiles', [ 'assets/tilemaps/tiles/drawtiles1.png', 'assets/tilemaps/tiles/drawtiles1_n.png' ]);
        this.load.tilemapCSV('map', 'assets/tilemaps/maps/grid.csv');
        this.load.spritesheet('car', 'assets/sprites/car.png', {frameWidth: 80, frameHeight: 65})
    }

    create(): void {
        this.map = this.make.tilemap({ key: 'map' });
        let tileset = this.map.addTilesetImage('tiles', null, 32, 32,1, 2);
        this.map.createLayer(0, tileset, 0, 0);

        this.marker = this.add.graphics();
        this.marker.lineStyle(3, 0xffffff, 1);
        this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
        this.player = this.physics.add.sprite(38, 520, 'car', 0);
        this.player.scale = 0.8;
    }

    update(time): void {

        // Rounds down to nearest tile
        let pointerTileX = this.map.worldToTileX(this.input.activePointer.x);
        let pointerTileY = this.map.worldToTileY(this.input.activePointer.y);

        // Snap to tile coordinates, but in world space
        this.marker.x = this.map.tileToWorldX(pointerTileX);
        this.marker.y = this.map.tileToWorldY(pointerTileY);
    }
}