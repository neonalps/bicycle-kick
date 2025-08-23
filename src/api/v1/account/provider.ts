import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { GetAllAccountsRouteHandler } from "./get-all/handler";
import { PaginationService } from "@src/module/pagination/service";
import { GetAllAccountsRouteProvider } from "./get-all/route-provider";
import { AccountService } from "@src/module/account/service";
import { ApiHelperService } from "@src/module/api-helper/service";

export function getAccountRouteProviders(): RouteProvider<any, any>[] {
    const accountService = dependencyManager.get<AccountService>(Dependencies.AccountService);
    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const paginationService = dependencyManager.get<PaginationService>(Dependencies.PaginationService);

    const getAllAccountsHandler = new GetAllAccountsRouteHandler(accountService, apiHelperService, paginationService);

    return [
        new GetAllAccountsRouteProvider(getAllAccountsHandler),
    ];
}