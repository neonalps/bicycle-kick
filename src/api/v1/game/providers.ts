import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { SofascoreGameProvider } from "@src/module/external-provider/sofascore/game-provider";
import { CreateGameViaExternalProviderRouteHandler } from "./create-via-external-provider/handler";
import { CreateGameViaExternalProviderRouteProvider } from "./create-via-external-provider/route-provider";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GameService } from "@src/module/game/service";

export function getGameRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const sofascoreGameProvider = dependencyManager.get<SofascoreGameProvider>(Dependencies.SofascoreGameProvider);
    const gameService = dependencyManager.get<GameService>(Dependencies.GameService);

    const createGameViaExternalProviderHandler = new CreateGameViaExternalProviderRouteHandler(apiHelperService, sofascoreGameProvider, gameService);

    return [
        new CreateGameViaExternalProviderRouteProvider(createGameViaExternalProviderHandler),
    ];
}