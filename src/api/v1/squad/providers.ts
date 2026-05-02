import { RouteProvider } from "@src/router/types";
import { ApplicationServices } from "@src/di/services";
import { GetActiveSquadMembersRouteHandler } from "./get-active/handler";
import { GetActiveSquadMembersRouteProvider } from "./get-active/route-provider";

export function getSquadRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const getActiveSquadMembersHandler = new GetActiveSquadMembersRouteHandler(services.apiHelperService, services.cacheService, services.squadService);

    return [
        new GetActiveSquadMembersRouteProvider(getActiveSquadMembersHandler),
    ];
}