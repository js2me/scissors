import { Figure } from "./run";
import { GameStatsManager } from "./GameStatsManager";
import { array } from "./utils";
import { randomTurn } from "./turns";

export class StrategyManager {

  firstStarted = true;
  watchIndex = 0;
  figures = [Figure.ROCK, Figure.PAPER, Figure.SCISSORS]
  current: Figure[] = []

  constructor(turnsCount: number, private statsManager: GameStatsManager) {
    this.current = array(turnsCount).map(() => Figure.ROCK);
  }

  getNextFigure = (figure: Figure) => {
    const index = this.figures.indexOf(figure);
    return this.figures[index + 1] || this.figures[0]
  }

  callAfterGamePart() {
    // this.bumpEachToMax();
    // this.randomRepeater();
    // this.bumpRandoms();
    // this.singleFigure()
  }

  callAfterEachGame() {
    this.randomRepeater();
  }
  

  private randomRepeater() {
    const lastPcFigures = this.statsManager.getLasts(5).reduce<Figure[]>((acc, stat) => [...acc, ...stat.turns.map(turn => turn[0])], []);

    for(let x = 0; x < this.current.length; x++) {
      this.current[x] = lastPcFigures[x] === void 0 ? this.current[x] : lastPcFigures[x]
    }
  }


  private singleFigure() {
    
    this.current = [Figure.ROCK, Figure.PAPER, Figure.SCISSORS]
  }


  // [0, 0, 0]
  // [1, 0, 0]
  // [2, 0, 0]
  // [2, 1, 0]
  // [2, 2, 0]
  // [2, 2, 1]
  private bumpEachToMax() {
    if (this.current[this.watchIndex] === Figure.SCISSORS) {
      this.watchIndex = this.watchIndex + 1 >= this.current.length ? 0 : this.watchIndex + 1;
    }
    this.current[this.watchIndex] = this.getNextFigure(this.current[this.watchIndex])
  }

  // [0, 0, 0]
  // [1, 0, 0]
  // [1, 1, 0]
  // [1, 1, 1]
  // [2, 1, 1]
  private bumpAllToMax() {
    if(!this.firstStarted) {
      this.watchIndex = this.watchIndex + 1 >= this.current.length ? 0 : this.watchIndex + 1;
    }
    this.firstStarted = false
    this.current[this.watchIndex] = this.getNextFigure(this.current[this.watchIndex])
  }

  // [rnd, rnd, rnd]
  private bumpRandoms() {
    this.current = this.current.map(randomTurn)
  }
}
