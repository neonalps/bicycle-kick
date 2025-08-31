import { RouteProvider } from "@src/router/types";
import { GetAllSeasonsRouteHandler } from "./get-all/handler";
import { GetSeasonGamesRouteHandler } from "./get-games/handler";
import { GetAllSeasonsRouteProvider } from "./get-all/route-provider";
import { GetSeasonGamesRouteProvider } from "./get-games/route-provider";
import { GetSeasonSquadRouteHandler } from "./get-squad/handler";
import { GetSeasonSquadRouteProvider } from "./get-squad/route-provider";
import { GetSeasonForDateHandler } from "./get-for-date/handler";
import { GetSeasonForDateRouteProvider } from "./get-for-date/route-provider";
import { ApplicationServices } from "@src/di/services";

export function getSeasonRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const getAllSeasonsHandler = new GetAllSeasonsRouteHandler(services.apiHelperService, services.cacheService, services.paginationService, services.seasonService);
    const getForDateHandler = new GetSeasonForDateHandler(services.apiHelperService, services.seasonService);
    const getSeasonGamesHandler = new GetSeasonGamesRouteHandler(services.apiHelperService, services.cacheService, services.gameService, services.paginationService);
    const getSeasonSquadHandler = new GetSeasonSquadRouteHandler(services.apiHelperService, services.squadService);

    return [
        new GetAllSeasonsRouteProvider(getAllSeasonsHandler),
        new GetSeasonForDateRouteProvider(getForDateHandler),
        new GetSeasonGamesRouteProvider(getSeasonGamesHandler),
        new GetSeasonSquadRouteProvider(getSeasonSquadHandler),
    ];
}