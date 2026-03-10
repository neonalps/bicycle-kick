import { AuthTokenType } from "./auth-token-type";

export interface AuthToken {
    type: AuthTokenType;
    issuer: string;
    audience: string;
    subject: string;
    scopes: string[] | null;
    issuedAt: number | null;
    expiresAt: number;
    notBefore: number | null;
}

export interface AccessToken extends AuthToken {
    type: AuthTokenType.Access;
    scopes: string[];
    issuedAt: number;
    notBefore: number;
}

export interface RefreshToken extends AuthToken {
    type: AuthTokenType.Refresh;
    scopes: string[];
    issuedAt: number;
    notBefore: number;
}

export interface LoginToken extends AuthToken {
    type: AuthTokenType.Login;
}