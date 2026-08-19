import { GameStatus } from "@src/model/type/game-status";
import { Tendency } from "@src/model/type/tendency";
import { PaginationQueryParams } from "@src/module/pagination/constants";

export interface GetGamesRequestDto extends PaginationQueryParams {
    competitionId?: string;
    opponentId?: string;
    seasonId?: string;
    tendency?: Tendency;
    status?: GameStatus;
    isHomeGame?: boolean;
    isNeutralGround?: boolean;
}