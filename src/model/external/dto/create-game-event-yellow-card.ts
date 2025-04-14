import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";
import { BookableOffence } from "@src/model/type/bookable-offence";

export interface CreateYellowCardGameEventDto extends CreateGameEventDto {
    type: GameEventType.YellowCard;
    affectedPlayer: number;
    reason?: BookableOffence;
}