import { ApplicationServices } from "@src/di/services";
import { RouteProvider } from "@src/router/types";
import { GetApplicationStatsRouteHandler } from "./application/handler";
import { GetApplicationStatsRouteProvider } from "./application/route-provider";
import { GetPlayerAppearanceStatsRouteHandler } from "./player-appearances/handler";
import { GetPlayerAppearanceStatsRouteProvider } from "./player-appearances/route-provider";

export function getStatsRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const getOverallApplicationStatsRouteHandler = new GetApplicationStatsRouteHandler(services.applicationStatsService);
    const getPlayerAppearanceStatsRouteHandler = new GetPlayerAppearanceStatsRouteHandler(services.apiHelperService, services.competitionService, services.paginationService, services.statsService);

    return [
        new GetApplicationStatsRouteProvider(getOverallApplicationStatsRouteHandler),
        new GetPlayerAppearanceStatsRouteProvider(getPlayerAppearanceStatsRouteHandler),
    ];
}