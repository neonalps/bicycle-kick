import { ExpulsionReason } from "@src/model/type/expulsion-reason";
import { GameEventDto } from "./game-event";

export interface RedCardGameEventDto extends GameEventDto {
    affectedPlayer?: number;
    affectedManager?: number;
    reason?: ExpulsionReason;
    var?: boolean;
}