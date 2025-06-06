import { PaginationQueryParams } from "@src/module/pagination/constants";

export interface GetSeasonGamesRequestDto extends PaginationQueryParams {
    seasonId: number;
}