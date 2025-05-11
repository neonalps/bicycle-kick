import { ExpulsionReason } from "@src/model/type/expulsion-reason";
import { GameEventDto } from "./game-event";
import { SmallPersonDto } from "./small-person";

export interface RedCardGameEventDto extends GameEventDto {
    affectedPlayer?: SmallPersonDto;
    affectedManager?: SmallPersonDto;
    reason?: ExpulsionReason;
}