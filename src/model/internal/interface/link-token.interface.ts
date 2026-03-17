import { AccountId, DateString, LinkTokenId } from "@src/util/domain-types";

export interface LinkTokenDaoInterface {
    id: LinkTokenId;
    accountId: AccountId;
    tokenType: string;
    tokenValue: string;
    validUntil: DateString;
    createdAt: DateString;
}