import { RouteProvider } from "@src/router/types";
import { DeleteGameByIdRouteProvider } from "./delete-by-id/route-provider";
import { DeleteGameByIdRouteHandler } from "./delete-by-id/handler";
import { GetGameByIdRouteHandler } from "./get-by-id/handler";
import { GetGameByIdRouteProvider } from "./get-by-id/route-provider";
import { StarGameHandler } from "./star/handler";
import { StarGameRouteProvider } from "./star/route-provider";
import { UnstarGameHandler } from "./unstar/handler";
import { UnstarGameRouteProvider } from "./unstar/route-provider";
import { AttendGameHandler } from "./attend/handler";
import { AttendGameRouteProvider } from "./attend/route-provider";
import { UnattendGameHandler } from "./unattend/handler";
import { UnattendGameRouteProvider } from "./unattend/route-provider";
import { CreateGameRouteHandler } from "./create/handler";
import { CreateGameRouteProvider } from "./create/route-provider";
import { GetMatchdayDetailsRouteHandler } from "./matchday-details/handler";
import { GetMatchdayDetailsRouteProvider } from "./matchday-details/route-provider";
import { ApplicationServices } from "@src/di/services";
import { UpdateGameByIdRouteHandler } from "./update-by-id/handler";
import { UpdateGameByIdRouteProvider } from "./update-by-id/route-provider";

export function getGameRouteProviders(services: ApplicationServices): RouteProvider<any, any>[] {

    const getGameByIdHandler = new GetGameByIdRouteHandler(services.apiHelperService, services.gameService);
    const createGameHandler = new CreateGameRouteHandler(services.apiHelperService, services.gameService);
    const deleteGameByIdHandler = new DeleteGameByIdRouteHandler(services.gameService);
    const updateGameByIdHandler = new UpdateGameByIdRouteHandler(services.apiHelperService, services.gameService);
    const starGameHandler = new StarGameHandler(services.gameStarService);
    const unstarGameHandler = new UnstarGameHandler(services.gameStarService);
    const attendGameHandler = new AttendGameHandler(services.gameAttendedService);
    const unattendGameHandler = new UnattendGameHandler(services.gameAttendedService);
    const loadExternalMatchdayDetailsHandler = new GetMatchdayDetailsRouteHandler(services.apiHelperService, services.matchdayDetailsService);

    return [
        new GetGameByIdRouteProvider(getGameByIdHandler),
        new CreateGameRouteProvider(createGameHandler),
        new DeleteGameByIdRouteProvider(deleteGameByIdHandler),
        new UpdateGameByIdRouteProvider(updateGameByIdHandler),
        new StarGameRouteProvider(starGameHandler),
        new UnstarGameRouteProvider(unstarGameHandler),
        new AttendGameRouteProvider(attendGameHandler),
        new UnattendGameRouteProvider(unattendGameHandler),
        new GetMatchdayDetailsRouteProvider(loadExternalMatchdayDetailsHandler),
    ];
}