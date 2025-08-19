import { Sql } from "@src/db";
import { Account } from "@src/model/internal/account";
import { AccountDaoInterface } from "@src/model/internal/interface/account.interface";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { AccountRole } from "@src/model/type/account-role";

export class AccountMapper {

    constructor(private readonly sql: Sql) {}

    async create(publicId: string, email: string, firstName: string | undefined, lastName: string | undefined, enabled: boolean, roles: AccountRole[]): Promise<Account> {
        const insertInput = {
            publicId,
            email,
            firstName,
            lastName,
            enabled,
            roles,
        };

        const result = await this.sql<IdInterface[]>`insert into account ${ this.sql(insertInput) } returning id`;
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

    async getByEmail(email: string): Promise<Account | null> {
        const result = await this.sql<AccountDaoInterface[]>`${ this.commonAccountSelect() } where email = ${ email }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    private commonAccountSelect() {
        return this.sql`select id, public_id, email, first_name, last_name, enabled, created_at, roles from account`;
    }

    private convertToEntity(item: AccountDaoInterface): Account {
        return {
            id: item.id,
            publicId: item.publicId,
            email: item.email,
            firstName: item.firstName,
            lastName: item.lastName,
            roles: item.roles as AccountRole[],
            enabled: item.enabled,
            createdAt: item.createdAt,
        }
    }

    private throwCreateError() {
        throw new Error(`Failed to create account`);
    }

}