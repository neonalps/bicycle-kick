import { GameEventDto } from "./game-event";

export interface InjuryTimeGameEventDto extends GameEventDto {
    additionalMinutes: number;
}