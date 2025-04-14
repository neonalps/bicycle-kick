import { CorsConfig } from "@src/cors/manager";
import { HttpMethod } from "@src/http/constants";
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
const frontendBaseUrl = env.get("FRONTEND_BASE_URL").required().asString();

const parseAllowedMethods = (methods: string): HttpMethod[] => {
    const methodStrings = methods.split(",");

    if (!methodStrings.every(method => checkValidHttpMethod(method))) {
        throw new Error(`Illegal value in allowed CORS methods detected. All values must be one of: ${getAllowedHttpMethods().join(", ")}`);
    }

    return methodStrings as HttpMethod[];
};

const corsConfig: CorsConfig = {
    allowedOrigins: corsAllowedOrigins.split(","),
    allowedMethods: parseAllowedMethods(corsAllowedMethods),
};

export const getNodeEnv = () => nodeEnv;
export const getCorsConfig = () => corsConfig;
export const getCryptoKey = () => cryptoKey;
export const getDbConnectionUrl = () => dbConnectionUrl;
export const getFrontendBaseUrl = () => frontendBaseUrl;
export const getServerHost = () => serverHost;
export const getServerPort = () => serverPort;