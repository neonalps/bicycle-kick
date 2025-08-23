import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { OAuthLoginHandler } from "./oauth/handler";
import { OAuthService } from "@src/module/auth/oauth/service";
import { OAuthLoginRouteProvider } from "./oauth/route-provider";
import { RefreshTokenRouteHandler } from "./refresh-token/handler";
import { RefreshTokenRouteProvider } from "./refresh-token/route-provider";
import { AuthService } from "@src/module/auth/service";
import { DateSource } from "@src/util/date";
import { getAuthTokenConfig } from "@src/config";
import { TimeSource } from "@src/util/time";

export function getAuthRouteProviders(): RouteProvider<any, any>[] {
    const authService = dependencyManager.get<AuthService>(Dependencies.AuthService);
    const dateSource = dependencyManager.get<DateSource>(Dependencies.DateSource);
    const timeSource = dependencyManager.get<TimeSource>(Dependencies.TimeSource);
    const oAuthService = dependencyManager.get<OAuthService>(Dependencies.OAuthService);

    const oAuthRouteHandler = new OAuthLoginHandler(oAuthService);
    const refreshTokenRouteHandler = new RefreshTokenRouteHandler(authService, dateSource, timeSource, getAuthTokenConfig());

    return [
        new OAuthLoginRouteProvider(oAuthRouteHandler),
        new RefreshTokenRouteProvider(refreshTokenRouteHandler),
    ];
}