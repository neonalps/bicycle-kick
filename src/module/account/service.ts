import { Account } from "@src/model/internal/account";
import { AccountMapper } from "./mapper";
import { CreateAccountDto } from "@src/model/internal/create-account";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { UuidSource } from "@src/util/uuid";
import { AccountRole } from "@src/model/type/account-role";
import { PaginationParams } from "../pagination/constants";
import { AccountId } from "@src/util/domain-types";
import { UpdateAccountProfileDto } from "@src/model/external/dto/update-account-profile";

export interface GetAccountPaginationParams extends PaginationParams<AccountId> {
    search?: string;
    role?: AccountRole;
}

export class AccountService {

    constructor(
        private readonly mapper: AccountMapper, 
        private readonly uuidSource: UuidSource
    ) {}

    async getOrCreate(email: string, firstName?: string, lastName?: string): Promise<Account> {
        validateNotBlank(email, "email");

        const existingAccount = await this.mapper.getByEmail(email);
        if (existingAccount !== null) {
            if (existingAccount.enabled === false) {
                throw new Error(`Account is disabled`);
            }

            return existingAccount;
        }

        return await this.create({ publicId: this.uuidSource.getRandom(), email, firstName, lastName });
    }

    async getAllPaginated(paginationParams: GetAccountPaginationParams): Promise<Account[]> {
        validateNotNull(paginationParams, "paginationParams");

        return await this.mapper.getAllPaginated(paginationParams);
    }

    async create(dto: CreateAccountDto): Promise<Account> {
        validateNotNull(dto, "dto");
        validateNotBlank(dto.publicId, "dto.publicId");
        validateNotBlank(dto.email, "dto.email");

        return await this.mapper.create(dto.publicId, dto.email, dto.firstName, dto.lastName, true, AccountRole.Substitute);
    }

    async getById(id: AccountId): Promise<Account | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async requireById(id: AccountId): Promise<Account> {
        const account = await this.getById(id);
        if (account === null) {
            throw new Error(`No account with ID ${id} found`);
        }
        return account;
    }

    async getByPublicId(publicId: string): Promise<Account | null> {
        validateNotBlank(publicId, "publicId");

        return await this.mapper.getByPublicId(publicId);
    }

    async updateProfile(id: AccountId, update: UpdateAccountProfileDto): Promise<void> {
        validateNotNull(id, "id");
        validateNotNull(update, "update");
        validateNotNull(update.firstName, "update.firstName");
        validateNotNull(update.lastName, "update.lastName");
        validateNotBlank(update.language, "update.language");
        validateNotBlank(update.dateFormat, "update.dateFormat");
        validateNotBlank(update.scoreFormat, "update.scoreFormat");
        validateNotBlank(update.gameMinuteFormat, "update.gameMinuteFormat");

        await this.mapper.updateProfile(id, update);
    }

}