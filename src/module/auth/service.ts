import jwt from "jsonwebtoken";
import { isDefined, requireNonNull } from "@src/util/common";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { TimeSource } from "@src/util/time";
import { AccessToken, AuthToken, LoginToken, RefreshToken } from "@src/model/type/auth-token";
import { AuthTokenType } from "@src/model/type/auth-token-type";
import { Jwt } from "@src/model/type/jwt";

export interface TokenConfig {
    accessTokenValiditySeconds: number;
    refreshTokenValiditySeconds: number;
    loginTokenValiditySeconds: number;
    audience: string;
    issuer: string;
    signingKey: string;
}

export class AuthService {

    private readonly tokenConfig: TokenConfig;
    private readonly timeSource: TimeSource;

    constructor(tokenConfig: TokenConfig, timeSource: TimeSource) {
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

    public createSignedLoginToken(subject: string): string {
        const loginToken = this.issueLoginToken(subject);
        return this.signToken(loginToken);
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

    private issueLoginToken(subject: string): LoginToken {
        const now = this.timeSource.getCurrentUnixTimestamp();
        const expiresAt = now + this.tokenConfig.loginTokenValiditySeconds;

        return {
            type: AuthTokenType.Login,
            issuer: this.tokenConfig.issuer,
            audience: this.tokenConfig.audience,
            subject,
            expiresAt,
            scopes: null,
            issuedAt: null,
            notBefore: null,
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