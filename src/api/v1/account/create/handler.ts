import { AccountDto } from "@src/model/external/dto/account";
import { CreateAccountRequestDto } from "@src/model/external/dto/create-account-request";
import { AccountService } from "@src/module/account/service";
import { ApiHelperService } from "@src/module/api-helper/service";
import { MagicLinkService } from "@src/module/auth/magic-link.service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { unawaited } from "@src/util/promise";

export class CreateAccountRouteHandler implements RouteHandler<CreateAccountRequestDto, AccountDto> {

    constructor(
        private readonly accountService: AccountService,
        private readonly apiHelper: ApiHelperService,
        private readonly magicLinkService: MagicLinkService,
    ) {}

    public async handle(_: AuthenticationContext, dto: CreateAccountRequestDto): Promise<AccountDto> {
        const account = await this.accountService.create({
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            language: dto.language,
            gameMinuteFormat: dto.gameMinuteFormat,
            scoreFormat: dto.scoreFormat,
            dateFormat: null,
            role: dto.role,
        })

        if (!dto.skipInvitationMail) {
            unawaited(this.magicLinkService.sendMagicInvitationMail(account.id, account.email))
        }

        return this.apiHelper.convertAccountToDto(account);
    }

}