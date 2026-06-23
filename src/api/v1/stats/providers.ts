import { ApplicationServices } from "@src/di/services";
import { RouteProvider } from "@src/router/types";
import { GetApplicationStatsRouteHandler } from "./application/handler";
import { GetApplicationStatsRouteProvider } from "./application/route-provider";
import { GetPlayerAppearanceStatsRouteHandler } from "./player-appearances/handler";
import { GetPlayerAppearanceStatsRouteProvider } from "./player-appearances/route-provider";
import { GetPlayerGoalsStatsRouteHandler } from "./player-goals/handler";
import { GetPlayerGoalsStatsRouteProvider } from "./player-goals/route-provider";
import { GetShirtStatsRouteHandler } from "./shirt/handler";
import { GetShirtStatsRouteProvider } from "./shirt/route-provider";

export function getStatsRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const getOverallApplicationStatsRouteHandler = new GetApplicationStatsRouteHandler(services.applicationStatsService);
    const getPlayerAppearanceStatsRouteHandler = new GetPlayerAppearanceStatsRouteHandler(services.apiHelperService, services.competitionService, services.paginationService, services.statsService);
    const getPlayerGoalsStatsRouteHandler = new GetPlayerGoalsStatsRouteHandler(services.apiHelperService, services.competitionService, services.paginationService, services.statsService);
    const getOverallShirtStatsRouteHandler = new GetShirtStatsRouteHandler(services.statsService);

    return [
        new GetApplicationStatsRouteProvider(getOverallApplicationStatsRouteHandler),
        new GetPlayerAppearanceStatsRouteProvider(getPlayerAppearanceStatsRouteHandler),
        new GetPlayerGoalsStatsRouteProvider(getPlayerGoalsStatsRouteHandler),
        new GetShirtStatsRouteProvider(getOverallShirtStatsRouteHandler),
    ];
}