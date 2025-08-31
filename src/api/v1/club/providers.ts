import { RouteProvider } from "@src/router/types";
import { GetClubByIdRouteHandler } from "./get-by-id/handler";
import { GetClubByIdRouteProvider } from "./get-by-id/route-provider";
import { getMainClubId } from "@src/config";
import { ApplicationServices } from "@src/di/services";

export function getClubRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const getClubByIdHandler = new GetClubByIdRouteHandler(services.apiHelperService, services.clubService, services.externalProviderService, services.gameService, getMainClubId());

    return [
        new GetClubByIdRouteProvider(getClubByIdHandler),
    ];
}