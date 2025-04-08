import { BasicPersonDto } from "./basic-person";
import { GameEventDto } from "./game-event";

export interface PenaltyMissedGameEventDto extends GameEventDto {
    penaltyTaker: BasicPersonDto;
    reason: 'post' | 'crossbar' | 'wide' | 'high';
}