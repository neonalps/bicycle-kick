import { GameEvent } from "@src/model/internal/game-event";
import { PostProcessingFilter } from "./processing-filter";

export interface GameEventPostProcessingFilter extends PostProcessingFilter {
    process(input: GameEvent): boolean;
}