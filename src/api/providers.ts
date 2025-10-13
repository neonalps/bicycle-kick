import { RouteProvider } from "@src/router/types";
import { getSearchRouteProviders } from "./v1/search/providers";
import { getAuthRouteProviders } from "./v1/auth/provider";
import { getGameRouteProviders } from "./v1/game/providers";
import { getSeasonRouteProviders } from "./v1/season/providers";
import { getOpsRouteProviders } from "./v1/ops/providers";
import { getClubRouteProviders } from "./v1/club/providers";
import { getPersonRouteProviders } from "./v1/person/providers";
import { getDashboardRouteProviders } from "./v1/dashboard/providers";
import { getAccountRouteProviders } from "./v1/account/provider";
import { ApplicationServices } from "@src/di/services";
import { getVenueRouteProviders } from "./v1/venue/providers";

export function getRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    return [
        ...getAccountRouteProviders(services),
        ...getAuthRouteProviders(services),
        ...getClubRouteProviders(services),
        ...getDashboardRouteProviders(services),
        ...getGameRouteProviders(services),
        ...getOpsRouteProviders(services),
        ...getPersonRouteProviders(services),
        ...getSearchRouteProviders(services),
        ...getSeasonRouteProviders(services),
        ...getVenueRouteProviders(services),
    ];
    
}