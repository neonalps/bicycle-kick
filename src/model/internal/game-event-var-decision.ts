import { GameEvent } from "./game-event";

export interface VarDecisionGameEvent extends GameEvent {
    decision: string;
    affectedPlayer: number;
}