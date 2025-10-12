import { RouteProvider } from "@src/router/types";
import { GetPersonByIdRouteHandler } from "./get-by-id/handler";
import { GetPersonByIdRouteProvider } from "./get-by-id/route-provider";
import { GetPersonGamesPlayedRouteHandler } from "./games-played/handler";
import { GetPersonGamesPlayedRouteProvider } from "./games-played/route-provider";
import { ApplicationServices } from "@src/di/services";
import { CreatePersonRouteHandler } from "./create/handler";
import { CreatePersonRouteProvider } from "./create/route-provider";
import { UpdatePersonByIdRouteHandler } from "./update-by-id/handler";
import { UpdatePersonByIdRouteProvider } from "./update-by-id/route-provider";

export function getPersonRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const createPersonRouteHandler = new CreatePersonRouteHandler(services.apiHelperService, services.personService);
    const updatePersonByIdRouteHandler = new UpdatePersonByIdRouteHandler(services.apiHelperService, services.personService);
    const getPlayerByIdRouteHandler = new GetPersonByIdRouteHandler(services.apiHelperService, services.externalProviderService, services.gameService, services.personService, services.statsService);
    const getPersonGamesPlayedRouteHandler = new GetPersonGamesPlayedRouteHandler(services.apiHelperService, services.gamePlayerService, services.paginationService);

    return [
        new CreatePersonRouteProvider(createPersonRouteHandler),
        new UpdatePersonByIdRouteProvider(updatePersonByIdRouteHandler),
        new GetPersonByIdRouteProvider(getPlayerByIdRouteHandler),
        new GetPersonGamesPlayedRouteProvider(getPersonGamesPlayedRouteHandler),
    ];
}