import { GameEventDto } from "./game-event";
import { PersonInputDto } from "./person-input";

export interface PenaltyMissedGameEventDto extends GameEventDto {
    takenBy: PersonInputDto;
    goalkeeper: PersonInputDto;
    saved: boolean;
    missReason: 'post' | 'crossbar' | 'wide' | 'high';
}