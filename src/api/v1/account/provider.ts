import { RouteProvider } from "@src/router/types";
import { GetAllAccountsRouteHandler } from "./get-all/handler";
import { GetAllAccountsRouteProvider } from "./get-all/route-provider";
import { ApplicationServices } from "@src/di/services";
import { GetAccountProfileRouteProvider } from "./get-profile/route-provider";
import { GetAccountProfileRouteHandler } from "./get-profile/handler";

export function getAccountRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {
    const getAccountProfileHandler = new GetAccountProfileRouteHandler();

    const getAllAccountsHandler = new GetAllAccountsRouteHandler(
        services.accountService, 
        services.apiHelperService, 
        services.paginationService
    );

    return [
        new GetAccountProfileRouteProvider(getAccountProfileHandler),
        new GetAllAccountsRouteProvider(getAllAccountsHandler),
    ];
}