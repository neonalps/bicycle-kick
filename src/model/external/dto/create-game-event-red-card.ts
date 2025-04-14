import { ExpulsionReason } from "@src/model/type/expulsion-reason";
import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";

export interface CreateRedCardGameEventDto extends CreateGameEventDto {
    type: GameEventType.RedCard;
    affectedPlayer: number;
    reason?: ExpulsionReason;
}