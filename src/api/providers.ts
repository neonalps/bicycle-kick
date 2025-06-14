import { RouteProvider } from "@src/router/types";
import { getSearchRouteProviders } from "./v1/search/providers";
import { getAuthRouteProviders } from "./v1/auth/provider";
import { getGameRouteProviders } from "./v1/game/providers";
import { getSeasonRouteProviders } from "./v1/season/providers";
import { getOpsRouteProviders } from "./v1/ops/providers";
import { getClubRouteProviders } from "./v1/club/providers";
import { getPersonRouteProviders } from "./v1/person/providers";

export function getRouteProviders(): RouteProvider<any, any>[] {

    return [
        ...getAuthRouteProviders(),
        ...getClubRouteProviders(),
        ...getGameRouteProviders(),
        ...getOpsRouteProviders(),
        ...getPersonRouteProviders(),
        ...getSeasonRouteProviders(),
        ...getSearchRouteProviders(),
    ];
    
}