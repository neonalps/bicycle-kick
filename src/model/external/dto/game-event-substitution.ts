import { GameEventDto } from "./game-event";
import { SmallPersonDto } from "./small-person";

export interface SubstitutionGameEventDto extends GameEventDto {
    playerOn: SmallPersonDto;
    playerOff: SmallPersonDto;
    injured?: boolean;
}