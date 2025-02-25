import { GameEventType } from "./game-event-type";

export interface GameEventDto {
    id: number;
    type: GameEventType;
    sortOrder: number;
    minute: string;
}