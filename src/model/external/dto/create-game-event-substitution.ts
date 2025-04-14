import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";

export interface CreateSubstitutionGameEventDto extends CreateGameEventDto {
    type: GameEventType.Substitution;
    playerOn: number;
    playerOff: number;
    injured?: boolean;
}