import "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;
import {GameScene} from "./gameScene";

const config: GameConfig = {
    type: Phaser.AUTO,
    title: "ArmyWars",
    width: 800,
    height: 600,
    parent: "game",
    scene: [GameScene],
    physics: {
        default: "arcade",
    },
    backgroundColor: "#333333",
};

export class ArmyWarsGame extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config);
    }
}

window.onload = () => {
    const game = new ArmyWarsGame(config);
};