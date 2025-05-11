import { Sql } from "@src/db";
import { GameReferee } from "@src/model/internal/game-referee";
import { GameRefereeDaoInterface } from "@src/model/internal/interface/game-referee.interface";

export class GameRefereeMapper {

    constructor(private readonly sql: Sql) {}

    async getRefereesForGame(gameId: number): Promise<GameReferee[]> {
        const result = await this.sql<GameRefereeDaoInterface[]>`select * from game_referees where game_id = ${ gameId } order by sort_order`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    async getRefereesForGamesMap(gameIds: number[]): Promise<Map<number, GameReferee[]>> {
        const result = await this.sql<GameRefereeDaoInterface[]>`select * from game_referees where game_id in ${ this.sql(gameIds) } order by game_id, sort_order`;
        if (result.length === 0) {
            return new Map();
        }

        const resultMap = new Map<number, GameReferee[]>();
        for (const resultItem of result) {
            const gameRefereeEntity = this.convertToEntity(resultItem);

            const gameId = resultItem.gameId;
            const gameEntry = resultMap.get(gameId);
            if (gameEntry === undefined) {
                resultMap.set(gameId, [gameRefereeEntity]);
            } else {
                gameEntry.push(gameRefereeEntity);
            }
        }

        return resultMap;
    }

    private convertToEntity(item: GameRefereeDaoInterface): GameReferee {
        return {
            id: item.id,
            gameId: item.gameId,
            personId: item.personId,
            role: item.role,
        };
    }

}