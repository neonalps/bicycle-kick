import { Sql } from "@src/db";

type GameAttendedCount = {
    gameId: number;
    gameIdCount: number;
}

export class GameAttendedMapper {

    constructor(private readonly sql: Sql) {}

    async setGameAttendedStatus(accountId: number, gameId: number, attended: boolean): Promise<void> {
        if (attended === true) {
            await this.sql`insert into game_attended (account_id, game_id) values (${accountId}, ${gameId}) on conflict do nothing`;
        } else {
            await this.sql`delete from game_attended where account_id = ${accountId} and game_id = ${gameId}`;
        }
    }

    async getGameAttended(accountId: number, gameIds: number[]): Promise<number[]> {
        const result = await this.sql<{ gameId: number }[]>`select game_id from game_attended where account_id = ${accountId} and game_id in ${gameIds}`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => item.gameId);
    }

    async getGameAttendedCount(gameIds: number[]): Promise<Map<number, number>> {
        const result = await this.sql<GameAttendedCount[]>`select game_id, count(game_id) as game_id_count from game_attended where game_id in ${gameIds} group by game_id`
        if (result.length === 0) {
            return new Map();
        }

        return result.reduce((accumulator: Map<number, number>, current: GameAttendedCount) => {
            accumulator.set(current.gameId, current.gameIdCount);
            return accumulator;
        }, new Map());
    }

}