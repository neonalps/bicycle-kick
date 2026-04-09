import { ApplicationServices } from "@src/di/services";
import { RouteProvider } from "@src/router/types";
import { GetAllCompetitionsRouteHandler } from "./get-all/handler";
import { GetAllCompetitionsRouteProvider } from "./get-all/route-provider";

export function getCompetitionRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const getAllCompetitionsHandler = new GetAllCompetitionsRouteHandler(services.apiHelperService, services.cacheService, services.competitionService, services.paginationService);

    return [
        new GetAllCompetitionsRouteProvider(getAllCompetitionsHandler),
    ];
}