import { ExpulsionReason } from "@src/model/type/expulsion-reason";
import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";
import { PersonInputDto } from "./person-input";

export interface CreateRedCardGameEventDto extends CreateGameEventDto {
    type: GameEventType.RedCard;
    affectedPlayer?: PersonInputDto;
    affectedManager?: PersonInputDto;
    reason?: ExpulsionReason;
    notOnPitch?: boolean;
}