import { Sql } from "@src/db";
import { GamePlayer } from "@src/model/internal/game-player";
import { GamePlayerDaoInterface } from "@src/model/internal/interface/game-player.interface";
import { SortOrder } from "@src/module/pagination/constants";
import { GetPlayerGamesPlayedPaginationParams } from "./service";
import { assertUnreachable, isDefined, isNotDefined } from "@src/util/common";
import { CompetitionId, PersonId } from "@src/util/domain-types";
import { QueryComparator, ValueWithModifier } from "@src/model/internal/stats-query-modifier";
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
        const forMain = isDefined(params.forMain) ? params.forMain : true;
        const competitionIds = params.competitionId ? params.competitionId.split(",") : undefined;
        const opponentIds = params.opponentId ? params.opponentId.split(",") : undefined;
        const seasonIds = params.seasonId ? params.seasonId.split(",") : undefined;
        const assistsWithModifier: ValueWithModifier | undefined = params.assists ? parseValueWithModifier(params.assists) : undefined;
        const goalsScoredWithModifier: ValueWithModifier | undefined = params.goalsScored ? parseValueWithModifier(params.goalsScored) : undefined;
        const minutesPlayedWithModifier: ValueWithModifier | undefined = params.minutesPlayed ? parseValueWithModifier(params.minutesPlayed) : undefined;
        const goalsConcededWithModifier: ValueWithModifier | undefined = params.goalsConceded ? parseValueWithModifier(params.goalsConceded) : undefined;
        const regulationPenaltiesFacedWithModifier: ValueWithModifier | undefined = params.regulationPenaltiesFaced ? parseValueWithModifier(params.regulationPenaltiesFaced) : undefined;
        const regulationPenaltiesSavedWithModifier: ValueWithModifier | undefined = params.regulationPenaltiesSaved ? parseValueWithModifier(params.regulationPenaltiesSaved) : undefined;
        const regulationPenaltiesTakenWithModifier: ValueWithModifier | undefined = params.regulationPenaltiesTaken ? parseValueWithModifier(params.regulationPenaltiesTaken) : undefined;
        const regulationPenaltiesScoredWithModifier: ValueWithModifier | undefined = params.regulationPenaltiesScored ? parseValueWithModifier(params.regulationPenaltiesScored) : undefined;
        const psoPenaltiesFacedWithModifier: ValueWithModifier | undefined = params.psoPenaltiesFaced ? parseValueWithModifier(params.psoPenaltiesFaced) : undefined;
        const psoPenaltiesSavedWithModifier: ValueWithModifier | undefined = params.psoPenaltiesSaved ? parseValueWithModifier(params.psoPenaltiesSaved) : undefined;
        const psoPenaltiesTakenWithModifier: ValueWithModifier | undefined = params.psoPenaltiesTaken ? parseValueWithModifier(params.psoPenaltiesTaken) : undefined;
        const psoPenaltiesScoredWithModifier: ValueWithModifier | undefined = params.psoPenaltiesScored ? parseValueWithModifier(params.psoPenaltiesScored) : undefined;

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
                and gp.for_main = ${forMain}
                ${effectiveCompetitionIds.length > 0 ? this.sql` and g.competition_id in ${ this.sql(effectiveCompetitionIds) }` : this.sql``}
                ${opponentIds ? this.sql` and g.opponent_id in ${ this.sql(opponentIds) }` : this.sql``}
                ${seasonIds ? this.sql` and g.season_id in ${ this.sql(seasonIds) }` : this.sql``}
                ${ this.resolveValueWithModifier(minutesPlayedWithModifier, 'gp.minutes_played') }
                ${ this.resolveValueWithModifier(assistsWithModifier, 'gp.assists') }
                ${ this.resolveValueWithModifier(goalsScoredWithModifier, 'gp.goals_scored') }
                ${ this.resolveValueWithModifier(goalsConcededWithModifier, 'gp.goals_conceded') }
                ${ this.resolveValueWithModifier(regulationPenaltiesFacedWithModifier, 'gp.regulation_penalties_faced') }
                ${ this.resolveValueWithModifier(regulationPenaltiesSavedWithModifier, 'gp.regulation_penalties_saved') }
                ${ this.resolveValueWithModifier(regulationPenaltiesTakenWithModifier, 'gp.regulation_penalties_taken') }
                ${ this.resolveValueWithModifier(regulationPenaltiesScoredWithModifier, 'gp.regulation_penalties_scored') }
                ${ this.resolveValueWithModifier(psoPenaltiesFacedWithModifier, 'gp.pso_penalties_faced') }
                ${ this.resolveValueWithModifier(psoPenaltiesSavedWithModifier, 'gp.pso_penalties_saved') }
                ${ this.resolveValueWithModifier(psoPenaltiesTakenWithModifier, 'gp.pso_penalties_taken') }
                ${ this.resolveValueWithModifier(psoPenaltiesScoredWithModifier, 'gp.pso_penalties_scored') }
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

    private resolveValueWithModifier(valueWithModifier: ValueWithModifier | undefined, columnAccessor: string) {
        if (isNotDefined(valueWithModifier)) {
            return this.sql``;
        }

        return this.sql` and ${ this.sql(columnAccessor) } ${ this.convertValueModifier(valueWithModifier.modifier) } ${valueWithModifier.value}`;
    }

    private convertValueModifier(comparator: QueryComparator) {
        switch (comparator) {
            case '<':
                return this.sql`<`;
            case '<=':
                return this.sql`<=`;
            case '=':
                return this.sql`=`;
            case '>':
                return this.sql`>`;
            case '>=':
                return this.sql`>=`;
            default:
                assertUnreachable(comparator);
        }
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