import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { OAuthLoginHandler } from "./oauth/handler";
import { OAuthService } from "@src/module/auth/oauth/service";
import { OAuthLoginRouteProvider } from "./oauth/route-provider";

export function getAuthRouteProviders(): RouteProvider<any, any>[] {
    const oAuthService = dependencyManager.get<OAuthService>(Dependencies.OAuthService);

    const oAuthRouteHandler = new OAuthLoginHandler(oAuthService);

    return [
        new OAuthLoginRouteProvider(oAuthRouteHandler),
    ];
}