import { PaginationQueryParams } from "@src/module/pagination/constants";

export interface GetGamesPlayedRequestDto extends PaginationQueryParams {
    personId: number;
    competitionId?: number;
    seasonId?: number;
    goalsScored?: number;
    assists?: number;
    goalsConceded?: number;
    ownGoals?: number;
    isCaptain?: boolean;
    isStarting?: boolean;
    yellowCard?: boolean;
    yellowRedCard?: boolean;
    redCard?: boolean;
    regulationPenaltiesTaken?: number;
    regulationPenaltiesScored?: number;
    regulationPenaltiesFaced?: number;
    regulationPenaltiesSaved?: number;
    psoPenaltiesTaken?: number;
    psoPenaltiesScored?: number;
    psoPenaltiesFaced?: number;
    psoPenaltiesSaved?: number;
}