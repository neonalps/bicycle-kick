import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { ApiHelperService } from "@src/module/api-helper/service";
import { PersonService } from "@src/module/person/service";
import { StatsService } from "@src/module/stats/service";
import { GetPersonByIdRouteHandler } from "./get-by-id/handler";
import { GetPersonByIdRouteProvider } from "./get-by-id/route-provider";
import { ExternalProviderService } from "@src/module/external-provider/service";
import { GamePlayerService } from "@src/module/game-player/service";
import { GetPersonGamesPlayedRouteHandler } from "./games-played/handler";
import { PaginationService } from "@src/module/pagination/service";
import { GetPersonGamesPlayedRouteProvider } from "./games-played/route-provider";
import { GameService } from "@src/module/game/service";

export function getPersonRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const externalProviderService = dependencyManager.get<ExternalProviderService>(Dependencies.ExternalProviderService);
    const gameService = dependencyManager.get<GameService>(Dependencies.GameService);
    const gamePlayerService = dependencyManager.get<GamePlayerService>(Dependencies.GamePlayerService);
    const paginationService = dependencyManager.get<PaginationService>(Dependencies.PaginationService);
    const personService = dependencyManager.get<PersonService>(Dependencies.PersonService);
    const statsService = dependencyManager.get<StatsService>(Dependencies.StatsService);

    const getPlayerByIdRouteHandler = new GetPersonByIdRouteHandler(apiHelperService, externalProviderService, gameService, personService, statsService);
    const getPersonGamesPlayedRouteHandler = new GetPersonGamesPlayedRouteHandler(apiHelperService, gamePlayerService, paginationService);

    return [
        new GetPersonByIdRouteProvider(getPlayerByIdRouteHandler),
        new GetPersonGamesPlayedRouteProvider(getPersonGamesPlayedRouteHandler),
    ];
}