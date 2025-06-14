import { Sql } from "@src/db";
import { PlayerStatsDaoInterface } from "@src/model/internal/interface/stats-player";
import { PlayerSeasonCompetitionStats } from "@src/model/internal/stats-player";
import { ArrayNonEmpty, convertNumberString, isDefined } from "@src/util/common";

export class StatsMapper {

    constructor(private readonly sql: Sql) {}

    async getPlayerStats(playerIds: ArrayNonEmpty<number>): Promise<Map<number, PlayerSeasonCompetitionStats[]>> {
        const result = await this.sql<PlayerStatsDaoInterface[]>`
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
                gp.person_id in ${ this.sql(playerIds) }
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

        return result.reduce((accumulator: Map<number, PlayerSeasonCompetitionStats[]>, current: PlayerStatsDaoInterface) => {
            const existing = accumulator.get(current.personId);
            const convertedItem = this.convertToEntity(current);
            if (isDefined(existing)) {
                existing.push(convertedItem);
            } else {
                accumulator.set(current.personId, [convertedItem]);
            }
            return accumulator;
        }, new Map());
    }

    private convertToEntity(item: PlayerStatsDaoInterface): PlayerSeasonCompetitionStats {
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