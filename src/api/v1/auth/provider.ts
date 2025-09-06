import { RouteProvider } from "@src/router/types";
import { OAuthLoginHandler } from "./oauth/handler";
import { OAuthLoginRouteProvider } from "./oauth/route-provider";
import { RefreshTokenRouteHandler } from "./refresh-token/handler";
import { RefreshTokenRouteProvider } from "./refresh-token/route-provider";
import { getAuthTokenConfig } from "@src/config";
import { ApplicationServices } from "@src/di/services";

export function getAuthRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {
    const oAuthRouteHandler = new OAuthLoginHandler(services.apiHelperService, services.oAuthService);
    const refreshTokenRouteHandler = new RefreshTokenRouteHandler(services.authService, services.dateSource, services.timeSource, getAuthTokenConfig());

    return [
        new OAuthLoginRouteProvider(oAuthRouteHandler),
        new RefreshTokenRouteProvider(refreshTokenRouteHandler),
    ];
}