import jwt from "jsonwebtoken";
import { isDefined, requireNonNull } from "@src/util/common";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { TimeSource } from "@src/util/time";
import { AccessToken, AuthToken, RefreshToken } from "@src/model/type/auth-token";
import { AuthTokenType } from "@src/model/type/auth-token-type";
import { Jwt } from "@src/model/type/jwt";
import { Account } from "@src/model/internal/account";
import { AuthIdentity } from "@src/model/internal/auth-identity";
import { LinkTokenService } from "@src/module/link-token/service";
import { LinkTokenType } from "@src/model/type/link-token";
import { unawaited } from "@src/util/promise";
import { AccountService } from "@src/module/account/service";
import { IllegalStateError } from "@src/api/error/illegal-state";

export interface TokenConfig {
    accessTokenValiditySeconds: number;
    refreshTokenValiditySeconds: number;
    loginTokenValiditySeconds: number;
    audience: string;
    issuer: string;
    signingKey: string;
}

export class AuthService {

    private readonly accountService: AccountService;
    private readonly linkTokenService: LinkTokenService;
    private readonly tokenConfig: TokenConfig;
    private readonly timeSource: TimeSource;

    constructor(
        accountService: AccountService,
        linkTokenService: LinkTokenService,
        tokenConfig: TokenConfig,
        timeSource: TimeSource
    ) {
        this.accountService = requireNonNull(accountService);
        this.linkTokenService = requireNonNull(linkTokenService);
        this.tokenConfig = requireNonNull(tokenConfig);
        this.timeSource = requireNonNull(timeSource);

        this.validateConfig();
    }

    public createSignedAccessToken(subject: string, scopes: string[]): string {
        const accessToken = this.issueAccessToken(subject, scopes);
        return this.signToken(accessToken);
    }

    public createSignedRefreshToken(subject: string, scopes: string[]): string {
        const refreshToken = this.issueRefreshToken(subject, scopes);
        return this.signToken(refreshToken);
    }

    async handleLoginWithToken(token: string): Promise<AuthIdentity> {
        validateNotBlank(token, "token");

        const linkToken = await this.linkTokenService.getValidByTokenValue(token);
        if (linkToken === null) {
            throw new IllegalStateError(`Invalid token`);
        }

        if (linkToken.tokenType !== LinkTokenType.Login) {
            unawaited(this.linkTokenService.deleteById(linkToken.id));
            throw new IllegalStateError(`Invalid token`);
        }

        const resolvedAccount = await this.accountService.getById(linkToken.accountId);
        if (resolvedAccount === null || resolvedAccount.enabled !== true) {
            unawaited(this.linkTokenService.deleteById(linkToken.id));
            throw new IllegalStateError(`Invalid token`);
        }

        unawaited(this.linkTokenService.deleteById(linkToken.id));
        return this.getAuthIdentity(resolvedAccount);
    }

    public getAuthIdentity(account: Account): AuthIdentity {
        const scope = account.roles;

        return {
            publicId: account.publicId,
            email: account.email,
            role: account.roles,
            profileSettings: {
                firstName: account.firstName,
                lastName: account.lastName,
                hasProfilePicture: account.hasProfilePicture,
                language: account.language,
                dateFormat: account.dateFormat,
                scoreFormat: account.scoreFormat,
                gameMinuteFormat: account.gameMinuteFormat,
            },
            accessToken: this.createSignedAccessToken(account.publicId, [scope]),
            refreshToken: this.createSignedRefreshToken(account.publicId, [scope]),
        }
    }
    
    private issueAccessToken(subject: string, scopes: string[]): AccessToken {
        const now = this.timeSource.getCurrentUnixTimestamp();
        const expiresAt = now + this.tokenConfig.accessTokenValiditySeconds;

        return {
            type: AuthTokenType.Access,
            issuer: this.tokenConfig.issuer,
            audience: this.tokenConfig.audience,
            subject,
            scopes: Array.from(new Set(scopes)),
            issuedAt: now,
            notBefore: now,
            expiresAt,
        }
    }

    private issueRefreshToken(subject: string, scopes: string[]): RefreshToken {
        const now = this.timeSource.getCurrentUnixTimestamp();
        const expiresAt = now + this.tokenConfig.refreshTokenValiditySeconds;

        return {
            type: AuthTokenType.Refresh,
            issuer: this.tokenConfig.issuer,
            audience: this.tokenConfig.audience,
            subject,
            scopes: Array.from(new Set(scopes)),
            issuedAt: now,
            notBefore: now,
            expiresAt,
        }
    }
    
    private signToken(token: AuthToken): string {
        return jwt.sign(this.convertToJwt(token), this.tokenConfig.signingKey);
    }

    private validateConfig(): void {
        validateNotNull(this.tokenConfig.accessTokenValiditySeconds, "tokenConfig.accessTokenValiditySeconds");
        validateNotNull(this.tokenConfig.refreshTokenValiditySeconds, "tokenConfig.refreshTokenValiditySeconds");
        validateNotBlank(this.tokenConfig.issuer, "tokenConfig.issuer");
        validateNotBlank(this.tokenConfig.audience, "tokenConfig.audience");
        validateNotBlank(this.tokenConfig.signingKey, "tokenConfig.signingKey");
    }

    private convertToJwt(token: AuthToken): Jwt {
        const jwt: Jwt = {
            type: token.type,
            iss: token.issuer,
            aud: token.audience,
            sub: token.subject,
            exp: token.expiresAt,
        }

        if (isDefined(token.scopes)) {
            jwt.scp = token.scopes;
        }

        if (isDefined(token.issuedAt)) {
            jwt.iat = token.issuedAt;
        }

        if (isDefined(token.notBefore)) {
            jwt.nbf = token.notBefore;
        }

        return jwt;
    }

}