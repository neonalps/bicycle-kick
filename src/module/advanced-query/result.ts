import { Game } from "@src/model/internal/game";
import { Answer } from "./answer/composer";

export interface AdvancedQueryResult {
    games: Game[];
    query: string;      // TODO remove
    answer: Answer;
}