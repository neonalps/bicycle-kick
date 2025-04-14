import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";
import { BookableOffence } from "@src/model/type/bookable-offence";

export interface CreateYellowRedCardGameEventDto extends CreateGameEventDto {
    type: GameEventType.YellowRedCard;
    affectedPlayer: number;
    reason?: BookableOffence;
}