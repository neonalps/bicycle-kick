import { Sql } from "@src/db";

type GameStarCount = {
    gameId: number;
    gameIdCount: number;
}

export class GameStarMapper {

    constructor(private readonly sql: Sql) {}

    async setGameStarStatus(accountId: number, gameId: number, starred: boolean): Promise<void> {
        if (starred === true) {
            await this.sql`insert into game_stars (account_id, game_id) values (${accountId}, ${gameId}) on conflict do nothing`;
        } else {
            await this.sql`delete from game_stars where account_id = ${accountId} and game_id = ${gameId}`;
        }
    }

    async getGameStars(accountId: number, gameIds: number[]): Promise<number[]> {
        const result = await this.sql<{ gameId: number }[]>`select game_id from game_stars where account_id = ${accountId} and game_id in ${gameIds}`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => item.gameId);
    }

    async getGameStarCount(gameIds: number[]): Promise<Map<number, number>> {
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