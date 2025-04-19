import { Sql } from "@src/db";
import { Game } from "@src/model/internal/game";
import { GameDaoInterface } from "@src/model/internal/interface/game.interface";
import { GameStatus } from "@src/model/type/game-status";
import { Tendency } from "@src/model/type/tendency";
import { SortOrder } from "@src/module/pagination/constants";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { getOrThrow, getSortOrderString } from "@src/util/common";

export class GameMapper {

    constructor(private readonly sql: Sql) {}

    async getById(id: number): Promise<Game | null> {
        const result = await this.sql<GameDaoInterface[]>`select * from game where id = ${ id }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    async getMultipleByIds(ids: number[]): Promise<Game[]> {
        const result = await this.sql<GameDaoInterface[]>`select * from game where id in ${ this.sql(ids) }`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    async getMapByIds(ids: number[]): Promise<Map<number, Game>> {
        const result = await this.getMultipleByIdsResult(ids);

        const resultMap = new Map<number, Game>();
        result.forEach(resultItem => {
            const entityItem = this.convertToEntity(resultItem);
            resultMap.set(entityItem.id, entityItem);
        });
        return resultMap;
    }

    async getOrderedSeasonGamesPaginated(seasonId: number, lastSeenDate: Date, limit: number, order: SortOrder): Promise<Game[]> {
        const result = await this.sql<IdInterface[]>`select id from game where season_id = ${ seasonId } and kickoff ${ order === SortOrder.Ascending ? this.sql`>` : this.sql`<` } ${ lastSeenDate } order by kickoff ${ this.sql(getSortOrderString(order)) } limit ${ limit }`;
        if (result.length === 0) {
            return [];
        }

        const orderedIds = result.map(item => item.id);
        const gamesMap = await this.getMapByIds(orderedIds);

        return orderedIds.map(gameId => getOrThrow(gamesMap, gameId, "game not found in map"));
    }

    private async getMultipleByIdsResult(ids: number[]): Promise<GameDaoInterface[]> {
        return await this.sql<GameDaoInterface[]>`select * from game where id in ${ this.sql(ids) }`;
    }

    private convertToEntity(item: GameDaoInterface): Game {
        return {
            ...item,
            resultTendency: item.resultTendency as Tendency,
            status: item.status as GameStatus,
        }
    }

}