import { RouteProvider } from "@src/router/types";
import { GetAllAccountsRouteHandler } from "./get-all/handler";
import { GetAllAccountsRouteProvider } from "./get-all/route-provider";
import { ApplicationServices } from "@src/di/services";
import { GetAccountProfileRouteProvider } from "./get-profile/route-provider";
import { GetAccountProfileRouteHandler } from "./get-profile/handler";
import { UpdateAccountProfileRouteHandler } from "./update-profile/handler";
import { UpdateAccountProfileRouteProvider } from "./update-profile/route-provider";

export function getAccountRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {
    const getAccountProfileHandler = new GetAccountProfileRouteHandler(services.apiHelperService);
    const getAllAccountsHandler = new GetAllAccountsRouteHandler(
        services.accountService, 
        services.apiHelperService, 
        services.paginationService
    );
    const updateAccountProfileHandler = new UpdateAccountProfileRouteHandler(services.accountService, services.apiHelperService);

    return [
        new GetAccountProfileRouteProvider(getAccountProfileHandler),
        new GetAllAccountsRouteProvider(getAllAccountsHandler),
        new UpdateAccountProfileRouteProvider(updateAccountProfileHandler),
    ];
}