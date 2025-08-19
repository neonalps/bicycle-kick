import { AccountService } from "@src/module/account/service";
import { GoogleOAuthClient } from "./google/client";
import { OAuthUserInfo } from "./types";
import { AuthProvider } from "./constants";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { AuthIdentity } from "@src/model/internal/auth-identity";
import { AuthService } from "@src/module/auth/service";

export class OAuthService {

    constructor(
        private readonly accountService: AccountService,
        private readonly authService: AuthService,
        private readonly googleOAuthClient: GoogleOAuthClient,
    ) {}

    async handleOAuthLogin(provider: AuthProvider, authorizationCode: string): Promise<AuthIdentity> {
        const userInfo = await this.getOAuthUserInfo(provider, authorizationCode);
        validateNotNull(userInfo, "userInfo");
        validateNotBlank(userInfo.email, "userInfo.email");

        const account = await this.accountService.getOrCreate(userInfo.email, userInfo.firstName, userInfo.lastName);

        const scopes = account.roles;

        return {
            publicId: account.publicId,
            email: userInfo.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            accessToken: this.authService.createSignedAccessToken(account.publicId, scopes),
            refreshToken: this.authService.createSignedRefreshToken(account.publicId, scopes),
        }
    }

    private async getOAuthUserInfo(provider: AuthProvider, authorizationCode: string): Promise<OAuthUserInfo> {
        switch (provider) {
            case AuthProvider.Google:
                return await this.googleOAuthClient.retrieveUserInfo(authorizationCode);
            default:
                throw new Error(`Unhandled OAuth provider ${provider}`);
        }
    }

}