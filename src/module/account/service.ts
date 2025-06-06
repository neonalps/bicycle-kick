import { Account } from "@src/model/internal/account";
import { AccountMapper } from "./mapper";
import { CreateAccountDto } from "@src/model/internal/create-account";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { CryptoService } from "../crypto/service";
import { UuidSource } from "@src/util/uuid";
import { AccountRole } from "@src/model/type/account-role";

export class AccountService {

    constructor(
        private readonly mapper: AccountMapper, 
        private readonly cryptoService: CryptoService, 
        private readonly uuidSource: UuidSource
    ) {}

    async getOrCreate(email: string, displayName?: string): Promise<Account> {
        validateNotBlank(email, "email");

        const hashedEmail = this.cryptoService.hash(email);
        const existingAccount = await this.mapper.getByHashedEmail(hashedEmail);
        if (existingAccount !== null) {
            if (existingAccount.enabled === false) {
                throw new Error(`Account is disabled`);
            }

            return existingAccount;
        }

        return await this.create({ publicId: this.uuidSource.getRandom(), hashedEmail, displayName: displayName ?? "" })
    }

    async create(dto: CreateAccountDto): Promise<Account> {
        validateNotNull(dto, "dto");
        validateNotBlank(dto.publicId, "dto.publicId");
        validateNotBlank(dto.displayName, "dto.displayName");
        validateNotBlank(dto.hashedEmail, "dto.hashedEmail");

        return await this.mapper.create(dto.publicId, dto.hashedEmail, dto.displayName, [AccountRole.Substitute]);
    }

    async getByPublicId(publicId: string): Promise<Account | null> {
        validateNotBlank(publicId, "publicId");

        return await this.mapper.getByPublicId(publicId);
    }

}