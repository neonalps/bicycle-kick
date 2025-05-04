import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";
import { BookableOffence } from "@src/model/type/bookable-offence";
import { PersonInputDto } from "./person-input";

export interface CreateYellowCardGameEventDto extends CreateGameEventDto {
    type: GameEventType.YellowCard;
    affectedPlayer?: PersonInputDto;
    affectedManager?: PersonInputDto;
    reason?: BookableOffence;
    notOnPitch?: boolean;
}