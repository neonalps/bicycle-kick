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

export function getSeasonRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const gameService = dependencyManager.get<GameService>(Dependencies.GameService);
    const paginationService = dependencyManager.get<PaginationService>(Dependencies.PaginationService);
    const seasonService = dependencyManager.get<SeasonService>(Dependencies.SeasonService);
    
    const getAllSeasonsHandler = new GetAllSeasonsRouteHandler(apiHelperService, paginationService, seasonService);
    const getSeasonGamesHandler = new GetSeasonGamesRouteHandler(apiHelperService, gameService, paginationService, seasonService);

    return [
        new GetAllSeasonsRouteProvider(getAllSeasonsHandler),
        new GetSeasonGamesRouteProvider(getSeasonGamesHandler),
    ];
}