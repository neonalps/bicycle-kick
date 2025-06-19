import { GetPersonByIdRequestDto } from "@src/model/external/dto/get-person-by-id-request";
import { GetPersonByIdResponseDto } from "@src/model/external/dto/get-person-by-id-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { PersonService } from "@src/module/person/service";
import { StatsService } from "@src/module/stats/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { ensureNotNullish } from "@src/util/common";

export class GetPersonByIdRouteHandler implements RouteHandler<GetPersonByIdRequestDto, GetPersonByIdResponseDto> {

    constructor(
        private readonly apiHelper: ApiHelperService, 
        private readonly personService: PersonService,
        private readonly statsService: StatsService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetPersonByIdRequestDto): Promise<GetPersonByIdResponseDto> {
        const person = await this.personService.getById(dto.personId);
        if (person === null) {
            throw new Error(`No person with ID ${dto.personId} exists`);
        }

        const response: GetPersonByIdResponseDto = {
            person: this.apiHelper.convertPersonToBasicDto(person),
        }

        if (dto.includeStatistics === true) {
            const statsDetailsContext = await this.statsService.getPlayerStats([person.id]);
            const playerStatsDetails = ensureNotNullish(statsDetailsContext.playerStats.get(person.id));

            response.stats = this.apiHelper.convertStatsDetailsMapToDto(playerStatsDetails, statsDetailsContext.seasons, statsDetailsContext.competitions);
        }
        
        return response;
    }

}