import "phaser";
import GameConfig = Phaser.Types.Core.GameConfig;

const config: GameConfig = {
    title: "ArmyWars",
    width: 800,
    height: 600,
    parent: "game",
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