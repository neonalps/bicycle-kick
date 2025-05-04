import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { SofascoreGameDto } from "@src/module/external-provider/sofascore/types";
import { SofascoreGameProvider } from "@src/module/external-provider/sofascore/game-provider";
import { GameService } from "@src/module/game/service";
import { ApiHelperService } from "@src/module/api-helper/service";
import { requireSingleArrayElement } from "@src/util/common";
import { DetailedGameDto } from "@src/model/external/dto/detailed-game";

export class CreateGameViaExternalProviderRouteHandler implements RouteHandler<SofascoreGameDto, DetailedGameDto> {

    constructor(
        private readonly apiHelper: ApiHelperService, 
        private readonly gameProvider: SofascoreGameProvider, 
        private readonly gameService: GameService
    ) {}

    public async handle(_: AuthenticationContext, dto: SofascoreGameDto): Promise<DetailedGameDto> {
        const createGameDto = await this.gameProvider.provide(dto);
        const createdGame = await this.gameService.create(createGameDto);
        const details = await this.apiHelper.getOrderedDetailedGameDtos([createdGame.id]);
        return requireSingleArrayElement(details);
    }

}