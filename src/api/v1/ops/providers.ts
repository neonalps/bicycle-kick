import { RouteProvider } from "@src/router/types";
import { CreateGameViaExternalProviderRouteProvider } from "./create-via-external-provider/route-provider";
import { CreateGameViaExternalProviderRouteHandler } from "./create-via-external-provider/handler";
import { ImportGameRouteHandler } from "./import-game/handler";
import { ImportGameRouteProvider } from "./import-game/route-provider";
import { ApplicationServices } from "@src/di/services";

export function getOpsRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const createGameViaExternalProviderHandler = new CreateGameViaExternalProviderRouteHandler(services.apiHelperService, services.sofascoreGameProvider, services.gameService);
    const importGameHandler = new ImportGameRouteHandler(services.gameService, services.sofascoreGameImporter);

    return [
        new CreateGameViaExternalProviderRouteProvider(createGameViaExternalProviderHandler),
        new ImportGameRouteProvider(importGameHandler),
    ];
}