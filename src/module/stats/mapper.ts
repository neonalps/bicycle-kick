import { Sql } from "@src/db";
import { PlayerGoalsAgainstClubStatsDaoInterface, PlayerGoalTypeStatsDaoInterface, PlayerPerformanceStatsDaoInterface, TopScorerResultItemDaoInterface } from "@src/model/internal/interface/stats-player";
import { QueryOptions } from "@src/model/internal/query-options";
import { PlayerGoalsAgainstClubStatsItem, PlayerGoalTypeStatsItem, PlayerSeasonCompetitionStats, TopScorerResultItem } from "@src/model/internal/stats-player";
import { ArrayNonEmpty, convertNumberString, isDefined } from "@src/util/common";
import { CompetitionId, PersonId } from "@src/util/domain-types";

export class StatsMapper {

    constructor(private readonly sql: Sql) {}

    async getPlayerPerformanceStats(playerIds: ArrayNonEmpty<PersonId>, forMain: boolean = true): Promise<Map<PersonId, PlayerSeasonCompetitionStats[]>> {
        const result = await this.sql<PlayerPerformanceStatsDaoInterface[]>`
            select
                g.season_id,
                s."start",
                g.competition_id,
                c.sort_order,
                gp.person_id,
                count(gp.minutes_played) as games_played,
                sum(gp.goals_scored) as goals_scored,
                sum(gp.assists) as assists,
                sum(gp.own_goals) as own_goals,
                sum(coalesce(gp.goals_conceded, 0)) as goals_conceded,
                count(gp.goals_conceded = 0 or null) as clean_sheets,
                sum(gp.minutes_played) as minutes_played,
                sum(gp.is_starting::int) as games_started,
                sum(gp.yellow_card::int) as yellow_cards,
                sum(gp.yellow_red_card::int) as yellow_red_cards,
                sum(gp.red_card::int) as red_cards,
                sum(gp.regulation_penalties_taken) as regulation_penalties_taken,
                sum(gp.regulation_penalties_scored) as regulation_penalties_scored,
                sum(gp.regulation_penalties_faced) as regulation_penalties_faced,
                sum(gp.regulation_penalties_saved) as regulation_penalties_saved,
                sum(gp.pso_penalties_taken) as pso_penalties_taken,
                sum(gp.pso_penalties_scored) as pso_penalties_scored,
                sum(gp.pso_penalties_faced) as pso_penalties_faced,
                sum(gp.pso_penalties_saved) as pso_penalties_saved
            from game g
                left join game_players gp on gp.game_id = g.id
                left join season s on s.id = g.season_id
                left join competition c on c.id = g.competition_id
            where
                gp.person_id in ${ this.sql(playerIds) } and
                gp.for_main = ${ forMain }
            group by 
                g.season_id, g.competition_id, gp.person_id, s."start", c.sort_order
            having
                count(gp.minutes_played) > 0
            order by
                s."start" desc,
                c.sort_order asc
        `;

        if (result.length === 0) {
            return new Map();
        }

        return result.reduce((accumulator: Map<number, PlayerSeasonCompetitionStats[]>, current: PlayerPerformanceStatsDaoInterface) => {
            const existing = accumulator.get(current.personId);
            const convertedItem = this.convertPlayerPerformanceStatsToEntity(current);
            if (isDefined(existing)) {
                existing.push(convertedItem);
            } else {
                accumulator.set(current.personId, [convertedItem]);
            }
            return accumulator;
        }, new Map());
    }

    async getPlayerGoalTypeStats(playerIds: ArrayNonEmpty<PersonId>, queryOptions: QueryOptions = {}, forMain = true): Promise<Map<PersonId, PlayerGoalTypeStatsItem[]>> {
        // TODO implement query options
        const result = await this.sql<PlayerGoalTypeStatsDaoInterface[]>`
            select 
                gp.person_id as person_id,
                ge.goal_type as goal_type,
                sum(gp.goals_scored) as goals_scored
            from 
                game_players gp left join
                game_events ge on gp.scored_by = ge.id
            where
                gp.person_id in ${ this.sql(playerIds) } and
                gp.goals_scored > 0 and
                gp.for_main = ${ forMain }
            group by
                gp.person_id, ge.goal_type
            order by
                sum(gp.goals_scored) desc
        `;

        if (result.length === 0) {
            return new Map();
        }

        return result.reduce((accumulator: Map<PersonId, PlayerGoalTypeStatsItem[]>, current: PlayerGoalTypeStatsDaoInterface) => {
            const existing = accumulator.get(current.personId);
            const convertedItem: PlayerGoalTypeStatsItem = { goalType: current.goalType, goalsScored: Number(current.goalsScored) }
            if (isDefined(existing)) {
                existing.push(convertedItem);
            } else {
                accumulator.set(current.personId, [convertedItem]);
            }
            return accumulator;
        }, new Map());
    }

