import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { MailService } from "@src/module/mail/service";
import { SendMagicLinkMailRequestDto } from "@src/model/external/dto/send-magic-link-request";
import { AccountService } from "@src/module/account/service";
import { unawaited } from "@src/util/promise";
import { Account } from "@src/model/internal/account";
import { AuthService } from "@src/module/auth/service";

export class SendMagicLinkHandler implements RouteHandler<SendMagicLinkMailRequestDto, void> {

    constructor(
        private readonly accountService: AccountService,
        private readonly authService: AuthService,
        private readonly mailService: MailService,
    ) {}

    public async handle(_: AuthenticationContext, dto: SendMagicLinkMailRequestDto): Promise<void> {
        const account = await this.accountService.getByEmail(dto.email);
        if (account === null) {
            // we don't want to throw an error
            return;
        }

        unawaited(this.createAndSendMagicLoginLinkMail(account));
    }

    private async createAndSendMagicLoginLinkMail(account: Account): Promise<void> {
        const magicLink = this.authService.createSignedLoginToken(account.publicId);
        await this.mailService.sendMagicLinkLoginMail(account.email, { loginLink: magicLink });
    }

}