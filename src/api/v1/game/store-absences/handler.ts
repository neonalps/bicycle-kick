import { StoreGameAbsencesRequestDto } from "@src/model/external/dto/store-game-absences-request";
import { GameAbsenceService } from "@src/module/game-absence/service";
import { GameService } from "@src/module/game/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { GameId } from "@src/util/domain-types";

export class StoreGameAbsencesHandler implements RouteHandler<StoreGameAbsencesRequestDto, void> {

    constructor(
        private readonly gameService: GameService,
        private readonly gameAbsenceService: GameAbsenceService,
    ) {}

    public async handle(_: AuthenticationContext, dto: StoreGameAbsencesRequestDto): Promise<void> {
        const gameId: GameId = Number(dto.gameId);
        await this.gameService.requireById(gameId);

        await this.gameAbsenceService.putForGame(gameId, dto.absences);
    }

}