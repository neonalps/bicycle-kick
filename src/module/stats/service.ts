import { CompetitionService } from "@src/module/competition/service";
import { SeasonService } from "@src/module/season/service";
import { StatsMapper } from "./mapper";
import { ArrayNonEmpty, getOrThrow, isDefined, isNotDefined, promiseAllObject, uniqueArrayElements } from "@src/util/common";
import { validateNotNull } from "@src/util/validation";
import { PlayerBaseStats, PlayerGoalsAgainstClubStatsItem } from "@src/model/internal/stats-player";
import { ClubId, CompetitionId, PersonId, SeasonId } from "@src/util/domain-types";
import { combinePlayerBaseStats, getEmptyPlayerBaseStats } from "./util";
import { Competition } from "@src/model/internal/competition";
import { Season } from "@src/model/internal/season";
import { QueryOptions } from "@src/model/internal/query-options";
import { Club } from "@src/model/internal/club";
import { ClubService } from "@src/module/club/service";

export enum PlayerStatsItem {
    All = 'all',
    GoalsAgainstClub = 'goalsAgainstClub',
    Performance = 'performance',
}

interface StatsContext {
    allCompetitions: Map<CompetitionId, Competition>;
    allSeasons: Map<SeasonId, Season>;
}

interface PlayerPerformanceStatsItemResult {
    competitionIds?: Set<CompetitionId>;
    seasonIds?: Set<SeasonId>;
    playerStats: Map<PersonId, Map<SeasonId, Map<CompetitionId, PlayerBaseStats>>>;
}

interface PlayerGoalsAgainstClubStatsItemResult {
    clubIds?: Set<ClubId>;
    goalsAgainstClub: Map<PersonId, ReadonlyArray<PlayerGoalsAgainstClubStatsItem>>;
}

export interface PlayerStatsResult {
    competitions?: Map<CompetitionId, Competition>;
    clubs?: Map<ClubId, Club>;
    seasons?: Map<SeasonId, Season>;
    playerStats?: Map<PersonId, Map<SeasonId, Map<CompetitionId, PlayerBaseStats>>>;
    goalsAgainstClub?: Map<PersonId, ReadonlyArray<PlayerGoalsAgainstClubStatsItem>>;
}

export class StatsService {

    constructor(
        private readonly mapper: StatsMapper,
        private readonly clubService: ClubService,
        private readonly competitionService: CompetitionService,
        private readonly seasonService: SeasonService,
    ) {}

    async getPlayerStats(playerIds: ArrayNonEmpty<number>, queryOptions: QueryOptions = {}, statsItems: ReadonlyArray<PlayerStatsItem> = [PlayerStatsItem.All]): Promise<PlayerStatsResult> {
        validateNotNull(playerIds, "playerIds");
        validateNotNull(queryOptions, "queryOptions");
        validateNotNull(statsItems, "statsItems");

        const statsContext: StatsContext = await promiseAllObject({
            allCompetitions: this.competitionService.getAllInMap(),
            allSeasons: this.seasonService.getAllOrderedInMap(),
        });

        const requestedStatsItems = this.resolveRequestedStatsItems(statsItems);

        const seenCompetitionIds = new Set<CompetitionId>();
        const seenClubIds = new Set<ClubId>();
        const seenSeasonIds = new Set<SeasonId>();
        
        const result: PlayerStatsResult = {};

        if (requestedStatsItems.includes(PlayerStatsItem.Performance)) {
            const playerPerformance = await this.getPlayerPerformanceStats(playerIds, statsContext);

            playerPerformance.competitionIds?.forEach(item => seenCompetitionIds.add(item));
            playerPerformance.seasonIds?.forEach(item => seenSeasonIds.add(item));

            result.playerStats = playerPerformance.playerStats;
        }

        if (requestedStatsItems.includes(PlayerStatsItem.GoalsAgainstClub)) {
            const goalsAgainstClub = await this.getPlayerGoalsAgainstClubStats(playerIds);

            goalsAgainstClub.clubIds?.forEach(item => seenClubIds.add(item));

            result.goalsAgainstClub = goalsAgainstClub.goalsAgainstClub;
        }

        const seenCompetitions = new Map<CompetitionId, Competition>();
        seenCompetitionIds.forEach(item => seenCompetitions.set(item, getOrThrow(statsContext.allCompetitions, item, `failed to find competition ${item} in stats context map`)));

        const seenSeasons = new Map<SeasonId, Season>();
        seenSeasonIds.forEach(item => seenSeasons.set(item, getOrThrow(statsContext.allSeasons, item, `failed to find season ${item} in stats context map`)));

        const seenClubs = await this.clubService.getMapByIds(Array.from(seenClubIds));

        return {
            ...result,
            competitions: seenCompetitions,
            seasons: seenSeasons,
            clubs: seenClubs,
        }
    }

