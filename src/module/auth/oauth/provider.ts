import { OAuthUserInfo } from "./types";

export interface OAuthProvider {
    retrieveUserInfo(authorizationCode: string): Promise<OAuthUserInfo>;
}