import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { ApiHelperService } from "@src/module/api-helper/service";
import { CreateGameRequestDto } from "@src/model/external/dto/create-game-request";
import { GameService } from "@src/module/game/service";
import { DetailedGameDto } from "@src/model/external/dto/detailed-game";
import { requireSingleArrayElement } from "@src/util/common";

export class CreateGameRouteHandler implements RouteHandler<CreateGameRequestDto, DetailedGameDto> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly gameService: GameService,
    ) {}

    public async handle(_: AuthenticationContext, dto: CreateGameRequestDto): Promise<DetailedGameDto> {
        const createdGame = await this.gameService.create(dto);
        const gameDetails = await this.apiHelperService.getOrderedDetailedGameDtos([createdGame.id]);
        return requireSingleArrayElement(gameDetails);
    }

}