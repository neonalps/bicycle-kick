import { HttpClient } from "@src/http/client";
import { AUTHORIZATION, CONTENT_TYPE, HEADER, HTTP_STATUS } from "@src/http/constants";
import { getQueryString, requireNonNull } from "@src/util/common";
import { validateNotBlank } from "@src/util/validation";
import { OAUTH_GRANT_TYPE_AUTHORIZATION_CODE } from "@src/module/auth/oauth/constants";
import { OAuthTokenResponse, OAuthUserInfo } from "@src/module/auth/oauth/types";
import { OAuthProvider } from "@src/module/auth/oauth/provider";

type GoogleOAuthTokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    refresh_token: string;
}

type GoogleOAuthUserInfoResponse = {
    email: string;
    given_name: string;
    family_name: string;
}

export interface GoogleOAuthClientConfig {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    tokenUrl: string;
    userProfileUrl: string;
}

export class GoogleOAuthClient implements OAuthProvider {

    private readonly config: GoogleOAuthClientConfig;

    constructor(config: GoogleOAuthClientConfig, private readonly httpClient: HttpClient) {
        this.config = requireNonNull(config);

        validateNotBlank(config.clientId, "config.clientId");
        validateNotBlank(config.clientSecret, "config.clientSecret");
    }

    public async retrieveUserInfo(authorizationCode: string): Promise<OAuthUserInfo> {
        const token = await this.exchangeCodeForToken(authorizationCode);
        return await this.getUserInfo(token.accessToken);
    }

    private async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> { 
        validateNotBlank(code, "code");

        const response = await this.httpClient.post<GoogleOAuthTokenResponse>(this.config.tokenUrl, {
            headers: { 
                [HEADER.ACCEPT]: CONTENT_TYPE.JSON,
                [HEADER.CONTENT_TYPE]: CONTENT_TYPE.FORM_URLENCODED,
            },
            body: this.getCodeExchangeParams(code)
        });
    
        if (response.statusCode !== HTTP_STATUS.OK) {
            throw new Error("something went wrong while exchanging code for token");
        }
    
        const responseBody = response.body;
    
        return {
            accessToken: responseBody.access_token,
            refreshToken: responseBody.refresh_token,
            expiresIn: responseBody.expires_in,
            scope: responseBody.scope,
            tokenType: responseBody.token_type,
        };
    }

    private async getUserInfo(accessToken: string): Promise<OAuthUserInfo> {
        validateNotBlank(accessToken, "accessToken");

        const response = await this.httpClient.get<GoogleOAuthUserInfoResponse>(this.config.userProfileUrl, {
            headers: { 
                [HEADER.ACCEPT]: CONTENT_TYPE.JSON,
                [HEADER.AUTHORIZATION]: `${AUTHORIZATION.BEARER} ${accessToken}`,
                [HEADER.CONTENT_TYPE]: CONTENT_TYPE.JSON,
            }
        });
    
        if (response.statusCode !== HTTP_STATUS.OK) {
            throw new Error("something went wrong while getting the user profile");
        }
    
        return {
            email: response.body.email,
            firstName: response.body.given_name,
            lastName: response.body.family_name,
        };
    }

    private getCodeExchangeParams(code: string): string {
        return getQueryString({
            code,
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
            grant_type: OAUTH_GRANT_TYPE_AUTHORIZATION_CODE,
            redirect_uri: this.config.redirectUrl,
        });
    };

}