import { BasicPersonDto } from "./basic-person";

export interface GamePlayerDto {
    player: BasicPersonDto;
    minutesPlayed?: number;
    shirtNo: number;
    positionKey: string;
    goalsScored: number;
    assists: number;
    goalsConceded: number;
    isCaptain: boolean;
    ownGoals: number;
    yellowCard: boolean;
    yellowRedCard: boolean;
    redCard: boolean;
    regulationPenaltiesTaken: number;
    regulationPenaltiesScored: number;
    regulationPenaltiesFaced: number;
    regulationPenaltiesSaved: number;
    psoPenaltiesTaken: number;
    psoPenaltiesScored: number;
    psoPenaltiesFaced: number;
    psoPenaltiesSaved: number;
}