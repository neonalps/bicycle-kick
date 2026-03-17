import { RouteProvider } from "@src/router/types";
import { OAuthLoginHandler } from "./oauth/handler";
import { OAuthLoginRouteProvider } from "./oauth/route-provider";
import { RefreshTokenRouteHandler } from "./refresh-token/handler";
import { RefreshTokenRouteProvider } from "./refresh-token/route-provider";
import { getAuthTokenConfig } from "@src/config";
import { ApplicationServices } from "@src/di/services";
import { SendMagicLinkHandler } from "./send-magic-link/handler";
import { SendMagicLinkRouteProvider } from "./send-magic-link/route-provider";
import { LoginWithTokenHandler } from "./login-with-token/handler";
import { LoginWithTokenRouteProvider } from "./login-with-token/route-provider";

export function getAuthRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {
    const loginWithTokenHandler = new LoginWithTokenHandler(services.apiHelperService, services.authService);
    const oAuthRouteHandler = new OAuthLoginHandler(services.apiHelperService, services.oAuthService);
    const refreshTokenRouteHandler = new RefreshTokenRouteHandler(services.authService, services.dateSource, services.timeSource, getAuthTokenConfig());
    const sendMagicLinkRouteHandler = new SendMagicLinkHandler(services.accountService, services.magicLinkService);

    return [
        new LoginWithTokenRouteProvider(loginWithTokenHandler),
        new OAuthLoginRouteProvider(oAuthRouteHandler),
        new RefreshTokenRouteProvider(refreshTokenRouteHandler),
        new SendMagicLinkRouteProvider(sendMagicLinkRouteHandler),
    ];
}