import { Sql } from "@src/db";
import { GamePlayer } from "@src/model/internal/game-player";
import { GamePlayerDaoInterface } from "@src/model/internal/interface/game-player.interface";
import { SortOrder } from "@src/module/pagination/constants";
import { GetPlayerGamesPlayedPaginationParams } from "./service";
import { isDefined, isNotDefined } from "@src/util/common";
import { CompetitionId, PersonId } from "@src/util/domain-types";
import { ValueWithModifier } from "@src/model/internal/stats-query-modifier";
import { parseValueWithModifier } from "@src/util/stats";
import { CompetitionService } from "@src/module/competition/service";

export class GamePlayerMapper {

    constructor(private readonly sql: Sql, private readonly competitionService: CompetitionService) {}

    async getPlayersForGame(gameId: number): Promise<GamePlayer[]> {
        const result = await this.sql<GamePlayerDaoInterface[]>`select * from game_players where game_id = ${ gameId }`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    async getPlayersForGamesMap(gameIds: number[]): Promise<Map<number, GamePlayer[]>> {
        const result = await this.sql<GamePlayerDaoInterface[]>`select * from game_players where game_id in ${ this.sql(gameIds) } order by game_id, sort_order`;
        if (result.length === 0) {
            return new Map();
        }

        const resultMap = new Map<number, GamePlayer[]>();
        for (const resultItem of result) {
            const gamePlayerEntity = this.convertToEntity(resultItem);

            const gameId = resultItem.gameId;
            const gameEntry = resultMap.get(gameId);
            if (gameEntry === undefined) {
                resultMap.set(gameId, [gamePlayerEntity]);
            } else {
                gameEntry.push(gamePlayerEntity);
            }
        }

        return resultMap;
    }

    async getGamesPlayedPaginated(personId: PersonId, params: GetPlayerGamesPlayedPaginationParams): Promise<GamePlayer[]> {
        const competitionIds = params.competitionId ? params.competitionId.split(",") : undefined;
        const opponentIds = params.opponentId ? params.opponentId.split(",") : undefined;
        const seasonIds = params.seasonId ? params.seasonId.split(",") : undefined;
        const assistsWithModifier: ValueWithModifier | undefined = params.assists ? parseValueWithModifier(params.assists) : undefined;
        const goalsScoredWithModifier: ValueWithModifier | undefined = params.goalsScored ? parseValueWithModifier(params.goalsScored) : undefined;
        const minutesPlayedWithModifier: ValueWithModifier | undefined = params.minutesPlayed ? parseValueWithModifier(params.minutesPlayed) : undefined;

        const effectiveCompetitionIds = await this.getEffectiveCompetitionIds(competitionIds);

        const result = await this.sql<GamePlayerDaoInterface[]>`
            select
                gp.*
            from
                game g left join
                game_players gp on gp.game_id = g.id
            where
                gp.person_id = ${ personId }
                and g.kickoff ${params.order === SortOrder.Ascending ? this.sql`>` : this.sql`<`} ${ params.lastSeen }
                ${effectiveCompetitionIds.length > 0 ? this.sql` and g.competition_id in ${ this.sql(effectiveCompetitionIds) }` : this.sql``}
                ${opponentIds ? this.sql` and g.opponent_id in ${ this.sql(opponentIds) }` : this.sql``}
                ${seasonIds ? this.sql` and g.season_id in ${ this.sql(seasonIds) }` : this.sql``}
                ${minutesPlayedWithModifier ? this.sql` and gp.minutes_played >= ${minutesPlayedWithModifier.value}` : this.sql``}
                ${assistsWithModifier ? this.sql` and gp.assists >= ${assistsWithModifier.value}` : this.sql``}
                ${goalsScoredWithModifier ? this.sql` and gp.goals_scored >= ${goalsScoredWithModifier.value}` : this.sql``}
                ${isDefined(params.yellowCard) ? this.sql` and gp.yellow_card = ${params.yellowCard}` : this.sql``}
                ${isDefined(params.yellowRedCard) ? this.sql` and gp.yellow_red_card = ${params.yellowRedCard}` : this.sql``}
                ${isDefined(params.redCard) ? this.sql` and gp.red_card = ${params.redCard}` : this.sql``}
            order by
                g.kickoff ${ this.determineSortOrder(params.order) }
            limit
                ${ params.limit }
        `;

        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    private convertToEntity(item: GamePlayerDaoInterface): GamePlayer {
        return {
            id: item.id,
            gameId: item.gameId,
            personId: item.personId,
            sortOrder: item.sortOrder,
            forMain: item.forMain,
            minutesPlayed: item.minutesPlayed,
            shirt: item.shirt,
            isStarting: item.isStarting,
            isCaptain: item.isCaptain,
            goalsScored: item.goalsScored,
            assists: item.assists,
            goalsConceded: item.goalsConceded,
            ownGoals: item.ownGoals,
            yellowCard: item.yellowCard,
            yellowRedCard: item.yellowRedCard,
            redCard: item.redCard,
            positionGrid: item.positionGrid,
            positionKey: item.positionKey,
            regulationPenaltiesTaken: item.regulationPenaltiesTaken,
            regulationPenaltiesScored: item.regulationPenaltiesScored,
            regulationPenaltiesFaced: item.regulationPenaltiesFaced,
            regulationPenaltiesSaved: item.regulationPenaltiesSaved,
            psoPenaltiesTaken: item.psoPenaltiesTaken,
            psoPenaltiesScored: item.psoPenaltiesScored,
            psoPenaltiesFaced: item.psoPenaltiesFaced,
            psoPenaltiesSaved: item.psoPenaltiesSaved,
        };
    }

    private determineSortOrder(order: SortOrder) {
        return order === SortOrder.Descending ? this.sql`desc` : this.sql`asc`;
    }

    private async getEffectiveCompetitionIds(competitionIds?: string[]): Promise<ReadonlyArray<CompetitionId>> {
        if (isNotDefined(competitionIds)) {
            return [];
        }

        const result = new Set<CompetitionId>();
        for (const competitionId of competitionIds as string[]) {
            // add the competition id itself
            const realCompetitionId = Number(competitionId);
            result.add(realCompetitionId);

            const childCompetitions = await this.competitionService.getChildCompetitions(realCompetitionId);
            childCompetitions.map(item => item.id).forEach(competitionId => result.add(competitionId));
        }

        return Array.from(result);
    }

}