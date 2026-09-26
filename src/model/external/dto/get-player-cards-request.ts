import { PaginationQueryParams } from "@src/module/pagination/constants";
import { ArrayItemsString } from "@src/util/domain-types";

export interface GetPlayerCardsRequestDto extends PaginationQueryParams {
    forMain: boolean;
    competitions?: ArrayItemsString,
    seasons?: ArrayItemsString,
    opponents?: ArrayItemsString,
}