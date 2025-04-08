import { BasicPersonDto } from "./basic-person";
import { GameEventDto } from "./game-event";

export interface PenaltySavedGameEventDto extends GameEventDto {
    penaltyTaker: BasicPersonDto;
    savedBy: BasicPersonDto;
}