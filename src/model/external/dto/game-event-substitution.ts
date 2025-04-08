import { GameEvent } from "@src/model/internal/game-event";

export interface SubstitutionGameEventDto extends GameEvent {
    substitutedPlayer: number;
}