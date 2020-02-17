import { Figure } from "./run";

const winCasesMap: Record<Figure, Figure> = {
  [Figure.PAPER]: Figure.ROCK,
  [Figure.SCISSORS]: Figure.PAPER,
  [Figure.ROCK]: Figure.SCISSORS,
}

export class Case {
  static isWin = (figure1: Figure, figure2: Figure) =>
    winCasesMap[figure1] === figure2

  static isDraw = (figure1: Figure, figure2: Figure) =>
    figure1 === figure2
}