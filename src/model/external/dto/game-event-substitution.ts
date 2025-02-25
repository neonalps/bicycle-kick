import { BasicPersonDto } from "./basic-person";
import { GameEventDto } from "./game-event";

export interface SubstitutionGameEvent extends GameEventDto {
    playerOff: BasicPersonDto;
    playerOn: BasicPersonDto;
    injured?: boolean;
}