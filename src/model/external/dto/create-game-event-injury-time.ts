import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";

export interface CreateInjuryTimeGameEventDto extends CreateGameEventDto {
    type: GameEventType.InjuryTime;
    additionalMinutes: number;
}