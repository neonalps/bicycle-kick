import { BasicPersonDto } from "./basic-person";

export interface GamePlayerDto {
    player: BasicPersonDto;
    shirt: number;
    starter: boolean;
    startingPositionKey?: string;
    minutesPlayed?: number;
    fieldGrid?: string;
}