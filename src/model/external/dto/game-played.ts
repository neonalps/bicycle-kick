import { BasicGameDto } from "./basic-game";

export interface GamePlayedDto {
    game: BasicGameDto;
    starting?: boolean;
    captain?: boolean;
    shirt?: number;
    minutesPlayed?: number;
    goalsScored?: number;
    assists?: number;
    ownGoals?: number;
    goalsConceded?: number;
    regulationPenaltiesTaken?: [number, number];
    regulationPenaltiesFaced?: [number, number];
    psoPenaltiesTaken?: [number, number];
    psoPenaltiesFaced?: [number, number];
    yellowCard?: boolean;
    yellowRedCard?: boolean;
    redCard?: boolean;
}