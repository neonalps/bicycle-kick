import { MailService } from "@src/module/mail/service";
import { LinkTokenService } from "@src/module/link-token/service";
import { AccountId } from "@src/util/domain-types";

export class MagicLinkService {

    constructor(
        private readonly linkTokenService: LinkTokenService,
        private readonly mailService: MailService,
        private readonly config: {
            frontendBaseUrl: string,
        },
    ) {}

    async sendMagicLoginLinkMail(accountId: AccountId, accountEmail: string): Promise<void> {
        const loginToken = await this.linkTokenService.createLoginToken(accountId);
        await this.mailService.sendMagicLinkLoginMail(accountEmail, { loginLink: `${this.config.frontendBaseUrl}/auth/login-with-token?t=${loginToken.tokenValue}` });
    }

}