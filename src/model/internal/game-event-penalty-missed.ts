import { PenaltyMissedReason } from "@src/model/type/penalty-missed-reason";
import { GameEvent } from "./game-event";

export interface PenaltyMissedGameEvent extends GameEvent {
    takenBy: number;
    reason: PenaltyMissedReason;
}