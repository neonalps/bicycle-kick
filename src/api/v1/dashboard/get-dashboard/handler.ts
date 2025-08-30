import { DashboardRequestDto } from "@src/model/external/dto/dashboard-request";
import { DashboardResponseDto } from "@src/model/external/dto/dashboard-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { DashboardService } from "@src/module/dashboard/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { isDefined, requireSingleArrayElement } from "@src/util/common";

export class GetDashboardHandler implements RouteHandler<DashboardRequestDto, DashboardResponseDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly dashboardService: DashboardService,
    ) {}

    public async handle(_: AuthenticationContext, dto: DashboardRequestDto): Promise<DashboardResponseDto> {
        const dashboard = await this.dashboardService.getDashboard(dto.widgets, dto.competition ? Number(dto.competition) : undefined);

        const response: DashboardResponseDto = {};

        if (isDefined(dashboard.nextGame)) {
            const nextGame = await this.apiHelper.getOrderedBasicGameDtos([dashboard.nextGame]);
            response.upcomingGame = requireSingleArrayElement(nextGame);
        }

        if (isDefined(dashboard.previousGame)) {
            const previousGame = await this.apiHelper.getOrderedBasicGameDtos([dashboard.previousGame]);
            response.lastGame = requireSingleArrayElement(previousGame);
        }

        if (isDefined(dashboard.performanceTrend)) {
            const games = await this.apiHelper.getOrderedDetailedGameDtos(dashboard.performanceTrend.games.map(game => game.id));
            response.performanceTrend = {
                score: dashboard.performanceTrend.score,
                games,
            };
        }

        if (isDefined(dashboard.topScorers)) {
            response.topScorers = {
                competitions: dashboard.topScorers.competitions.map(item => this.apiHelper.convertCompetitionToSmallDto(item)),
                ranking: dashboard.topScorers.ranking.map(item => {
                    return {
                        rank: item.rank,
                        player: this.apiHelper.convertPersonToBasicDto(item.person),
                        value: item.value,
                    }
                })
            }
        }

        return response;
    }

}