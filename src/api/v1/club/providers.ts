import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { ApiHelperService } from "@src/module/api-helper/service";
import { ClubService } from "@src/module/club/service";
import { GetClubByIdRouteHandler } from "./get-by-id/handler";
import { GetClubByIdRouteProvider } from "./get-by-id/route-provider";
import { getMainClubId } from "@src/config";
import { GameService } from "@src/module/game/service";
import { ExternalProviderService } from "@src/module/external-provider/service";

export function getClubRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const clubService = dependencyManager.get<ClubService>(Dependencies.ClubService);
    const externalProviderService = dependencyManager.get<ExternalProviderService>(Dependencies.ExternalProviderService);
    const gameService = dependencyManager.get<GameService>(Dependencies.GameService);

    const getClubByIdHandler = new GetClubByIdRouteHandler(apiHelperService, clubService, externalProviderService, gameService, getMainClubId());

    return [
        new GetClubByIdRouteProvider(getClubByIdHandler),
    ];
}