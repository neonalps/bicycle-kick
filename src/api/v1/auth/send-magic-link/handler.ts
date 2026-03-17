import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { SendMagicLinkMailRequestDto } from "@src/model/external/dto/send-magic-link-request";
import { AccountService } from "@src/module/account/service";
import { unawaited } from "@src/util/promise";
import { MagicLinkService } from "@src/module/auth/magic-link.service";

export class SendMagicLinkHandler implements RouteHandler<SendMagicLinkMailRequestDto, void> {

    constructor(
        private readonly accountService: AccountService,
        private readonly magicLinkService: MagicLinkService,
    ) {}

    public async handle(_: AuthenticationContext, dto: SendMagicLinkMailRequestDto): Promise<void> {
        const account = await this.accountService.getByEmail(dto.email);
        if (account === null || !account.enabled) {
            // we don't want to throw an error
            return;
        }

        unawaited(this.magicLinkService.sendMagicLoginLinkMail(account.id, account.email));
    }

}