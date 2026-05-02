import { GameIdRequestDto } from "@src/model/external/dto/game-id-request";
import { PotentialGameAbsencesResponseDto } from "@src/model/external/dto/get-potential-game-absences-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GameAbsenceService } from "@src/module/game-absence/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { GameId } from "@src/util/domain-types";

export class FindPotentialGameAbsencesHandler implements RouteHandler<GameIdRequestDto, PotentialGameAbsencesResponseDto> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly gameAbsenceService: GameAbsenceService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GameIdRequestDto): Promise<PotentialGameAbsencesResponseDto> {
        const gameId: GameId = Number(dto.gameId);
        const potentialAbsences = await this.gameAbsenceService.findPotentialAbsencesForGame(gameId);
        
        return {
            potential: await this.apiHelperService.convertPotentialGameAbsencesToDto(potentialAbsences)
        };
    }

}