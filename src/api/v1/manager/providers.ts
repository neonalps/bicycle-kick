import { ApplicationServices } from "@src/di/services";
import { RouteProvider } from "@src/router/types";
import { GetAllManagerPeriodsRouteHandler } from "./get-all-periods/handler";
import { GetAllManagerPeriodsRouteProvider } from "./get-all-periods/route-provider";

export function getManagerRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {
    
    const getAllPeriodsRouteHandler = new GetAllManagerPeriodsRouteHandler(services.apiHelperService, services.managerPeriodService, services.paginationService);

    return [
        new GetAllManagerPeriodsRouteProvider(getAllPeriodsRouteHandler),
    ];
}