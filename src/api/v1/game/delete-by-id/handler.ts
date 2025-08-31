import { DeleteGameByIdRequestDto } from "@src/model/external/dto/delete-game-by-id-request";
import { GameService } from "@src/module/game/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class DeleteGameByIdRouteHandler implements RouteHandler<DeleteGameByIdRequestDto, void> {

    constructor(
        private readonly gameService: GameService,
    ) {}

    public async handle(_: AuthenticationContext, dto: DeleteGameByIdRequestDto): Promise<void> {
        await this.gameService.deleteById(dto.gameId);
    }

}