import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { GameStarService } from "@src/module/game-star/service";
import { GameIdRequestDto } from "@src/model/external/dto/game-id-request";
import { AuthenticationError } from "@src/api/error/authentication";

export class UnstarGameHandler implements RouteHandler<GameIdRequestDto, void> {

    constructor(private readonly gameStarService: GameStarService) {}

    public async handle(context: AuthenticationContext, dto: GameIdRequestDto): Promise<void> {
        if (!context.authenticated || context.account === null) {
            throw new AuthenticationError(`No authentication present`);
        }
        
        await this.gameStarService.setGameStarStatus(context.account.id, dto.gameId, false);
    }

}