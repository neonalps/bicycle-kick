import { CreateGameEventDto } from "./create-game-event";
import { GameEventType } from "./game-event-type";
import { PersonInputDto } from "./person-input";

export interface CreateSubstitutionGameEventDto extends CreateGameEventDto {
    type: GameEventType.Substitution;
    playerOn: PersonInputDto;
    playerOff: PersonInputDto;
    injured?: boolean;
}