import { Sql } from "@src/db";
import { CreateLinkToken } from "@src/model/internal/create-link-token";
import { LinkTokenDaoInterface } from "@src/model/internal/interface/link-token.interface";
import { LinkToken } from "@src/model/internal/link-token";
import { LinkTokenType } from "@src/model/type/link-token";
import { LinkTokenId } from "@src/util/domain-types";

export class LinkTokenMapper {

    constructor(private readonly sql: Sql) {}

    async create(createToken: CreateLinkToken): Promise<LinkTokenId> {
        const result = await this.sql`insert into link_token ${ this.sql(createToken, 'accountId', 'tokenType', 'tokenValue', 'validUntil') } returning id`;
        if (result.length !== 1) {
            throw new Error(`Failed to insert link token`);
        }

        return result[0].id;
    }

    async getById(id: LinkTokenId): Promise<LinkToken | null> {
        const result = await this.sql<LinkTokenDaoInterface[]>`select * from link_token where id = ${ id }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    async getValidByTokenValue(tokenValue: string, validUntilToCompare: Date): Promise<LinkToken | null> {
        const result = await this.sql<LinkTokenDaoInterface[]>`select * from link_token where token_value = ${ tokenValue } and valid_until >= ${validUntilToCompare}`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    async deleteExpiredTokens(validUntilBefore: Date): Promise<void> {
        await this.sql`delete from link_token where valid_until < ${validUntilBefore}`;
    }

    async deleteById(linkTokenId: LinkTokenId): Promise<void> {
        await this.sql`delete from link_token where id = ${linkTokenId}`;
    }

    private convertToEntity(item: LinkTokenDaoInterface): LinkToken {
        return {
            id: item.id,
            accountId: item.accountId,
            tokenType: item.tokenType as LinkTokenType,
            tokenValue: item.tokenValue,
            validUntil: new Date(item.validUntil),
            createdAt: new Date(item.createdAt),
        }
    }

}