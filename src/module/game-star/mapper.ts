import { Sql } from "@src/db";
import { AccountId, GameId } from "@src/util/domain-types";

type GameStarCount = {
    gameId: GameId;
    gameIdCount: number;
}

export class GameStarMapper {

    constructor(private readonly sql: Sql) {}

    async setGameStarStatus(accountId: AccountId, gameId: GameId, starred: boolean): Promise<void> {
        if (starred === true) {
            await this.sql`insert into game_stars (account_id, game_id) values (${accountId}, ${gameId}) on conflict do nothing`;
        } else {
            await this.sql`delete from game_stars where account_id = ${accountId} and game_id = ${gameId}`;
        }
    }

    async getGameStars(accountId: AccountId, gameIds: GameId[]): Promise<number[]> {
        const result = await this.sql<{ gameId: number }[]>`select game_id from game_stars where account_id = ${accountId} and game_id in ${gameIds}`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => item.gameId);
    }

    async getGameStarsForAccount(accountId: AccountId): Promise<GameId[]> {
        const result = await this.sql<{ gameId: number }[]>`select game_id from game_stars where account_id = ${accountId} order by game_id`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => item.gameId);
    }

    async getGameStarCount(gameIds: GameId[]): Promise<Map<GameId, number>> {
        const result = await this.sql<GameStarCount[]>`select game_id, count(game_id) as game_id_count from game_stars where game_id in ${gameIds} group by game_id`
        if (result.length === 0) {
            return new Map();
        }

        return result.reduce((accumulator: Map<number, number>, current: GameStarCount) => {
            accumulator.set(current.gameId, current.gameIdCount);
            return accumulator;
        }, new Map());
    }

}