import EasyStar from "easystarjs";

export class Game extends Phaser.Scene {
    constructor(props) {
        super(props);
    }

    preload() {
        this.load.image('tileset', 'assets/tilemaps/tiles/gridtiles.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/map.json');
        this.load.spritesheet('car', 'assets/sprites/car.png', {frameWidth: 80, frameHeight: 65})
    };

    create() {
        this.input.on('pointerup', this.handleClick, this);

        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, 20 * 32, 20 * 32);

        let phaserGuy = this.physics.add.sprite(38, 520, 'car', 0);
        phaserGuy.scale = 0.8;
        phaserGuy.setOrigin(0.4)
        phaserGuy.setDepth(1);
        this.camera.startFollow(phaserGuy);
        this.player = phaserGuy;

        this.map = this.make.tilemap({key: 'map'});
        let tiles = this.map.addTilesetImage('tiles', 'tileset');
        this.map.createStaticLayer(0, tiles, 0, 0);

        this.marker = this.add.graphics();
        this.marker.lineStyle(3, 0xffffff, 1);
        this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);

        this.finder = new EasyStar.js();

        let grid = [];
        for (let y = 0; y < this.map.height; y++) {
            let col = [];
            for (let x = 0; x < this.map.width; x++) {
                col.push(this.getTileID(x, y));
            }
            grid.push(col);
        }
        this.finder.setGrid(grid);

        let tileset = this.map.tilesets[0];
        let properties = tileset.tileProperties;
        let acceptableTiles = [];

        for (let i = tileset.firstgid - 1; i < tiles.total; i++) {
            if (!properties.hasOwnProperty(i)) {
                acceptableTiles.push(i + 1);
                continue;
            }
            if (!properties[i].collide) acceptableTiles.push(i + 1);
            if (properties[i].cost) this.finder.setTileCost(i + 1, properties[i].cost);
        }
        this.finder.setAcceptableTiles(acceptableTiles);
    };

    update() {
        let worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

        let pointerTileX = this.map.worldToTileX(worldPoint.x);
        let pointerTileY = this.map.worldToTileY(worldPoint.y);
        this.marker.x = this.map.tileToWorldX(pointerTileX);
        this.marker.y = this.map.tileToWorldY(pointerTileY);
        this.marker.setVisible(!this.checkCollision(pointerTileX, pointerTileY));
    };

    checkCollision(x, y) {
        let tile = this.map.getTileAt(x, y);
        return tile?.properties.collide === true;
    };

    getTileID = function (x, y) {
        let tile = this.map.getTileAt(x, y);
        return tile.index;
    };

    handleClick(pointer) {
        let x = this.camera.scrollX + pointer.x;
        let y = this.camera.scrollY + pointer.y;
        let toX = Math.floor(x / 32);
        let toY = Math.floor(y / 32);
        let fromX = Math.floor(this.player.x / 32);
        let fromY = Math.floor(this.player.y / 32);

        this.finder.findPath(fromX, fromY, toX, toY, (path) => {
            if (path !== null) {
                this.moveCharacter(path);
            }
        });
        this.finder.calculate();
    };

    moveCharacter(path) {
        let tweens = [];
        for (let i = 0; i < path.length - 1; i++) {
            let ex = path[i + 1].x;
            let ey = path[i + 1].y;
            tweens.push({
                targets: this.player,
                x: {value: ex * this.map.tileWidth, duration: 200},
                y: {value: ey * this.map.tileHeight, duration: 200}
            });
        }

        this.tweens.timeline({
            tweens: tweens
        });
    };

}

