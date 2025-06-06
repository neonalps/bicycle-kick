import { CorsConfig } from "@src/cors/manager";
import { HttpMethod } from "@src/http/constants";
import { GoogleOAuthClientConfig } from "@src/module/auth/oauth/google/client";
import { TokenConfig } from "@src/module/auth/service";
import { checkValidHttpMethod, getAllowedHttpMethods } from "@src/util/common";
import dotenv from "dotenv";
import * as env from "env-var";

dotenv.config();

const nodeEnv = env.get('NODE_ENV').required().asString();
const dbConnectionUrl = env.get('DB_CONNECTION_URL').required().asString();
const serverHost = env.get("HOST").required().asString();
const serverPort = env.get('PORT').required().asPortNumber();
const corsAllowedMethods = env.get("CORS_ALLOWED_METHODS").required().asString();
const corsAllowedOrigins = env.get("CORS_ALLOWED_ORIGINS").required().asString();
const cryptoKey = env.get("CRYPTO_KEY").required().asString();
const cdnBaseUrl = env.get("CDN_BASE_URL").required().asString();
const frontendBaseUrl = env.get("FRONTEND_BASE_URL").required().asString();
const mainClubId = env.get("MAIN_CLUB_ID").required().asIntPositive();

const authTokenAudience = env.get("AUTH_TOKEN_AUDIENCE").required().asString();
const authTokenIssuer = env.get("AUTH_TOKEN_ISSUER").required().asString();
const authTokenSigningKey = env.get("AUTH_TOKEN_SIGNING_KEY").required().asString();
const accessTokenValiditySeconds = env.get("ACCESS_TOKEN_VALIDITY_SECONDS").required().asIntPositive();
const refreshTokenValiditySeconds = env.get("REFRESH_TOKEN_VALIDITY_SECONDS").required().asIntPositive();

const parseAllowedMethods = (methods: string): HttpMethod[] => {
    const methodStrings = methods.split(",");

    if (!methodStrings.every(method => checkValidHttpMethod(method))) {
        throw new Error(`Illegal value in allowed CORS methods detected. All values must be one of: ${getAllowedHttpMethods().join(", ")}`);
    }

    return methodStrings as HttpMethod[];
};

const authTokenConfig: TokenConfig = {
    audience: authTokenAudience,
    issuer: authTokenIssuer,
    signingKey: authTokenSigningKey,
    accessTokenValiditySeconds,
    refreshTokenValiditySeconds,
}

const corsConfig: CorsConfig = {
    allowedOrigins: corsAllowedOrigins.split(","),
    allowedMethods: parseAllowedMethods(corsAllowedMethods),
};

const googleOAuthConfig: GoogleOAuthClientConfig = {
    clientId: env.get("OAUTH_GOOGLE_CLIENT_ID").required().asString(),
    clientSecret: env.get("OAUTH_GOOGLE_CLIENT_SECRET").required().asString(),
    redirectUrl: env.get("OAUTH_GOOGLE_REDIRECT_URL").required().asString(),
    tokenUrl: env.get("OAUTH_GOOGLE_TOKEN_URL").required().asString(),
    userProfileUrl: env.get("OAUTH_GOOGLE_USER_PROFILE_URL").required().asString()
}

export const getNodeEnv = () => nodeEnv;
export const getAuthTokenConfig = () => authTokenConfig;
export const getCorsConfig = () => corsConfig;
export const getCryptoKey = () => cryptoKey;
export const getDbConnectionUrl = () => dbConnectionUrl;
export const getCdnBaseUrl = () => cdnBaseUrl;
export const getFrontendBaseUrl = () => frontendBaseUrl;
export const getMainClubId = () => mainClubId;
export const getServerHost = () => serverHost;
export const getServerPort = () => serverPort;
export const getGoogleOAuthConfig = () => googleOAuthConfig;