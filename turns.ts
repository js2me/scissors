import random from "random";
import { Turn, Figure } from "./run"

export const randomTurn: Turn = () => random.int(0, 2)
export const singleFigureTurn: Turn = () => Figure.PAPER