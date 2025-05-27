import { GameEventDto } from "./game-event";

export interface SubstitutionGameEventDto extends GameEventDto {
    playerOn: number;
    playerOff: number;
    injured?: boolean;
}