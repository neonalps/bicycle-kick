import { PaginationQueryParams } from "@src/module/pagination/constants";
import { ArrayItemsString } from "@src/util/domain-types";

export interface GetPlayerAppearancesRequestDto extends PaginationQueryParams {
    forMain: boolean;
    competitions?: ArrayItemsString,
    seasons?: ArrayItemsString,
    opponents?: ArrayItemsString,
}