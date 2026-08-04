import { GetPersonByIdRequestDto } from "@src/model/external/dto/get-person-by-id-request";
import { GetPersonByIdResponseDto } from "@src/model/external/dto/get-person-by-id-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { ExternalProviderService } from "@src/module/external-provider/service";
import { GameService } from "@src/module/game/service";
import { ManagerPeriodService } from "@src/module/manager-period/service";
import { PersonContractService } from "@src/module/person-contracts/service";
import { PersonService } from "@src/module/person/service";
import { StatsService } from "@src/module/stats/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { isDefined, promiseAllObject } from "@src/util/common";
import { PersonId } from "@src/util/domain-types";

export class GetPersonByIdRouteHandler implements RouteHandler<GetPersonByIdRequestDto, GetPersonByIdResponseDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly externalProviderService: ExternalProviderService,
        private readonly gameService: GameService,
        private readonly managerPeriodService: ManagerPeriodService,
        private readonly personService: PersonService,
        private readonly personContractService: PersonContractService,
        private readonly statsService: StatsService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetPersonByIdRequestDto): Promise<GetPersonByIdResponseDto> {
        const personId: PersonId = Number(dto.personId);

        const { person, externalProviderPersons } = await promiseAllObject({
            person: this.personService.requireById(personId),
            externalProviderPersons: this.externalProviderService.getExternalProvidersForPerson(personId),
        });

        const response: GetPersonByIdResponseDto = {
            person: this.apiHelper.convertPersonToBasicDto(person),
        }

        let isReferee = false;
        let isManager = false;

        if (dto.includeContract) {
            const potentialContract = await this.personContractService.getCurrentForPerson(personId);
            if (isDefined(potentialContract)) {
                response.contract = this.apiHelper.convertContractForPersonDto(potentialContract);
            }
        }

        if (dto.includeStatistics) {
            const { performanceStatsDetailsContext, refereeGames, managerPeriods } = await promiseAllObject({
                performanceStatsDetailsContext: this.statsService.getPlayerStats([person.id], {}),
                refereeGames: this.gameService.getOrderedGamesForReferee(person.id),
                managerPeriods: this.managerPeriodService.getForPerson(person.id),
            });
            
            const playerPerformanceStatsDetails = performanceStatsDetailsContext.playerStats?.get(person.id) || new Map();
            const goalsAgainstClubsStatsDetails = performanceStatsDetailsContext.goalsAgainstClub?.get(person.id) || [];
            const goalTypes = performanceStatsDetailsContext.goalTypes?.get(person.id) || [];

            response.stats = {
                performance: this.apiHelper.convertPerformanceStatsDetailsMapToDto(playerPerformanceStatsDetails, performanceStatsDetailsContext.seasons!, performanceStatsDetailsContext.competitions!),
                goalsAgainstClubs: this.apiHelper.convertGoalsAgainstClubsStatsItems(goalsAgainstClubsStatsDetails, performanceStatsDetailsContext.clubs!),
                goalTypes: this.apiHelper.convertGoalTypeStatsItems(goalTypes),
            }

            const opponentPerformanceStats = performanceStatsDetailsContext.playerOpponentStats?.get(person.id);
            if (opponentPerformanceStats) {
                response.stats.opponent = this.apiHelper.convertToPlayerStatsItemDto(opponentPerformanceStats);
            }

            if (refereeGames.length > 0) {
                isReferee = true;
                response.stats.refereeGames = await this.apiHelper.getOrderedBasicGameDtos(refereeGames);
            } else {
                response.stats.shirtDistribution = await this.statsService.getShirtDistribution(person.id);
            }

            if (managerPeriods.length > 0) {
                isManager = true;
                response.stats.managerPeriods = await this.apiHelper.convertManagerPeriodsToDtosForPerson(managerPeriods);
            }
        }

        if (externalProviderPersons.length > 0) {
            response.externalLinks = this.apiHelper.convertExternalProviderPersonLinks(person, externalProviderPersons, isManager, isReferee);
        }
        
        return response;
    }

}