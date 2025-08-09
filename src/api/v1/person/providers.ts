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
import { PermissionService } from "@src/module/permission/service";
import { GetPersonGamesPlayedRouteProvider } from "./games-played/route-provider";

export function getPersonRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const externalProviderService = dependencyManager.get<ExternalProviderService>(Dependencies.ExternalProviderService);
    const gamePlayerService = dependencyManager.get<GamePlayerService>(Dependencies.GamePlayerService);
    const paginationService = dependencyManager.get<PaginationService>(Dependencies.PaginationService);
    const permissionService = dependencyManager.get<PermissionService>(Dependencies.PermissionService);
    const personService = dependencyManager.get<PersonService>(Dependencies.PersonService);
    const statsService = dependencyManager.get<StatsService>(Dependencies.StatsService);

    const getPlayerByIdRouteHandler = new GetPersonByIdRouteHandler(apiHelperService, externalProviderService, personService, statsService);
    const getPersonGamesPlayedRouteHandler = new GetPersonGamesPlayedRouteHandler(apiHelperService, gamePlayerService, paginationService, permissionService);

    return [
        new GetPersonByIdRouteProvider(getPlayerByIdRouteHandler),
        new GetPersonGamesPlayedRouteProvider(getPersonGamesPlayedRouteHandler),
    ];
}