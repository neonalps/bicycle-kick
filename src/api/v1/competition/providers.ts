import { ApplicationServices } from "@src/di/services";
import { RouteProvider } from "@src/router/types";
import { GetAllCompetitionsRouteHandler } from "./get-all/handler";
import { GetAllCompetitionsRouteProvider } from "./get-all/route-provider";
import { GetCompetitionByIdRouteHandler } from "./get-by-id/handler";
import { GetCompetitionByIdRouteProvider } from "./get-by-id/route-provider";

export function getCompetitionRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const getAllCompetitionsHandler = new GetAllCompetitionsRouteHandler(services.apiHelperService, services.cacheService, services.competitionService, services.paginationService);
    const getCompetitionByIdHandler = new GetCompetitionByIdRouteHandler(services.apiHelperService, services.competitionService, services.seasonTitlesService);

    return [
        new GetAllCompetitionsRouteProvider(getAllCompetitionsHandler),
        new GetCompetitionByIdRouteProvider(getCompetitionByIdHandler),
    ];
}