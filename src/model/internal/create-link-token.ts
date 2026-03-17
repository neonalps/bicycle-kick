import { LinkTokenType } from "@src/model/type/link-token";
import { AccountId, DateString } from "@src/util/domain-types";

export interface CreateLinkToken {
    accountId: AccountId;
    tokenValue: string;
    tokenType: LinkTokenType;
    validUntil: DateString;
}