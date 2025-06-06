import { Sql } from "@src/db";
import { GameManager } from "@src/model/internal/game-manager";
import { GameManagerDaoInterface } from "@src/model/internal/interface/game-manager.interface";

export class GameManagerMapper {

    constructor(private readonly sql: Sql) {}

    async getManagersForGame(gameId: number): Promise<GameManager[]> {
        const result = await this.sql<GameManagerDaoInterface[]>`select * from game_managers where game_id = ${ gameId } order by sort_order`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    async getManagersForGamesMap(gameIds: number[]): Promise<Map<number, GameManager[]>> {
        const result = await this.sql<GameManagerDaoInterface[]>`select * from game_managers where game_id in ${ this.sql(gameIds) } order by game_id, sort_order`;
        if (result.length === 0) {
            return new Map();
        }

        const resultMap = new Map<number, GameManager[]>();
        for (const resultItem of result) {
            const gameManagerEntity = this.convertToEntity(resultItem);

            const gameId = resultItem.gameId;
            const gameEntry = resultMap.get(gameId);
            if (gameEntry === undefined) {
                resultMap.set(gameId, [gameManagerEntity]);
            } else {
                gameEntry.push(gameManagerEntity);
            }
        }

        return resultMap;
    }

    private convertToEntity(item: GameManagerDaoInterface): GameManager {
        return {
            id: item.id,
            gameId: item.gameId,
            personId: item.personId,
            forMain: item.forMain,
            role: item.role,
        };
    }

}