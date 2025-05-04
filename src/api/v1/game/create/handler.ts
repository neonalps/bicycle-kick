import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { ApiHelperService } from "@src/module/api-helper/service";
import { CreateGameRequestDto } from "@src/model/external/dto/create-game-request";
import { PermissionService } from "@src/module/permission/service";
import { AccountRole } from "@src/model/type/account-role";
import { AuthenticationError } from "@src/api/error/authentication";
import { GameService } from "@src/module/game/service";
import { DetailedGameDto } from "@src/model/external/dto/detailed-game";
import { requireSingleArrayElement } from "@src/util/common";

export class CreateGameRouteHandler implements RouteHandler<CreateGameRequestDto, DetailedGameDto> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly gameService: GameService,
        private readonly permissionService: PermissionService,
    ) {}

    public async handle(context: AuthenticationContext, dto: CreateGameRequestDto): Promise<DetailedGameDto> {
        if (!context.authenticated || context.account === null) {
            throw new AuthenticationError(`No authentication present`);
        }

        this.permissionService.validatePermission(AccountRole.Manager, context.account.roles);
        
        const createdGame = await this.gameService.create(dto);
        const gameDetails = await this.apiHelperService.getOrderedDetailedGameDtos([createdGame.id]);
        return requireSingleArrayElement(gameDetails);
    }

}