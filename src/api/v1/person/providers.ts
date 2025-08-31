import { RouteProvider } from "@src/router/types";
import { GetPersonByIdRouteHandler } from "./get-by-id/handler";
import { GetPersonByIdRouteProvider } from "./get-by-id/route-provider";
import { GetPersonGamesPlayedRouteHandler } from "./games-played/handler";
import { GetPersonGamesPlayedRouteProvider } from "./games-played/route-provider";
import { ApplicationServices } from "@src/di/services";

export function getPersonRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const getPlayerByIdRouteHandler = new GetPersonByIdRouteHandler(services.apiHelperService, services.externalProviderService, services.gameService, services.personService, services.statsService);
    const getPersonGamesPlayedRouteHandler = new GetPersonGamesPlayedRouteHandler(services.apiHelperService, services.gamePlayerService, services.paginationService);

    return [
        new GetPersonByIdRouteProvider(getPlayerByIdRouteHandler),
        new GetPersonGamesPlayedRouteProvider(getPersonGamesPlayedRouteHandler),
    ];
}