import { PenaltyMissedReason } from "@src/model/type/penalty-missed-reason";
import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";
import { PersonInputDto } from "./person-input";

export interface CreatePenaltyMissedGameEventDto extends CreateGameEventDto {
    type: GameEventType.PenaltyMissed;
    reason?: PenaltyMissedReason;
    takenBy: PersonInputDto;
    goalkeeper: PersonInputDto;
    saved: boolean;
}