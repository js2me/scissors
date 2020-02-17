import { GameStatsManager } from "./GameStatsManager";
import { StrategyManager } from "./StrategyManager";
import { randomTurn } from "./turns";
import { array } from "./utils";
import { Case } from "./Case";

export const enum Figure {
  ROCK = 0,
  PAPER,
  SCISSORS
}
export enum Winner {
  PC = 0,
  Algo,
  Draw,
}
export type Turn = () => Figure
export type GameOptions = {
  gamesCount: number;
  turnsCount: number;
  pcTurn: Turn;
  algoTurn: Turn;
}

type GameStat = {
  turns: [Figure, Figure][],
  result: Winner,
}

const findWinner = (gameWinsMap) => {
  return (
    gameWinsMap[Winner.PC] > gameWinsMap[Winner.Algo] && gameWinsMap[Winner.Draw] !== gameWinsMap[Winner.PC] ? Winner.PC :
    gameWinsMap[Winner.Algo] > gameWinsMap[Winner.PC] && gameWinsMap[Winner.Draw] !== gameWinsMap[Winner.Algo] ? Winner.Algo :
    gameWinsMap[Winner.Draw] > gameWinsMap[Winner.PC] && gameWinsMap[Winner.Draw] > gameWinsMap[Winner.Algo] ? Winner.Draw :
    false
  )
}

type StartGameOptions = GameOptions & {
  statsManager: GameStatsManager;
  strategyManager: StrategyManager;
}

const startGame = ({
  turnsCount,
  pcTurn,
  algoTurn,
  statsManager,
  strategyManager
}: StartGameOptions): any => {
  let gamesCount = turnsCount;
  const gameWinsMap = {
    [Winner.PC]: 0,
    [Winner.Algo]: 0,
    [Winner.Draw]: 0,
  }
  const turns: GameStat["turns"] = []

  for(let x = 0; x < gamesCount; x++) {
    const turnAlgo = algoTurn();
    const turnPc = pcTurn();
    const winner = Case.isWin(turnPc, turnAlgo) ? Winner.PC : Case.isDraw(turnAlgo, turnPc) ? Winner.Draw : Winner.Algo;

    turns.push([turnPc, turnAlgo])
    gameWinsMap[winner]++;

    if (x === gamesCount -1) {
      const foundWinner = findWinner(gameWinsMap);

      if (foundWinner !== false){
        statsManager.add({
          turns,
          result: foundWinner
        })
        strategyManager.callAfterEachGame();
        return foundWinner;
      } else {
        ++gamesCount;
      }
    }
  }
}

const startGamePacks = (options: Omit<GameOptions, "algoTurn"> & { gamePacksCount: number }) => {

  let gamesCount = 0;
  let algoWinsCount = 0;

  const statsManager = new GameStatsManager()
  const algoTurnStrategy = new StrategyManager(options.turnsCount, statsManager);

  while (algoWinsCount < options.gamePacksCount) {
    gamesCount++;

    const algoTurn = (() => {
      let currentIndex = 0;
      return () => algoTurnStrategy.current[currentIndex > algoTurnStrategy.current.length-1 ? (currentIndex = 0) : currentIndex++]
    })()

    const result = array(options.gamesCount).reduce(acc => {
      const winner = startGame({ ...options, algoTurn, statsManager, strategyManager: algoTurnStrategy });
      return {
        ...acc,
        [winner]: acc[winner] + 1,
      };
    }, {
      [Winner.PC]: 0,
      [Winner.Algo]: 0,
      [Winner.Draw]: 0,
    })

    console.clear()
    console.log(`strategy: [${algoTurnStrategy.current.join(',')}]`)
    console.log(`
    last game turns (PC/Algo): ${statsManager.last.turns.map(turn => `(${turn[0]}/${turn[1]})`)}
    last game winner: ${statsManager.last.result}
    `)
    console.log(`
    games pack wins:
    pc: ${parseFloat(`${result[Winner.PC]/options.gamesCount*100}`).toFixed(2)}%
    al: ${parseFloat(`${result[Winner.Algo]/options.gamesCount*100}`).toFixed(2)}%
    dr: ${parseFloat(`${result[Winner.Draw]/options.gamesCount*100}`).toFixed(2)}%
    `)

    if(result[Winner.Algo]>=result[Winner.PC]) {
      algoWinsCount++;
    }
    if(gamesCount>options.gamePacksCount) {
      algoWinsCount = 0;
      gamesCount = 0;
      algoTurnStrategy.callAfterGamePart();
    }
    statsManager.reset()
  }



}

startGamePacks({
  gamesCount: 100000,
  turnsCount: 11,
  gamePacksCount: 1000,
  pcTurn: randomTurn,
})