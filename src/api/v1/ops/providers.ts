import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { SofascoreGameProvider } from "@src/module/external-provider/sofascore/game-provider";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GameService } from "@src/module/game/service";
import { CreateGameViaExternalProviderRouteProvider } from "./create-via-external-provider/route-provider";
import { CreateGameViaExternalProviderRouteHandler } from "./create-via-external-provider/handler";
import { WeltfussballClient } from "@src/module/external-provider/weltfussball/client";
import { LoadExternalMatchdayDetailsRouteHandler } from "./load-external-matchday-details/handler";
import { LoadExternalMatchdayDetailsRouteProvider } from "./load-external-matchday-details/route-provider";
import { ExternalProviderService } from "@src/module/external-provider/service";

export function getOpsRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const sofascoreGameProvider = dependencyManager.get<SofascoreGameProvider>(Dependencies.SofascoreGameProvider);
    const gameService = dependencyManager.get<GameService>(Dependencies.GameService);
    const externalProviderService = dependencyManager.get<ExternalProviderService>(Dependencies.ExternalProviderService);
    const weltfussballClient = dependencyManager.get<WeltfussballClient>(Dependencies.WeltfussballClient);

    const createGameViaExternalProviderHandler = new CreateGameViaExternalProviderRouteHandler(apiHelperService, sofascoreGameProvider, gameService);
    const loadExternalMatchdayDetailsHandler = new LoadExternalMatchdayDetailsRouteHandler(weltfussballClient, externalProviderService);

    return [
        new CreateGameViaExternalProviderRouteProvider(createGameViaExternalProviderHandler),
        new LoadExternalMatchdayDetailsRouteProvider(loadExternalMatchdayDetailsHandler),
    ];
}