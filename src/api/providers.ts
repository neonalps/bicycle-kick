import { RouteProvider } from "@src/router/types";
import { getSearchRouteProviders } from "./v1/search/providers";
import { getAuthRouteProviders } from "./v1/auth/provider";
import { getGameRouteProviders } from "./v1/game/providers";
import { getSeasonRouteProviders } from "./v1/season/providers";
import { getOpsRouteProviders } from "./v1/ops/providers";

export function getRouteProviders(): RouteProvider<any, any>[] {

    return [
        ...getAuthRouteProviders(),
        ...getGameRouteProviders(),
        ...getOpsRouteProviders(),
        ...getSeasonRouteProviders(),
        ...getSearchRouteProviders(),
    ];
    
}