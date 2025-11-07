import { PaginationQueryParams } from "@src/module/pagination/constants";

export interface GetGamesPlayedRequestDto extends PaginationQueryParams {
    personId: number;
    forMain?: boolean;
    competitionId?: string;
    opponentId?: string;
    seasonId?: string;
    minutesPlayed?: string;
    goalsScored?: string;
    assists?: string;
    goalsConceded?: string;
    ownGoals?: number;
    isCaptain?: boolean;
    isStarting?: boolean;
    yellowCard?: boolean;
    yellowRedCard?: boolean;
    redCard?: boolean;
    regulationPenaltiesTaken?: string;
    regulationPenaltiesScored?: string;
    regulationPenaltiesFaced?: string;
    regulationPenaltiesSaved?: string;
    psoPenaltiesTaken?: string;
    psoPenaltiesScored?: string;
    psoPenaltiesFaced?: string;
    psoPenaltiesSaved?: string;
}