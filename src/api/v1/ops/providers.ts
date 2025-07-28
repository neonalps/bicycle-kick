import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { SofascoreGameProvider } from "@src/module/external-provider/sofascore/game-provider";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GameService } from "@src/module/game/service";
import { CreateGameViaExternalProviderRouteProvider } from "./create-via-external-provider/route-provider";
import { CreateGameViaExternalProviderRouteHandler } from "./create-via-external-provider/handler";
import { WeltfussballClient } from "@src/module/external-provider/weltfussball/client";
import { MatchdayDetailsService } from "@src/module/matchday-details/service";
import { GetMatchdayDetailsRouteHandler } from "@src/api/v1/game/matchday-details/handler";
import { GetMatchdayDetailsRouteProvider } from "@src/api/v1/game/matchday-details/route-provider";

export function getOpsRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const sofascoreGameProvider = dependencyManager.get<SofascoreGameProvider>(Dependencies.SofascoreGameProvider);
    const gameService = dependencyManager.get<GameService>(Dependencies.GameService);
    const matchdayDetailsService = dependencyManager.get<MatchdayDetailsService>(Dependencies.MatchdayDetailsService);
    const weltfussballClient = dependencyManager.get<WeltfussballClient>(Dependencies.WeltfussballClient);

    const createGameViaExternalProviderHandler = new CreateGameViaExternalProviderRouteHandler(apiHelperService, sofascoreGameProvider, gameService);
    const loadExternalMatchdayDetailsHandler = new GetMatchdayDetailsRouteHandler(apiHelperService, matchdayDetailsService, weltfussballClient);

    return [
        new CreateGameViaExternalProviderRouteProvider(createGameViaExternalProviderHandler),
        new GetMatchdayDetailsRouteProvider(loadExternalMatchdayDetailsHandler),
    ];
}