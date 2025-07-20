import { Dependencies } from "@src/di/dependencies";
import dependencyManager from "@src/di/manager";
import { RouteProvider } from "@src/router/types";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GameService } from "@src/module/game/service";
import { DeleteGameByIdRouteProvider } from "./delete-by-id/route-provider";
import { DeleteGameByIdRouteHandler } from "./delete-by-id/handler";
import { PermissionService } from "@src/module/permission/service";
import { GetGameByIdRouteHandler } from "./get-by-id/handler";
import { GetGameByIdRouteProvider } from "./get-by-id/route-provider";
import { GameStarService } from "@src/module/game-star/service";
import { StarGameHandler } from "./star/handler";
import { StarGameRouteProvider } from "./star/route-provider";
import { UnstarGameHandler } from "./unstar/handler";
import { UnstarGameRouteProvider } from "./unstar/route-provider";
import { AttendGameHandler } from "./attend/handler";
import { GameAttendedService } from "@src/module/game-attended/service";
import { AttendGameRouteProvider } from "./attend/route-provider";
import { UnattendGameHandler } from "./unattend/handler";
import { UnattendGameRouteProvider } from "./unattend/route-provider";
import { CreateGameRouteHandler } from "./create/handler";
import { CreateGameRouteProvider } from "./create/route-provider";

export function getGameRouteProviders(): RouteProvider<any, any>[] {

    const apiHelperService = dependencyManager.get<ApiHelperService>(Dependencies.ApiHelperService);
    const gameAttendService = dependencyManager.get<GameAttendedService>(Dependencies.GameAttendedService);
    const gameService = dependencyManager.get<GameService>(Dependencies.GameService);
    const gameStarService = dependencyManager.get<GameStarService>(Dependencies.GameStarService);
    const permissionService = dependencyManager.get<PermissionService>(Dependencies.PermissionService);

    const getGameByIdHandler = new GetGameByIdRouteHandler(apiHelperService, gameService, permissionService);
    const createGameHandler = new CreateGameRouteHandler(apiHelperService, gameService, permissionService);
    const deleteGameByIdHandler = new DeleteGameByIdRouteHandler(gameService, permissionService);
    const starGameHandler = new StarGameHandler(gameStarService);
    const unstarGameHandler = new UnstarGameHandler(gameStarService);
    const attendGameHandler = new AttendGameHandler(gameAttendService);
    const unattendGameHandler = new UnattendGameHandler(gameAttendService);

    return [
        new GetGameByIdRouteProvider(getGameByIdHandler),
        new CreateGameRouteProvider(createGameHandler),
        new DeleteGameByIdRouteProvider(deleteGameByIdHandler),
        new StarGameRouteProvider(starGameHandler),
        new UnstarGameRouteProvider(unstarGameHandler),
        new AttendGameRouteProvider(attendGameHandler),
        new UnattendGameRouteProvider(unattendGameHandler),
    ];
}