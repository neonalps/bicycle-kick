import { GameEventType } from "@src/model/external/dto/game-event-type";
import { GameMinute } from "./game-minute";

export interface GameEvent {
    id: number;
    eventType: GameEventType;
    sortOrder: number;
    minute: GameMinute;
}