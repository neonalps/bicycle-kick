import { RouteProvider } from "@src/router/types";
import { getSearchRouteProviders } from "./v1/search/providers";
import { getAuthRouteProviders } from "./v1/auth/provider";
import { getGameRouteProviders } from "./v1/game/providers";

export function getRouteProviders(): RouteProvider<any, any>[] {

    return [
        ...getAuthRouteProviders(),
        ...getGameRouteProviders(),
        ...getSearchRouteProviders(),
    ];
    
}