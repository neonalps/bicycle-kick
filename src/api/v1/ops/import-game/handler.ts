import { ImportGameRequestDto } from "@src/model/external/dto/import-game-request";
import { ImportGameResponseDto } from "@src/model/external/dto/import-game-response";
import { SofascoreGameImporter } from "@src/module/external-provider/sofascore/game-importer";
import { GameService } from "@src/module/game/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class ImportGameRouteHandler implements RouteHandler<ImportGameRequestDto, ImportGameResponseDto> {

    constructor(
        private readonly gameService: GameService,
        private readonly gameImporter: SofascoreGameImporter, 
    ) {}

    public async handle(_: AuthenticationContext, dto: ImportGameRequestDto): Promise<ImportGameResponseDto> {
        const game = await this.gameService.requireById(dto.gameId);
        const createGameInput = await this.gameImporter.importGameDetails(game);

        try {
            await this.gameService.create(createGameInput);

            return {
                success: true,
            }
        } catch (err) {
            console.error(err);

            return {
                success: false,
                error: (err as Error).message,
            }
        }
    }

}