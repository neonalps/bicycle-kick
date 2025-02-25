import { BasicPersonDto } from "./basic-person";
import { GameEventDto } from "./game-event";

export interface PenaltyMissedGameEvent extends GameEventDto {
    penaltyTaker: BasicPersonDto;
    reason: 'post' | 'crossbar' | 'wide' | 'high';
}