import { Game } from "@src/model/internal/game";
import { GameEvent } from "@src/model/internal/game-event";
import { GoalGameEvent } from "@src/model/internal/game-event-goal";

export interface PostProcessingHandler {
    order: number;
    games?: (game: Game) => boolean;
    gameEvents?: (event: GameEvent) => boolean;
    goalGameEvents?: (event: GoalGameEvent) => boolean;
}