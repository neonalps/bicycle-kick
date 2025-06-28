import { DashboardResponseDto } from "@src/model/external/dto/dashboard-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { DashboardService } from "@src/module/dashboard/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { isDefined, requireSingleArrayElement } from "@src/util/common";

export class GetDashboardHandler implements RouteHandler<void, DashboardResponseDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly dashboardService: DashboardService,
    ) {}

    public async handle(_: AuthenticationContext): Promise<DashboardResponseDto> {
        const dashboard = await this.dashboardService.getDashboard();

        const response: DashboardResponseDto = {};

        if (isDefined(dashboard.nextGame)) {
            const nextGame = await this.apiHelper.getOrderedDetailedGameDtos([dashboard.nextGame.id]);
            response.upcomingGame = requireSingleArrayElement(nextGame);
        }

        if (isDefined(dashboard.previousGame)) {
            const previousGame = await this.apiHelper.getOrderedDetailedGameDtos([dashboard.previousGame.id]);
            response.lastGame = requireSingleArrayElement(previousGame);
        }

        if (isDefined(dashboard.performanceTrend)) {
            const games = await this.apiHelper.getOrderedDetailedGameDtos(dashboard.performanceTrend.games.map(game => game.id));
            response.performanceTrend = {
                score: dashboard.performanceTrend.score,
                games,
            };
        }

        return response;
    }

}