import { BookableOffence } from "@src/model/type/bookable-offence";
import { GameEvent } from "./game-event";

export interface YellowCardGameEvent extends GameEvent {
    affectedPlayer?: number;
    affectedManager?: number;
    reason: BookableOffence;
    notOnPitch?: boolean;
}