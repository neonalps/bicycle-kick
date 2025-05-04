import { ExpulsionReason } from "@src/model/type/expulsion-reason";
import { GameEventDto } from "./game-event";
import { PersonInputDto } from "./person-input";

export interface RedCardGameEventDto extends GameEventDto {
    affectedPlayer?: PersonInputDto;
    affectedManager?: PersonInputDto;
    reason?: ExpulsionReason;
}