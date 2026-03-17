import { LinkTokenMapper } from "./mapper";
import { LinkToken } from "@src/model/internal/link-token";
import { AccountId, LinkTokenId } from "@src/util/domain-types";
import { TokenConfig } from "@src/module/auth/service";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { UuidSource } from "@src/util/uuid";
import { TimeSource } from "@src/util/time";
import { LinkTokenType } from "@src/model/type/link-token";

export class LinkTokenService {

    constructor(
        private readonly mapper: LinkTokenMapper,
        private readonly timeSource: TimeSource,
        private readonly tokenConfig: TokenConfig,
        private readonly uuidSource: UuidSource,
    ) {}

    async createLoginToken(accountId: AccountId): Promise<LinkToken> {
        validateNotNull(accountId, "accountId");

        const tokenValue = this.uuidSource.getRandom();
        const validUntil = this.timeSource.getNowPlusSeconds(this.tokenConfig.loginTokenValiditySeconds);

        const createdTokenId = await this.mapper.create({
            accountId: accountId,
            tokenType: LinkTokenType.Login,
            tokenValue: tokenValue,
            validUntil: validUntil.toISOString(),
        });

        return await this.requireById(createdTokenId);
    }

    async getValidByTokenValue(tokenValue: string): Promise<LinkToken | null> {
        validateNotBlank(tokenValue, "tokenValue");

        return await this.mapper.getValidByTokenValue(tokenValue, this.timeSource.getNow());
    }

    async deleteById(linkTokenId: LinkTokenId): Promise<void> {
        validateNotNull(linkTokenId, "linkTokenId");

        return await this.mapper.deleteById(linkTokenId);
    }

    async deleteExpiredTokens(validUntilBefore = new Date()): Promise<void> {
        validateNotNull(validUntilBefore, "validUntilBefore");

        return await this.mapper.deleteExpiredTokens(validUntilBefore);
    }

    private async requireById(linkTokenId: LinkTokenId): Promise<LinkToken> {
        const token = await this.mapper.getById(linkTokenId);
        if (token === null) {
            throw new Error(`No link token with ID ${linkTokenId} found`);
        }
        return token;
    }

}