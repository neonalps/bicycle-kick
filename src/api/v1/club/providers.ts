import { RouteProvider } from "@src/router/types";
import { GetClubByIdRouteHandler } from "./get-by-id/handler";
import { GetClubByIdRouteProvider } from "./get-by-id/route-provider";
import { getMainClubId } from "@src/config";
import { ApplicationServices } from "@src/di/services";
import { CreateClubRouteHandler } from "./create/handler";
import { CreateClubRouteProvider } from "./create/route-provider";
import { UpdateClubByIdRouteHandler } from "./update-by-id/handler";
import { UpdateClubByIdRouteProvider } from "./update-by-id/route-provider";

export function getClubRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const createClubHandler = new CreateClubRouteHandler(services.apiHelperService, services.clubService);
    const getClubByIdHandler = new GetClubByIdRouteHandler(services.apiHelperService, services.clubService, services.externalProviderService, services.gameService, getMainClubId());
    const updateClubByIdHandler = new UpdateClubByIdRouteHandler(services.apiHelperService, services.clubService);

    return [
        new CreateClubRouteProvider(createClubHandler),
        new GetClubByIdRouteProvider(getClubByIdHandler),
        new UpdateClubByIdRouteProvider(updateClubByIdHandler),
    ];
}