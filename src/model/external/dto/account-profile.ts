import { AccountRole } from "@src/model/type/account-role";
import { Language } from "@src/model/type/language";
import { DateString } from "@src/util/domain-types";

export interface AccountProfileDto {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    language: Language;
    role: AccountRole;
    createdAt: DateString;
}