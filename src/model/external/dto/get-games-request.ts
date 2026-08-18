import { Tendency } from "@src/model/type/tendency";
import { PaginationQueryParams } from "@src/module/pagination/constants";

export interface GetGamesRequestDto extends PaginationQueryParams {
    competitionId?: string;
    opponentId?: string;
    seasonId?: string;
    tendency?: Tendency;
}