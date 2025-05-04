import { BookableOffence } from "@src/model/type/bookable-offence";
import { GameEvent } from "./game-event";

export interface YellowRedCardGameEvent extends GameEvent {
    affectedPlayer?: number;
    affectedManager?: number;
    reason: BookableOffence;
    notOnPitch?: boolean;
}