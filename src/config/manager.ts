import { CorsConfig } from "@src/cors/manager";
import { HttpMethod } from "@src/http/constants";
import { GoogleOAuthClientConfig } from "@src/module/auth/oauth/google/client";
import { TokenConfig } from "@src/module/auth/service";
import { MailServiceConfig } from "@src/module/mail/service";
import { BunnyClientConfig } from "@src/module/storage/bunny.client";
import { checkValidHttpMethod, getAllowedHttpMethods } from "@src/util/common";
import dotenv from "dotenv";
import * as env from "env-var";

dotenv.config();

export type ApplicationConfig = {
    nodeEnv: string;
    serverHost: string;
    serverPort: number;
    cryptoKey: string;
    dbConnectionUrl: string;
    authTokenConfig: TokenConfig;
    bunnyClientConfig: BunnyClientConfig;
    corsConfig: CorsConfig;
    googleOAuthConfig: GoogleOAuthClientConfig;
    frontendBaseUrl: string;
    mailServiceConfig: MailServiceConfig;
    cdnBaseUrl: string;
    mainClubId: number;
    sofascoreMainClubId: number;
    useBunnyForUploadsInDevelopment?: boolean;
}

export class ApplicationConfigManager {

    read(): ApplicationConfig {

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
        const sofascoreMainClubId = env.get("SOFASCORE_MAIN_CLUB_ID").required().asIntPositive();

        const mailConfigFromAddress = env.get("MAIL_CONFIG_FROM_ADDRESS").required().asString();
        const mailConfigSmtpHost = env.get("MAIL_CONFIG_SMTP_HOST").required().asString();
        const mailConfigSmtpPort = env.get('MAIL_CONFIG_SMTP_PORT').required().asPortNumber();
        const mailConfigSmtpUsername = env.get("MAIL_CONFIG_SMTP_USERNAME").required().asString();
        const mailConfigSmtpPassword = env.get("MAIL_CONFIG_SMTP_PASSWORD").required().asString();

        const bunnyAccessKey = env.get("BUNNY_ACCESS_KEY").required().asString();
        const bunnyStorageZoneName = env.get("BUNNY_STORAGE_ZONE_NAME").required().asString();

        const authTokenAudience = env.get("AUTH_TOKEN_AUDIENCE").required().asString();
        const authTokenIssuer = env.get("AUTH_TOKEN_ISSUER").required().asString();
        const authTokenSigningKey = env.get("AUTH_TOKEN_SIGNING_KEY").required().asString();
        const accessTokenValiditySeconds = env.get("ACCESS_TOKEN_VALIDITY_SECONDS").required().asIntPositive();
        const refreshTokenValiditySeconds = env.get("REFRESH_TOKEN_VALIDITY_SECONDS").required().asIntPositive();
        const loginTokenValiditySeconds = env.get("LOGIN_TOKEN_VALIDITY_SECONDS").required().asIntPositive();

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
            accessTokenValiditySeconds: accessTokenValiditySeconds,
            refreshTokenValiditySeconds: refreshTokenValiditySeconds,
            loginTokenValiditySeconds: loginTokenValiditySeconds,
        }

        const corsConfig: CorsConfig = {
            allowedOrigins: corsAllowedOrigins.split(","),
            allowedMethods: parseAllowedMethods(corsAllowedMethods),
        };

        const mailConfig: MailServiceConfig = {
            from: mailConfigFromAddress,
            smtp: {
                host: mailConfigSmtpHost,
                port: mailConfigSmtpPort,
                username: mailConfigSmtpUsername,
                password: mailConfigSmtpPassword,
            },
        };

        const googleOAuthConfig: GoogleOAuthClientConfig = {
            clientId: env.get("OAUTH_GOOGLE_CLIENT_ID").required().asString(),
            clientSecret: env.get("OAUTH_GOOGLE_CLIENT_SECRET").required().asString(),
            redirectUrl: env.get("OAUTH_GOOGLE_REDIRECT_URL").required().asString(),
            tokenUrl: env.get("OAUTH_GOOGLE_TOKEN_URL").required().asString(),
            userProfileUrl: env.get("OAUTH_GOOGLE_USER_PROFILE_URL").required().asString()
        };

        const bunnyClientConfig: BunnyClientConfig = {
            accessKey: bunnyAccessKey,
            storageZoneName: bunnyStorageZoneName,
        };

        const useBunnyForUploadsInDevelopment = env.get("BUNNY_USE_FOR_UPLOADS_IN_DEVELOPMENT").asBool();

        return {
            nodeEnv,
            serverHost,
            serverPort,
            cryptoKey,
            dbConnectionUrl,
            authTokenConfig,
            corsConfig,
            mailServiceConfig: mailConfig,
            googleOAuthConfig,
            bunnyClientConfig,
            frontendBaseUrl,
            cdnBaseUrl,
            mainClubId,
            sofascoreMainClubId,
            useBunnyForUploadsInDevelopment,
        }

    }

}