import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { ApiHelperService } from "@src/module/api-helper/service";
import { SeasonService } from "@src/module/season/service";
import { GameService } from "@src/module/game/service";
import { GetAllSeasonsRouteHandler } from "./get-all/handler";
import { PaginationService } from "@src/module/pagination/service";
import { GetSeasonGamesRouteHandler } from "./get-games/handler";
import { GetAllSeasonsRouteProvider } from "./get-all/route-provider";
import { GetSeasonGamesRouteProvider } from "./get-games/route-provider";
import { GetSeasonSquadRouteHandler } from "./get-squad/handler";
import { SquadService } from "@src/module/squad/service";
import { GetSeasonSquadRouteProvider } from "./get-squad/route-provider";
import { CacheService } from "@src/module/cache/service";
import { GetSeasonForDateHandler } from "./get-for-date/handler";
import { GetSeasonForDateRouteProvider } from "./get-for-date/route-provider";

export function getSeasonRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const cacheService = dependencyManager.get<CacheService>(Dependencies.CacheService);
    const gameService = dependencyManager.get<GameService>(Dependencies.GameService);
    const paginationService = dependencyManager.get<PaginationService>(Dependencies.PaginationService);
    const seasonService = dependencyManager.get<SeasonService>(Dependencies.SeasonService);
    const squadService = dependencyManager.get<SquadService>(Dependencies.SquadService);
    
    const getAllSeasonsHandler = new GetAllSeasonsRouteHandler(apiHelperService, cacheService, paginationService, seasonService);
    const getForDateHandler = new GetSeasonForDateHandler(apiHelperService, seasonService);
    const getSeasonGamesHandler = new GetSeasonGamesRouteHandler(apiHelperService, cacheService, gameService, paginationService);
    const getSeasonSquadHandler = new GetSeasonSquadRouteHandler(apiHelperService, squadService);

    return [
        new GetAllSeasonsRouteProvider(getAllSeasonsHandler),
        new GetSeasonForDateRouteProvider(getForDateHandler),
        new GetSeasonGamesRouteProvider(getSeasonGamesHandler),
        new GetSeasonSquadRouteProvider(getSeasonSquadHandler),
    ];
}