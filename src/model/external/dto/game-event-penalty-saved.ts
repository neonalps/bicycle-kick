import { BasicPersonDto } from "./basic-person";
import { GameEventDto } from "./game-event";

export interface PenaltySavedGameEvent extends GameEventDto {
    penaltyTaker: BasicPersonDto;
    savedBy: BasicPersonDto;
}