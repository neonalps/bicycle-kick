import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { SofascoreGameProvider } from "@src/module/external-provider/sofascore/game-provider";
import { CreateGameViaExternalProviderRouteHandler } from "./create-via-external-provider/handler";
import { CreateGameViaExternalProviderRouteProvider } from "./create-via-external-provider/route-provider";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GameService } from "@src/module/game/service";
import { DeleteGameByIdRouteProvider } from "./delete-by-id/route-provider";
import { DeleteGameByIdRouteHandler } from "./delete-by-id/handler";
import { PermissionService } from "@src/module/permission/service";
import { GetGameByIdRouteHandler } from "./get-by-id/handler";
import { GetGameByIdRouteProvider } from "./get-by-id/route-provider";

export function getGameRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const sofascoreGameProvider = dependencyManager.get<SofascoreGameProvider>(Dependencies.SofascoreGameProvider);
    const gameService = dependencyManager.get<GameService>(Dependencies.GameService);
    const permissionService = dependencyManager.get<PermissionService>(Dependencies.PermissionService);

    const createGameViaExternalProviderHandler = new CreateGameViaExternalProviderRouteHandler(apiHelperService, sofascoreGameProvider, gameService);
    const getGameByIdHandler = new GetGameByIdRouteHandler(apiHelperService, gameService, permissionService);
    const deleteGameByIdHandler = new DeleteGameByIdRouteHandler(gameService, permissionService);

    return [
        new CreateGameViaExternalProviderRouteProvider(createGameViaExternalProviderHandler),
        new GetGameByIdRouteProvider(getGameByIdHandler),
        new DeleteGameByIdRouteProvider(deleteGameByIdHandler),
    ];
}