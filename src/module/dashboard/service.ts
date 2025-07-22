import { Dashboard } from "@src/model/internal/dashboard";
import { GameService } from "@src/module/game/service";
import { isDefined, promiseAllObject } from "@src/util/common";
import { DateSource } from "@src/util/date";
import { calculatePerformanceTrend } from "@src/module/stats/util";
import { SeasonService } from "@src/module/season/service";

export class DashboardService {

    constructor(
        private readonly gameService: GameService,
        private readonly seasonService: SeasonService,
        private readonly dateSource: DateSource,
    ) {}

    async getDashboard(): Promise<Dashboard> {
        const today = this.dateSource.getToday();
        const currentSeason = await this.seasonService.requireCurrent();
        const games = await promiseAllObject({
            next: this.gameService.getNextGames(today, 1),
            previous: this.gameService.getPreviousGames(today, 1),
            trend: this.gameService.getLastFinishedGames(5, { onlySeasons: [currentSeason.id] }),
        });

        const dashboard: Dashboard = {};

        if (games.next.length === 1) {
            dashboard.nextGame = games.next[0];
        }

        if (games.previous.length === 1) {
            dashboard.previousGame = games.previous[0];
        }

        if (isDefined(games.trend)) {
            const trendScore = calculatePerformanceTrend(games.trend.map(game => game.resultTendency));
            dashboard.performanceTrend = {
                score: trendScore,
                games: games.trend.reverse(),
            }
        }

        return dashboard;
    }
    
}