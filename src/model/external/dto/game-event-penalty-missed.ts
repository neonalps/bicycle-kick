import { PenaltyMissedReason } from "@src/model/type/penalty-missed-reason";
import { GameEventDto } from "./game-event";
import { SmallPersonDto } from "./small-person";

export interface PenaltyMissedGameEventDto extends GameEventDto {
    takenBy: number;
    takenByPerson: SmallPersonDto;
    reason: PenaltyMissedReason;
}