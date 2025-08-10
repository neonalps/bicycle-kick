import { GetPersonByIdRequestDto } from "@src/model/external/dto/get-person-by-id-request";
import { GetPersonByIdResponseDto } from "@src/model/external/dto/get-person-by-id-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { ExternalProviderService } from "@src/module/external-provider/service";
import { PersonService } from "@src/module/person/service";
import { StatsService } from "@src/module/stats/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { promiseAllObject } from "@src/util/common";

export class GetPersonByIdRouteHandler implements RouteHandler<GetPersonByIdRequestDto, GetPersonByIdResponseDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly externalProviderService: ExternalProviderService,
        private readonly personService: PersonService,
        private readonly statsService: StatsService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetPersonByIdRequestDto): Promise<GetPersonByIdResponseDto> {
        const { person, externalProviderPersons } = await promiseAllObject({
            person: this.personService.requireById(dto.personId),
            externalProviderPersons: this.externalProviderService.getExternalProvidersForPerson(dto.personId),
        });

        const response: GetPersonByIdResponseDto = {
            person: this.apiHelper.convertPersonToBasicDto(person),
        }

        if (externalProviderPersons.length > 0) {
            response.externalLinks = this.apiHelper.convertExternalProviderPersonLinks(person, externalProviderPersons);
        }

        if (dto.includeStatistics === true) {
            const performanceStatsDetailsContext = await this.statsService.getPlayerStats([person.id], {});
            const playerPerformanceStatsDetails = performanceStatsDetailsContext.playerStats?.get(person.id) || new Map();
            const goalsAgainstClubsStatsDetails = performanceStatsDetailsContext.goalsAgainstClub?.get(person.id) || [];

            response.stats = {
                performance: this.apiHelper.convertPerformanceStatsDetailsMapToDto(playerPerformanceStatsDetails, performanceStatsDetailsContext.seasons!, performanceStatsDetailsContext.competitions!),
                goalsAgainstClubs: this.apiHelper.convertGoalsAgainstClubsStatsItems(goalsAgainstClubsStatsDetails, performanceStatsDetailsContext.clubs!),
            }
        }
        
        return response;
    }

}