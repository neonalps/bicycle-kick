import { BookableOffence } from "@src/model/type/bookable-offence";
import { BasicPersonDto } from "./basic-person";
import { GameEventDto } from "./game-event";

export interface SecondYellowGameEvent extends GameEventDto {
    player: BasicPersonDto;
    reason?: BookableOffence;
}