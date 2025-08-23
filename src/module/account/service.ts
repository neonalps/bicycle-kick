import { Account } from "@src/model/internal/account";
import { AccountMapper } from "./mapper";
import { CreateAccountDto } from "@src/model/internal/create-account";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { UuidSource } from "@src/util/uuid";
import { AccountRole } from "@src/model/type/account-role";
import { PaginationParams } from "../pagination/constants";
import { AccountId } from "@src/util/domain-types";

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

    async getByPublicId(publicId: string): Promise<Account | null> {
        validateNotBlank(publicId, "publicId");

        return await this.mapper.getByPublicId(publicId);
    }

}