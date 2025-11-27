import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { GameStarService } from "@src/module/game-star/service";
import { GameIdRequestDto } from "@src/model/external/dto/game-id-request";
import { ensureNotNullish } from "@src/util/common";

export class StarGameHandler implements RouteHandler<GameIdRequestDto, void> {

    constructor(private readonly gameStarService: GameStarService) {}

    public async handle(context: AuthenticationContext, dto: GameIdRequestDto): Promise<void> {
        await this.gameStarService.setGameStarStatus(ensureNotNullish(context.account).id, +dto.gameId, true);
    }

}