import { Sql } from "@src/db";
import { AccountId, GameId } from "@src/util/domain-types";

type GameAttendedCount = {
    gameId: GameId;
    gameIdCount: number;
}

export class GameAttendedMapper {

    constructor(private readonly sql: Sql) {}

    async setGameAttendedStatus(accountId: AccountId, gameId: GameId, attended: boolean): Promise<void> {
        if (attended === true) {
            await this.sql`insert into game_attended (account_id, game_id) values (${accountId}, ${gameId}) on conflict do nothing`;
        } else {
            await this.sql`delete from game_attended where account_id = ${accountId} and game_id = ${gameId}`;
        }
    }

    async getGameAttended(accountId: AccountId, gameIds: GameId[]): Promise<GameId[]> {
        const result = await this.sql<{ gameId: GameId }[]>`select game_id from game_attended where account_id = ${accountId} and game_id in ${gameIds}`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => item.gameId);
    }

    async getGameAttendedForAccount(accountId: AccountId): Promise<GameId[]> {
        const result = await this.sql<{ gameId: GameId }[]>`select game_id from game_attended where account_id = ${accountId} order by game_id`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => item.gameId);
    }

    async getGameAttendedCount(gameIds: GameId[]): Promise<Map<GameId, number>> {
        const result = await this.sql<GameAttendedCount[]>`select game_id, count(game_id) as game_id_count from game_attended where game_id in ${gameIds} group by game_id`
        if (result.length === 0) {
            return new Map();
        }

        return result.reduce((accumulator: Map<GameId, number>, current: GameAttendedCount) => {
            accumulator.set(current.gameId, current.gameIdCount);
            return accumulator;
        }, new Map());
    }

}