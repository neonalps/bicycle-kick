import { GameEvent } from "./game-event";

export interface PenaltyShootOutGameEvent extends GameEvent {
    scoreMain: number;
    scoreOpponent: number;
    result: string;
    takenBy: number;
    goalkeeper: number;
}