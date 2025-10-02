import { Sql } from "@src/db";
import { Account } from "@src/model/internal/account";
import { AccountDaoInterface } from "@src/model/internal/interface/account.interface";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { AccountRole } from "@src/model/type/account-role";
import { GetAccountPaginationParams } from "./service";
import { SortOrder } from "@src/module/pagination/constants";
import { isDefined } from "@src/util/common";
import { AccountId } from "@src/util/domain-types";
import { UpdateAccountProfileDto } from "@src/model/external/dto/update-account-profile";
import { Language } from "@src/model/type/language";
import { DateFormat } from "@src/model/type/date-format";
import { ScoreFormat } from "@src/model/type/score-format";
import { GameMinuteFormat } from "@src/model/type/game-minute-format";

export class AccountMapper {

    constructor(private readonly sql: Sql) {}

    async create(publicId: string, email: string, firstName: string | undefined, lastName: string | undefined, enabled: boolean, role: AccountRole): Promise<Account> {
        const insertInput = {
            publicId,
            email,
            firstName,
            lastName,
            enabled,
            roles: role,
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

    async getAllPaginated(params: GetAccountPaginationParams): Promise<Account[]> {
        const optionalWildcardSearch = isDefined(params.search) ? `%${params.search}%` : undefined;

        const result = await this.sql<AccountDaoInterface[]>`
            ${ this.commonAccountSelect() }
            where
                id ${params.order === SortOrder.Ascending ? this.sql`>` : this.sql`<`} ${ params.lastSeen }
                ${isDefined(params.role) ? this.sql` and roles = ${params.role}` : this.sql``}
                ${isDefined(optionalWildcardSearch) ? this.sql` and email ilike ${optionalWildcardSearch} or first_name ilike ${optionalWildcardSearch} or last_name ilike ${optionalWildcardSearch}` : this.sql``}
            order by
                id ${ this.determineSortOrder(params.order) }
            limit
                ${ params.limit }
        `;

        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    async updateProfile(accountId: AccountId, update: UpdateAccountProfileDto): Promise<void> {
        const updateAccount = {
            firstName: update.firstName,
            lastName: update.lastName,
            language: update.language,
            dateFormat: update.dateFormat,
            scoreFormat: update.scoreFormat,
            gameMinuteFormat: update.gameMinuteFormat,
        }

        await this.sql`update account set ${ this.sql(updateAccount, 'firstName', 'lastName', 'language', 'dateFormat', 'scoreFormat', 'gameMinuteFormat') } where id = ${accountId}`;
    }

    private commonAccountSelect() {
        return this.sql`select id, public_id, email, first_name, last_name, enabled, has_profile_picture, language, date_format, score_format, game_minute_format, created_at, roles from account`;
    }

    private convertToEntity(item: AccountDaoInterface): Account {
        return {
            id: item.id,
            publicId: item.publicId,
            email: item.email,
            firstName: item.firstName,
            lastName: item.lastName,
            roles: item.roles as AccountRole,
            hasProfilePicture: item.hasProfilePicture,
            language: item.language as Language,
            dateFormat: item.dateFormat as DateFormat,
            scoreFormat: item.scoreFormat as ScoreFormat,
            gameMinuteFormat: item.gameMinuteFormat as GameMinuteFormat,
            enabled: item.enabled,
            createdAt: item.createdAt,
        }
    }

    private determineSortOrder(order: SortOrder) {
        return order === SortOrder.Descending ? this.sql`desc` : this.sql`asc`;
    }

    private throwCreateError() {
        throw new Error(`Failed to create account`);
    }

}