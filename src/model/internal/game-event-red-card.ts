import { GameEvent } from "./game-event";
import { ExpulsionReason } from "@src/model/type/expulsion-reason";

export interface RedCardGameEvent extends GameEvent {
    affectedPlayer?: number;
    affectedManager?: number;
    reason: ExpulsionReason;
    notOnPitch?: boolean;
}