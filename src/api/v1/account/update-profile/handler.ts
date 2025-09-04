import { AccountProfileDto } from "@src/model/external/dto/account-profile";
import { UpdateAccountProfileDto } from "@src/model/external/dto/update-account-profile";
import { AccountService } from "@src/module/account/service";
import { ApiHelperService } from "@src/module/api-helper/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { ensureNotNullish } from "@src/util/common";

export class UpdateAccountProfileRouteHandler implements RouteHandler<UpdateAccountProfileDto, AccountProfileDto> {

    constructor(
        private readonly accountService: AccountService,
        private readonly apiHelperService: ApiHelperService,
    ) {}

    public async handle(context: AuthenticationContext, dto: UpdateAccountProfileDto): Promise<AccountProfileDto> {
        const accountId = ensureNotNullish(context.account).id;

        await this.accountService.updateProfile(accountId, dto);

        const updatedProfile = await this.accountService.requireById(accountId);
        return this.apiHelperService.convertAccountToProfileDto(updatedProfile);
    }

}