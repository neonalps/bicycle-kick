import { AccountRole } from "@src/model/type/account-role";
import { DateString } from "@src/util/domain-types";

export interface AccountDto {
    id: number;
    publicId: string;
    email: string;
    enabled: boolean;
    firstName?: string;
    lastName?: string;
    role: AccountRole;
    createdAt: DateString;
}