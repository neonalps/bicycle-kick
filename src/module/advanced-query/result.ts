import { Game } from "@src/model/internal/game";

export interface AdvancedQueryResult {
    games: Game[];
    query: string;      // TODO remove
}