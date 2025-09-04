import { AccountRole } from "@src/model/type/account-role";
import { DateFormat } from "@src/model/type/date-format";
import { Language } from "@src/model/type/language";
import { ScoreFormat } from "@src/model/type/score-format";
import { DateString } from "@src/util/domain-types";

export interface AccountProfileDto {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    language: Language;
    dateFormat: DateFormat;
    scoreFormat: ScoreFormat;
    role: AccountRole;
    createdAt: DateString;
}