    private resolveRequestedStatsItems(requestedItems: ReadonlyArray<PlayerStatsItem>): ReadonlyArray<PlayerStatsItem> {
        if (requestedItems.length === 0) {
            return [];
        }

        if (requestedItems.includes(PlayerStatsItem.All)) {
            return [
                PlayerStatsItem.GoalsAgainstClub,
                PlayerStatsItem.Performance,
            ];
        }

        return requestedItems;
    }

    private async getPlayerPerformanceStats(playerIds: ArrayNonEmpty<number>, context: StatsContext): Promise<PlayerPerformanceStatsItemResult> {
        validateNotNull(playerIds, "playerIds");

        const uniqueIds = uniqueArrayElements(playerIds);
        if (uniqueIds.length === 0) {
            return {
                playerStats: new Map(),
            }
        }

        const statsInfo = await promiseAllObject({
            allCompetitions: this.competitionService.getAllInMap(),
            allSeasons: this.seasonService.getAllOrderedInMap(),
        });

        const seenSeasonIds = new Set<SeasonId>();
        const seenCompetitionIds = new Set<CompetitionId>();

        const result: Map<PersonId, Map<SeasonId, Map<CompetitionId, PlayerBaseStats>>> = new Map();
        const playerStats = await this.mapper.getPlayerPerformanceStats(uniqueIds as ArrayNonEmpty<number>);
        for (const personId of playerStats.keys()) {
            const playerEntries = playerStats.get(personId) ?? [];

            const playerSeasonCompetitionMap: Map<SeasonId, Map<CompetitionId, PlayerBaseStats>> = new Map();

            playerEntries.forEach(competitionStats => {
                const season = getOrThrow(statsInfo.allSeasons, competitionStats.seasonId, "failed to find season");
                const competition = getOrThrow(statsInfo.allCompetitions, competitionStats.competitionId, "failed to find competition");

                seenSeasonIds.add(season.id);
                seenCompetitionIds.add(competition.id);

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
                        seenCompetitionIds.add(parentCompetitionId);
                    }
                }
                
                const effectiveCompetitionId = shouldCombineWithParent ? competition.parentId as CompetitionId : competition.id;
                const competitionEntry = seasonEntry.get(effectiveCompetitionId) ?? getEmptyPlayerBaseStats();
                
                seasonEntry.set(effectiveCompetitionId, combinePlayerBaseStats(competitionEntry, competitionStats));
            });

            result.set(personId, playerSeasonCompetitionMap);
        }

        return {
            seasonIds: seenSeasonIds,
            competitionIds: seenCompetitionIds, 
            playerStats: result,
        }
    }

    private async getPlayerGoalsAgainstClubStats(playerIds: ArrayNonEmpty<PersonId>, queryOptions: QueryOptions = {}): Promise<PlayerGoalsAgainstClubStatsItemResult> {
        const resultMap = await this.mapper.getPlayerGoalsAgainstClubStats(playerIds, queryOptions);

        const seenClubIds = new Set<ClubId>();

        for (const personId of resultMap.keys()) {
            const playerEntries = resultMap.get(personId) ?? [];

            playerEntries.forEach(entry => {
                seenClubIds.add(entry.clubId);
            });
        }

        return {
            clubIds: seenClubIds,
            goalsAgainstClub: resultMap,
        }
    }

}