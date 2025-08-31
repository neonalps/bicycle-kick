import { RouteProvider } from "@src/router/types";
import { GetDashboardHandler } from "./get-dashboard/handler";
import { GetDashboardRouteProvider } from "./get-dashboard/router-provider";
import { ApplicationServices } from "@src/di/services";

export function getDashboardRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const getDashboardHandler = new GetDashboardHandler(services.apiHelperService, services.dashboardService);

    return [
        new GetDashboardRouteProvider(getDashboardHandler),
    ];
}