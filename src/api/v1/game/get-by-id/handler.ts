import { DetailedGameDto } from "@src/model/external/dto/detailed-game";
import { GetGameByIdRequestDto } from "@src/model/external/dto/get-game-by-id-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GameService } from "@src/module/game/service";
import { PermissionService } from "@src/module/permission/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { requireSingleArrayElement } from "@src/util/common";

export class GetGameByIdRouteHandler implements RouteHandler<GetGameByIdRequestDto, DetailedGameDto> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly gameService: GameService,
        private readonly permissionService: PermissionService,
    ) {}

    public async handle(context: AuthenticationContext, dto: GetGameByIdRequestDto): Promise<DetailedGameDto> {
        /*if (!context.authenticated || context.account === null) {
            throw new AuthenticationError(`No authentication present`);
        }

        this.permissionService.validatePermission(AccountRole.Manager, context.account.roles);*/
        
        const game = await this.gameService.getById(dto.gameId);
        if (game === null) {
            throw new Error(`No game with ID ${dto.gameId} exists`);
        }

        const details = await this.apiHelperService.getOrderedDetailedGameDtos([game.id]);
        return requireSingleArrayElement(details); 
    }

}