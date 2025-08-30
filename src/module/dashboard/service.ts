import { Dashboard } from "@src/model/internal/dashboard";
import { GameService } from "@src/module/game/service";
import { isDefined, promiseAllObject } from "@src/util/common";
import { DateSource } from "@src/util/date";
import { calculatePerformanceTrend } from "@src/module/stats/util";
import { SeasonService } from "@src/module/season/service";
import { StatsService } from "@src/module/stats/service";
import { CompetitionService } from "@src/module/competition/service";
import { PersonService } from "@src/module/person/service";
import { QueryOptions } from "@src/model/internal/query-options";
import { CompetitionId, SeasonId } from "@src/util/domain-types";
import { TopScorersInfo } from "@src/model/internal/stats-player";

export type DashboardWidget = keyof Dashboard;

export class DashboardService {

    constructor(
        private readonly competitionService: CompetitionService,
        private readonly dateSource: DateSource,
        private readonly gameService: GameService,
        private readonly personService: PersonService,
        private readonly seasonService: SeasonService,
        private readonly statsService: StatsService,
    ) {}

    async getDashboard(widgets?: DashboardWidget[], competitionId?: CompetitionId): Promise<Dashboard> {
        const today = this.dateSource.getToday();
        const currentSeason = await this.seasonService.requireCurrent();
        const games = await promiseAllObject({
            next: this.gameService.getNextGames(today, 1),
            previous: this.gameService.getPreviousGames(today, 1),
            trend: this.gameService.getLastFinishedGames(5, { onlySeasons: [currentSeason.id] }),
        });

        const dashboard: Dashboard = {};

        if (widgets === undefined || widgets.includes('nextGame') && games.next.length === 1) {
            dashboard.nextGame = games.next[0];
        }

        if (widgets === undefined || widgets.includes('previousGame') && games.previous.length === 1) {
            dashboard.previousGame = games.previous[0];
        }

        if (widgets === undefined || widgets.includes('performanceTrend') && isDefined(games.trend)) {
            const trendScore = calculatePerformanceTrend(games.trend.map(game => game.resultTendency));
            dashboard.performanceTrend = {
                score: trendScore,
                games: games.trend.reverse(),
            }
        }

        if (widgets === undefined || widgets.includes('topScorers')) {
            dashboard.topScorers = await this.resolveTopScorers(currentSeason.id, competitionId);
        }

        return dashboard;
    }

    private async resolveTopScorers(currentSeasonId: SeasonId, competitionId?: CompetitionId): Promise<TopScorersInfo> {
        const topScorerQueryOptions: QueryOptions = { onlyForMain: true, onlySeasons: [currentSeasonId] };
        if (competitionId) {
            topScorerQueryOptions.onlyCompetitions = [competitionId];
        }

        const { topScorers, effectiveCompetitionsIds } = await promiseAllObject({
            topScorers: this.statsService.getTopScorers(topScorerQueryOptions, 5),
            effectiveCompetitionsIds: this.statsService.getEffectiveGoalScoredCompetitionIds(topScorerQueryOptions),
        })

        const { relevantCompetitions, topScorerPlayers } = await promiseAllObject({
            relevantCompetitions: this.competitionService.getMapByIds([...effectiveCompetitionsIds]),
            topScorerPlayers: this.personService.getMapByIds(topScorers.map(item => item.personId)),
        });

        return {
            competitions: Array.from(relevantCompetitions.values()),
            ranking: [...topScorers.map(item => ( { rank: item.rank, person: topScorerPlayers.get(item.personId)!, value: item.value } ))],
        }
    }
    
}