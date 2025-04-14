import { GameEventType } from "./game-event-type";

export interface CreateGameEventDto {
    type: GameEventType;
    sortOrder: number;
    minute: string;
}