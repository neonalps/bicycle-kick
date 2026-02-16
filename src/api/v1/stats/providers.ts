import { ApplicationServices } from "@src/di/services";
import { RouteProvider } from "@src/router/types";
import { GetApplicationStatsRouteHandler } from "./application/handler";
import { GetApplicationStatsRouteProvider } from "./application/route-provider";

export function getStatsRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const getOverallApplicationStatsRouteHandler = new GetApplicationStatsRouteHandler(services.applicationStatsService);

    return [
        new GetApplicationStatsRouteProvider(getOverallApplicationStatsRouteHandler),
    ];
}