import { GameStatus } from "@src/model/type/game-status";
import { PaginationQueryParams } from "@src/module/pagination/constants";

export interface GetGamesRequestDto extends PaginationQueryParams {
    competitionId?: string;
    opponentId?: string;
    seasonId?: string;
    tendency?: string;
    status?: GameStatus;
    isHomeGame?: boolean;
    isNeutralGround?: boolean;
    hasAccountAttended?: boolean;
    hasAccountStarred?: boolean;
}