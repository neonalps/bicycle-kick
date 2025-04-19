import { AuthTokenType } from "./auth-token-type";

export interface AuthToken {
    type: AuthTokenType;
    issuer: string;
    audience: string;
    subject: string;
    scopes: string[];
    issuedAt: number;
    expiresAt: number;
    notBefore: number;
}

export interface AccessToken extends AuthToken {
    type: AuthTokenType.Access;
}

export interface RefreshToken extends AuthToken {
    type: AuthTokenType.Refresh;
}