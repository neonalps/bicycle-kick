import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GetDashboardHandler } from "./get-dashboard/handler";
import { DashboardService } from "@src/module/dashboard/service";
import { GetDashboardRouteProvider } from "./get-dashboard/router-provider";

export function getDashboardRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const dashboardService = dependencyManager.get<DashboardService>(Dependencies.DashboardService);

    const getDashboardHandler = new GetDashboardHandler(apiHelperService, dashboardService);

    return [
        new GetDashboardRouteProvider(getDashboardHandler),
    ];
}