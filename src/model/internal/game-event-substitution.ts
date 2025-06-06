import { GameEvent } from "./game-event";

export interface SubstitutionGameEvent extends GameEvent {
    playerOn: number;
    playerOff: number;
    injured?: boolean;
}