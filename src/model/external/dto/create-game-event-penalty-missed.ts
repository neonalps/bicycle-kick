import { PenaltyMissedReason } from "@src/model/type/penalty-missed-reason";
import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";

export interface CreatePenaltyMissedGameEventDto extends CreateGameEventDto {
    type: GameEventType.PenaltyMissed;
    reason: PenaltyMissedReason;
    takenBy: number;
    goalkeeper: number;
}