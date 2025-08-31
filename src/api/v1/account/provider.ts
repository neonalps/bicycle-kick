import { RouteProvider } from "@src/router/types";
import { GetAllAccountsRouteHandler } from "./get-all/handler";
import { GetAllAccountsRouteProvider } from "./get-all/route-provider";
import { ApplicationServices } from "@src/di/services";

export function getAccountRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {
    const getAllAccountsHandler = new GetAllAccountsRouteHandler(
        services.accountService, 
        services.apiHelperService, 
        services.paginationService
    );

    return [
        new GetAllAccountsRouteProvider(getAllAccountsHandler),
    ];
}