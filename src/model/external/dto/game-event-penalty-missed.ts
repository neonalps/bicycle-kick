import { PenaltyMissedReason } from "@src/model/type/penalty-missed-reason";
import { GameEventDto } from "./game-event";

export interface PenaltyMissedGameEventDto extends GameEventDto {
    takenBy: number;
    goalkeeper: number;
    reason: PenaltyMissedReason;
}