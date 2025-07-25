import { Sql } from "@src/db";
import { Account } from "@src/model/internal/account";
import { AccountDaoInterface } from "@src/model/internal/interface/account.interface";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { AccountRole } from "@src/model/type/account-role";

export class AccountMapper {

    private static JOIN_CHAR = ",";

    constructor(private readonly sql: Sql) {}

    async create(publicId: string, hashedEmail: string, displayName: string, roles: AccountRole[]): Promise<Account> {
        const rolesString = roles.join(AccountMapper.JOIN_CHAR);
        const result = await this.sql<IdInterface[]>`insert into account (public_id, hashed_email, display_name, roles) values (${ publicId }, ${ hashedEmail }, ${ displayName }, ${ rolesString }) returning id`;
        if (result.length !== 1) {
            this.throwCreateError();
        }

        const createdAccount = await this.getById(result[0].id);
        if (createdAccount === null) {
            this.throwCreateError();
        }

        return createdAccount as Account;
    }

    async getById(id: number): Promise<Account | null> {
        const result = await this.sql<AccountDaoInterface[]>`${ this.commonAccountSelect() } where id = ${ id }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    async getByPublicId(publicId: string): Promise<Account | null> {
        const result = await this.sql<AccountDaoInterface[]>`${ this.commonAccountSelect() } where public_id = ${ publicId }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    async getByHashedEmail(hashedEmail: string): Promise<Account | null> {
        const result = await this.sql<AccountDaoInterface[]>`${ this.commonAccountSelect() } where hashed_email = ${ hashedEmail }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    private commonAccountSelect() {
        return this.sql`select id, public_id, hashed_email, display_name, enabled, created_at from account`;
    }

    private convertToEntity(item: AccountDaoInterface): Account {
        return {
            id: item.id,
            publicId: item.publicId,
            hashedEmail: item.hashedEmail,
            displayName: item.displayName,
            roles: item.roles.split(AccountMapper.JOIN_CHAR) as AccountRole[],
            enabled: item.enabled,
            createdAt: item.createdAt,
        }
    }

    private throwCreateError() {
        throw new Error(`Failed to create account`);
    }

}