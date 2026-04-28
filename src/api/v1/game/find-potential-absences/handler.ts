import { PotentialGameAbsenceDto } from "@src/model/external/dto/game-absence-potential";
import { GameIdRequestDto } from "@src/model/external/dto/game-id-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GameAbsenceService } from "@src/module/game-absence/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { GameId } from "@src/util/domain-types";

export class FindPotentialGameAbsencesHandler implements RouteHandler<GameIdRequestDto, PotentialGameAbsenceDto[]> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly gameAbsenceService: GameAbsenceService,
    ) {}

    public async handle(context: AuthenticationContext, dto: GameIdRequestDto): Promise<PotentialGameAbsenceDto[]> {
        const gameId: GameId = Number(dto.gameId);
        const potentialAbsences = await this.gameAbsenceService.findPotentialAbsencesForGame(gameId);
        return await this.apiHelperService.convertPotentialGameAbsencesToDto(potentialAbsences);
    }

}