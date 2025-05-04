import { GameEvent } from "./game-event";

export interface InjuryTimeGameEvent extends GameEvent {
    additionalMinutes: number;
}