import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { AdvancedQueryService } from "@src/module/advanced-query/service";
import { RouteProvider } from "@src/router/types";
import { MagicSearchRouteHandler } from "./magic/handler";
import { MagicSearchRouteProvider } from "./magic/route-provider";

export function getSearchRouteProviders(): RouteProvider<any, any>[] {

    const advancedQueryService = dependencyManager.get<AdvancedQueryService>(Dependencies.AdvancedQueryService);

    const magicSearchRouteHandler = new MagicSearchRouteHandler(advancedQueryService);

    return [
        new MagicSearchRouteProvider(magicSearchRouteHandler),
    ];
}