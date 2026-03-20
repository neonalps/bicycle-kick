import { MailService } from "@src/module/mail/service";
import { LinkTokenService } from "@src/module/link-token/service";
import { AccountId } from "@src/util/domain-types";

export class MagicLinkService {

    private static readonly ONE_WEEK_IN_SECONDS = 604_800;

    constructor(
        private readonly linkTokenService: LinkTokenService,
        private readonly mailService: MailService,
        private readonly config: {
            frontendBaseUrl: string,
        },
    ) {}

    async sendMagicLoginLinkMail(accountId: AccountId, accountEmail: string): Promise<void> {
        const loginToken = await this.linkTokenService.createLoginToken(accountId);
        await this.mailService.sendMagicLinkLoginMail(accountEmail, { loginLink: this.buildFrontendLoginLink(loginToken.tokenValue) });
    }

    async sendMagicInvitationMail(accountId: AccountId, accountEmail: string): Promise<void> {
        const loginToken = await this.linkTokenService.createLoginToken(accountId, MagicLinkService.ONE_WEEK_IN_SECONDS);
        await this.mailService.sendMagicLinkLoginMail(accountEmail, { loginLink: this.buildFrontendLoginLink(loginToken.tokenValue) });
    }

    private buildFrontendLoginLink(loginTokenValue: string): string {
        return `${this.config.frontendBaseUrl}/auth/login-with-token?t=${loginTokenValue}`;
    }

}