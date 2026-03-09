import { AccountId } from "@src/util/domain-types";

export class MagicLinkService {

    async createMagicLink(accountId: AccountId): Promise<string> {
        return "abcd-" + accountId;
    }

}