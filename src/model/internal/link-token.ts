import { AccountId, LinkTokenId } from "@src/util/domain-types";
import { LinkTokenType } from "@src/model/type/link-token";

export interface LinkToken {
    id: LinkTokenId;
    accountId: AccountId;
    tokenType: LinkTokenType;
    tokenValue: string;
    validUntil: Date;
    createdAt: Date;
}