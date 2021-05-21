import "phaser";
import {Game} from "./game"

var config = {
    type: Phaser.AUTO,
    width: 20*32,
    height: 20*32,
    parent: 'game',
    scene: [Game],
    physics: {
        default: "arcade",
    },
};

new Phaser.Game(config);