    async getPlayerGoalsAgainstClubStats(playerIds: ArrayNonEmpty<PersonId>, queryOptions: QueryOptions = {}, forMain = true): Promise<Map<PersonId, PlayerGoalsAgainstClubStatsItem[]>> {
        // TODO implement query options
        const result = await this.sql<PlayerGoalsAgainstClubStatsDaoInterface[]>`
            select 
                c.id as club_id,
                gp.person_id as person_id,
                sum(gp.goals_scored) as goals_scored
            from 
                game_players gp left join
                game g on gp.game_id = g.id left join 
                club c on c.id = g.opponent_id
            where
                gp.person_id in ${ this.sql(playerIds) } and
                gp.goals_scored > 0 and
                gp.for_main = ${ forMain }
            group by
                c.id, gp.person_id
            order by
                sum(gp.goals_scored) desc
        `;

        if (result.length === 0) {
            return new Map();
        }

        return result.reduce((accumulator: Map<PersonId, PlayerGoalsAgainstClubStatsItem[]>, current: PlayerGoalsAgainstClubStatsDaoInterface) => {
            const existing = accumulator.get(current.personId);
            const convertedItem: PlayerGoalsAgainstClubStatsItem = { clubId: current.clubId, goalsScored: Number(current.goalsScored) }
            if (isDefined(existing)) {
                existing.push(convertedItem);
            } else {
                accumulator.set(current.personId, [convertedItem]);
            }
            return accumulator;
        }, new Map());
    }

    async getTopScorers(queryOptions: QueryOptions, limit: number): Promise<ReadonlyArray<TopScorerResultItem>> {
        const result = await this.sql<TopScorerResultItemDaoInterface[]>`
            select
                rank() over (
                    order by sum(gp.goals_scored) desc
                ) ranking_position,
                p.id as person_id,
                sum(gp.goals_scored) as value
            from
                game g left join
                game_players gp on gp.game_id  = g.id left join
                person p on gp.person_id = p.id
            where
                gp.goals_scored > 0
                ${queryOptions.onlyForMain !== undefined ? this.sql` and gp.for_main = ${ queryOptions.onlyForMain }` : this.sql``}
                ${queryOptions.onlyCompetitions ? this.sql` and g.competition_id in ${ this.sql(queryOptions.onlyCompetitions) }` : this.sql``}
                ${queryOptions.onlySeasons ? this.sql` and g.season_id in ${ this.sql(queryOptions.onlySeasons) }` : this.sql``}
            group by
                p.id
            having 
                sum(gp.goals_scored) > 0
            order by
                sum(gp.goals_scored) desc
            limit ${limit}
        `;

        if (result.length === 0) {
            return [];
        }

        return result.map(item => ({ rank: Number(item.rankingPosition), personId: item.personId, value: Number(item.value) }));
    }

    async getEffectiveGoalScoredCompetitionIds(queryOptions: QueryOptions): Promise<ReadonlyArray<CompetitionId>> {
        const result = await this.sql<{ effectiveCompetitionId: CompetitionId; }[]>`
            select distinct
                case
                    when c.parent_id is not null and c.combine_statistics_with_parent = true then c.parent_id else c.id end as effective_competition_id 
            from
                game g left join
                competition c on g.competition_id  = c.id left join
                game_players gp on gp.game_id = g.id
            where
                gp.goals_scored > 0
                ${queryOptions.onlyForMain !== undefined ? this.sql` and gp.for_main = ${ queryOptions.onlyForMain }` : this.sql``}
                ${queryOptions.onlySeasons ? this.sql` and g.season_id in ${ this.sql(queryOptions.onlySeasons) }` : this.sql``}
        `;

        if (result.length === 0) {
            return [];
        }

        return result.map(item => item.effectiveCompetitionId);
    }

    private convertPlayerPerformanceStatsToEntity(item: PlayerPerformanceStatsDaoInterface): PlayerSeasonCompetitionStats {
        return {
            seasonId: item.seasonId,
            competitionId: item.competitionId,
            gamesPlayed: convertNumberString(item.gamesPlayed),
            gamesStarted: convertNumberString(item.gamesStarted),
            goalsScored: convertNumberString(item.goalsScored),
            assists: convertNumberString(item.assists),
            goalsConceded: convertNumberString(item.goalsConceded),
            cleanSheets: convertNumberString(item.cleanSheets),
            minutesPlayed: convertNumberString(item.minutesPlayed),
            ownGoals: convertNumberString(item.ownGoals),
            yellowCards: convertNumberString(item.yellowCards),
            yellowRedCards: convertNumberString(item.yellowRedCards),
            redCards: convertNumberString(item.redCards),
            regulationPenaltiesTaken: convertNumberString(item.regulationPenaltiesTaken),
            regulationPenaltiesScored: convertNumberString(item.regulationPenaltiesScored),
            regulationPenaltiesFaced: convertNumberString(item.regulationPenaltiesFaced),
            regulationPenaltiesSaved: convertNumberString(item.regulationPenaltiesSaved),
            psoPenaltiesTaken: convertNumberString(item.psoPenaltiesTaken),
            psoPenaltiesScored: convertNumberString(item.psoPenaltiesScored),
            psoPenaltiesFaced: convertNumberString(item.psoPenaltiesFaced),
            psoPenaltiesSaved: convertNumberString(item.psoPenaltiesSaved),
        }
    }

}