import { GameEventType } from "@src/model/external/dto/game-event-type";

export interface GameEvent {
    id: number;
    eventType: GameEventType;
    sortOrder: number;
    minute: string;
}