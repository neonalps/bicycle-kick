import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { AdvancedQueryService } from "@src/module/advanced-query/service";
import { RouteProvider } from "@src/router/types";
import { MagicSearchRouteHandler } from "./magic/handler";
import { MagicSearchRouteProvider } from "./magic/route-provider";
import { ApiHelperService } from "@src/module/api-helper/service";
import { SearchService } from "@src/module/search/service";
import { RegularSearchRouteHandler } from "./regular/handler";
import { RegularSearchRouteProvider } from "./regular/route-provider";

export function getSearchRouteProviders(): RouteProvider<any, any>[] {

    const advancedQueryService = dependencyManager.get<AdvancedQueryService>(Dependencies.AdvancedQueryService);
    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const searchService = dependencyManager.get<SearchService>(Dependencies.SearchService);

    const magicSearchRouteHandler = new MagicSearchRouteHandler(advancedQueryService, apiHelperService);
    const regularSearchRouteHandler = new RegularSearchRouteHandler(searchService);

    return [
        new MagicSearchRouteProvider(magicSearchRouteHandler),
        new RegularSearchRouteProvider(regularSearchRouteHandler),
    ];
}