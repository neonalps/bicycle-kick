import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";

export interface CreatePenaltySavedGameEventDto extends CreateGameEventDto {
    type: GameEventType.PenaltyMissed;
    takenBy: number;
    goalkeeper: number;
}