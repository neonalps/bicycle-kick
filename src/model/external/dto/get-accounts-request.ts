import { AccountRole } from "@src/model/type/account-role";
import { PaginationQueryParams } from "@src/module/pagination/constants";

export interface GetAccountsRequestDto extends PaginationQueryParams {
    search?: string;
    role?: AccountRole;
}