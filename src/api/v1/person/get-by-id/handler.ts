import { GetPersonByIdRequestDto } from "@src/model/external/dto/get-person-by-id-request";
import { GetPersonByIdResponseDto } from "@src/model/external/dto/get-person-by-id-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { ExternalProviderService } from "@src/module/external-provider/service";
import { GameService } from "@src/module/game/service";
import { PersonService } from "@src/module/person/service";
import { StatsService } from "@src/module/stats/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { promiseAllObject } from "@src/util/common";

export class GetPersonByIdRouteHandler implements RouteHandler<GetPersonByIdRequestDto, GetPersonByIdResponseDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly externalProviderService: ExternalProviderService,
        private readonly gameService: GameService,
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

        let isReferee = false;

        if (dto.includeStatistics === true) {
            const { performanceStatsDetailsContext, refereeGames } = await promiseAllObject({
                performanceStatsDetailsContext: this.statsService.getPlayerStats([person.id], {}),
                refereeGames: this.gameService.getOrderedGamesForReferee(person.id),
            });
            
            const playerPerformanceStatsDetails = performanceStatsDetailsContext.playerStats?.get(person.id) || new Map();
            const goalsAgainstClubsStatsDetails = performanceStatsDetailsContext.goalsAgainstClub?.get(person.id) || [];

            response.stats = {
                performance: this.apiHelper.convertPerformanceStatsDetailsMapToDto(playerPerformanceStatsDetails, performanceStatsDetailsContext.seasons!, performanceStatsDetailsContext.competitions!),
                goalsAgainstClubs: this.apiHelper.convertGoalsAgainstClubsStatsItems(goalsAgainstClubsStatsDetails, performanceStatsDetailsContext.clubs!),
            }

            const opponentPerformanceStats = performanceStatsDetailsContext.playerOpponentStats?.get(person.id);
            if (opponentPerformanceStats) {
                response.stats.opponent = this.apiHelper.convertToPlayerStatsItemDto(opponentPerformanceStats);
            }

            if (refereeGames.length > 0) {
                isReferee = true;
                response.stats.refereeGames = await this.apiHelper.getOrderedBasicGameDtos(refereeGames);
            }
        }

        if (externalProviderPersons.length > 0) {
            response.externalLinks = this.apiHelper.convertExternalProviderPersonLinks(person, externalProviderPersons, isReferee);
        }
        
        return response;
    }

}