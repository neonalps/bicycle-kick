import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { MagicLinkService } from "@src/module/auth/magic-link.service";
import { MailService } from "@src/module/mail/service";
import { ensureNotNullish } from "@src/util/common";

export class SendMagicLinkHandler implements RouteHandler<void, void> {

    constructor(
        private readonly magicLinkService: MagicLinkService,
        private readonly mailService: MailService,
    ) {}

    public async handle(authContext: AuthenticationContext): Promise<void> {
        const { id: accountId, email } = ensureNotNullish(authContext.account);

        const magicLink = await this.magicLinkService.createMagicLink(accountId);
        await this.mailService.sendMagicLinkLoginMail(email, { loginLink: magicLink });
    }

}