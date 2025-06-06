import { ExpulsionReason } from "@src/model/type/expulsion-reason";
import { GameEvent } from "./game-event";

export interface ExpulsionGameEvent extends GameEvent {
    affectedPlayer?: number;
    affectedManager?: number;
    reason?: ExpulsionReason;
}