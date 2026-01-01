import { DetailedGameDto } from "@src/model/external/dto/detailed-game";
import { UpdateGameRequestDto } from "@src/model/external/dto/update-game-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GameService } from "@src/module/game/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { requireSingleArrayElement } from "@src/util/common";

export class UpdateGameByIdRouteHandler implements RouteHandler<UpdateGameRequestDto, DetailedGameDto> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly gameService: GameService,
    ) {}

    public async handle(_: AuthenticationContext, dto: UpdateGameRequestDto): Promise<DetailedGameDto> {
        const updatedGame = await this.gameService.update(dto.id, dto);
        const gameDetails = await this.apiHelperService.getOrderedDetailedGameDtos([updatedGame.id]);
        return requireSingleArrayElement(gameDetails);
    }

}