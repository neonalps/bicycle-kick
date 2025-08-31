import { RouteProvider } from "@src/router/types";
import { MagicSearchRouteHandler } from "./magic/handler";
import { MagicSearchRouteProvider } from "./magic/route-provider";
import { RegularSearchRouteHandler } from "./regular/handler";
import { RegularSearchRouteProvider } from "./regular/route-provider";
import { ApplicationServices } from "@src/di/services";

export function getSearchRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const magicSearchRouteHandler = new MagicSearchRouteHandler(services.advancedQueryService, services.apiHelperService);
    const regularSearchRouteHandler = new RegularSearchRouteHandler(services.searchService);

    return [
        new MagicSearchRouteProvider(magicSearchRouteHandler),
        new RegularSearchRouteProvider(regularSearchRouteHandler),
    ];
}