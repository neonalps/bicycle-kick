import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { ApiHelperService } from "@src/module/api-helper/service";
import { PersonService } from "@src/module/person/service";
import { StatsService } from "@src/module/stats/service";
import { GetPersonByIdRouteHandler } from "./get-by-id/handler";
import { GetPersonByIdRouteProvider } from "./get-by-id/route-provider";
import { ExternalProviderService } from "@src/module/external-provider/service";

export function getPersonRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const externalProviderService = dependencyManager.get<ExternalProviderService>(Dependencies.ExternalProviderService);
    const personService = dependencyManager.get<PersonService>(Dependencies.PersonService);
    const statsService = dependencyManager.get<StatsService>(Dependencies.StatsService);

    const getPlayerByIdRouteHandler = new GetPersonByIdRouteHandler(apiHelperService, externalProviderService, personService, statsService);

    return [
        new GetPersonByIdRouteProvider(getPlayerByIdRouteHandler),
    ];
}