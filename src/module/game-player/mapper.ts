import { Sql } from "@src/db";
import { GamePlayer } from "@src/model/internal/game-player";
import { GamePlayerDaoInterface } from "@src/model/internal/interface/game-player.interface";

export class GamePlayerMapper {

    constructor(private readonly sql: Sql) {}

    async getPlayersForGame(gameId: number): Promise<GamePlayer[]> {
        const result = await this.sql<GamePlayerDaoInterface[]>`select * from game_players where game_id = ${ gameId }`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    async getPlayersForGamesMap(gameIds: number[]): Promise<Map<number, GamePlayer[]>> {
        const result = await this.sql<GamePlayerDaoInterface[]>`select * from game_players where game_id in ${ this.sql(gameIds) }`;
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

    private convertToEntity(item: GamePlayerDaoInterface): GamePlayer {
        return {
            ...item,
        };
    }

}