import { Figure, Winner } from "./run"

export type GameStat = {
  turns: [Figure, Figure][],
  result: Winner,
}

export class GameStatsManager {
  data: GameStat[] = []


  add(stat: GameStat) {
    this.data.push(stat);
  }

  reset() {
    this.data = []
  }

  get last() {
    return this.data[this.data.length - 1]
  }

  getLasts(count: number) {
    const results: GameStat[] = []
    const minSize = this.data.length < count ? 0 : this.data.length - count

    for(let x = minSize; x<this.data.length; x++) {
      results.push(this.data[x]);
    }

    return results
  }
}
