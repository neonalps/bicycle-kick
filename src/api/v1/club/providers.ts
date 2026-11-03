import { RouteProvider } from "@src/router/types";
import { GetClubByIdRouteHandler } from "./get-by-id/handler";
import { GetClubByIdRouteProvider } from "./get-by-id/route-provider";
import { ApplicationServices } from "@src/di/services";
import { CreateClubRouteHandler } from "./create/handler";
import { CreateClubRouteProvider } from "./create/route-provider";
import { UpdateClubByIdRouteHandler } from "./update-by-id/handler";
import { UpdateClubByIdRouteProvider } from "./update-by-id/route-provider";
import { SetClubAvatarRouteHandler } from "./set-avatar/handler";
import { RemoveClubAvatarRouteHandler } from "./remove-avatar/handler";
import { RemoveClubAvatarRouteProvider } from "./remove-avatar/route-provider";
import { SetClubAvatarRouteProvider } from "./set-avatar/route-provider";

export function getClubRouteProviders(services: ApplicationServices, mainClubId: number): RouteProvider<any, any>[] {

    const createClubHandler = new CreateClubRouteHandler(services.apiHelperService, services.clubService);
    const getClubByIdHandler = new GetClubByIdRouteHandler(services.apiHelperService, services.clubService, services.externalProviderService, services.gameService, services.venueService, mainClubId);
    const removeClubAvatarHandler = new RemoveClubAvatarRouteHandler(services.clubService);
    const setClubAvatarHandler = new SetClubAvatarRouteHandler(services.apiHelperService, services.clubService, services.storageService);
    const updateClubByIdHandler = new UpdateClubByIdRouteHandler(services.apiHelperService, services.clubService);

    return [
        new CreateClubRouteProvider(createClubHandler),
        new GetClubByIdRouteProvider(getClubByIdHandler),
        new RemoveClubAvatarRouteProvider(removeClubAvatarHandler),
        new SetClubAvatarRouteProvider(setClubAvatarHandler),
        new UpdateClubByIdRouteProvider(updateClubByIdHandler),
    ];
}