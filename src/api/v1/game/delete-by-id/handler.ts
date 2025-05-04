import { AuthenticationError } from "@src/api/error/authentication";
import { DeleteGameByIdRequestDto } from "@src/model/external/dto/delete-game-by-id-request";
import { AccountRole } from "@src/model/type/account-role";
import { GameService } from "@src/module/game/service";
import { PermissionService } from "@src/module/permission/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class DeleteGameByIdRouteHandler implements RouteHandler<DeleteGameByIdRequestDto, void> {

    constructor(
        private readonly gameService: GameService,
        private readonly permissionService: PermissionService,
    ) {}

    public async handle(context: AuthenticationContext, dto: DeleteGameByIdRequestDto): Promise<void> {
        /*if (!context.authenticated || context.account === null) {
            throw new AuthenticationError(`No authentication present`);
        }

        this.permissionService.validatePermission(AccountRole.Manager, context.account.roles);*/
        
        await this.gameService.deleteById(dto.gameId);
    }

}