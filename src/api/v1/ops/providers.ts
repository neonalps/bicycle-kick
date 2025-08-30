import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { SofascoreGameProvider } from "@src/module/external-provider/sofascore/game-provider";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GameService } from "@src/module/game/service";
import { CreateGameViaExternalProviderRouteProvider } from "./create-via-external-provider/route-provider";
import { CreateGameViaExternalProviderRouteHandler } from "./create-via-external-provider/handler";
import { ImportGameRouteHandler } from "./import-game/handler";
import { ImportGameRouteProvider } from "./import-game/route-provider";
import { SofascoreGameImporter } from "@src/module/external-provider/sofascore/game-importer";

export function getOpsRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const gameService = dependencyManager.get<GameService>(Dependencies.GameService);
    const sofascoreGameImporter = dependencyManager.get<SofascoreGameImporter>(Dependencies.SofascoreGameImporter);
    const sofascoreGameProvider = dependencyManager.get<SofascoreGameProvider>(Dependencies.SofascoreGameProvider);

    const createGameViaExternalProviderHandler = new CreateGameViaExternalProviderRouteHandler(apiHelperService, sofascoreGameProvider, gameService);
    const importGameHandler = new ImportGameRouteHandler(gameService, sofascoreGameImporter);

    return [
        new CreateGameViaExternalProviderRouteProvider(createGameViaExternalProviderHandler),
        new ImportGameRouteProvider(importGameHandler),
    ];
}