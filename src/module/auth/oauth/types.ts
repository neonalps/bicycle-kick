export interface OAuthTokenResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    refreshToken: string;
    scope: string;
}

export interface OAuthUserInfo {
    email: string;
    firstName?: string;
    lastName?: string;
}