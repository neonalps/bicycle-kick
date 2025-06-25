import { CompetitionService } from "@src/module/competition/service";
import { SeasonService } from "@src/module/season/service";
import { StatsMapper } from "./mapper";
import { ArrayNonEmpty, getOrThrow, isDefined, isNotDefined, promiseAllObject, uniqueArrayElements } from "@src/util/common";
import { validateNotNull } from "@src/util/validation";
import { PlayerBaseStats, PlayerStatsMapContext } from "@src/model/internal/stats-player";
import { CompetitionId, PersonId, SeasonId } from "@src/util/domain-types";
import { combinePlayerBaseStats, getEmptyPlayerBaseStats } from "./util";

export class StatsService {

    constructor(
        private readonly mapper: StatsMapper,
        private readonly competitionService: CompetitionService,
        private readonly seasonService: SeasonService,
    ) {}

    async getPlayerPerformanceStats(playerIds: ArrayNonEmpty<number>): Promise<PlayerStatsMapContext> {
        validateNotNull(playerIds, "playerIds");

        const uniqueIds = uniqueArrayElements(playerIds);
        if (uniqueIds.length === 0) {
            return {
                seasons: new Map(),
                competitions: new Map(),
                playerStats: new Map(),
            }
        }

        const statsInfo = await promiseAllObject({
            allCompetitions: this.competitionService.getAllInMap(),
            allSeasons: this.seasonService.getAllOrderedInMap(),
        });

        const result: Map<PersonId, Map<SeasonId, Map<CompetitionId, PlayerBaseStats>>> = new Map();
        const playerStats = await this.mapper.getPlayerPerformanceStats(uniqueIds as ArrayNonEmpty<number>);
        for (const personId of playerStats.keys()) {
            const playerEntries = playerStats.get(personId) ?? [];

            const playerSeasonCompetitionMap: Map<SeasonId, Map<CompetitionId, PlayerBaseStats>> = new Map();

            playerEntries.forEach(competitionStats => {
                const season = getOrThrow(statsInfo.allSeasons, competitionStats.seasonId, "failed to find season");
                const competition = getOrThrow(statsInfo.allCompetitions, competitionStats.competitionId, "failed to find competition");

                if (isNotDefined(playerSeasonCompetitionMap.get(season.id))) {
                    playerSeasonCompetitionMap.set(season.id, new Map());
                }
                const seasonEntry = getOrThrow(playerSeasonCompetitionMap, season.id, `could not find season in player season map`);

                const hasParent = isDefined(competition.parentId);
                const shouldCombineWithParent = hasParent && competition.combineStatisticsWithParent === true;

                // we must add the parent competition ID as well so it can be displayed later
                if (hasParent) {
                    const parentCompetitionId = competition.parentId as CompetitionId;
                    const parentCompetitionEntry = seasonEntry.get(parentCompetitionId);
                    if (parentCompetitionEntry === undefined) {
                        seasonEntry.set(parentCompetitionId, getEmptyPlayerBaseStats());
                    }
                }
                
                const effectiveCompetitionId = shouldCombineWithParent ? competition.parentId as CompetitionId : competition.id;
                const competitionEntry = seasonEntry.get(effectiveCompetitionId) ?? getEmptyPlayerBaseStats();
                
                seasonEntry.set(effectiveCompetitionId, combinePlayerBaseStats(competitionEntry, competitionStats));
            });

            result.set(personId, playerSeasonCompetitionMap);
        }

        return {
            seasons: statsInfo.allSeasons,
            competitions: statsInfo.allCompetitions,
            playerStats: result,
        }
    }

}