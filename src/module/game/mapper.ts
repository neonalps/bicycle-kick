import { Sql } from "@src/db";
import { Game } from "@src/model/internal/game";
import { GameDaoInterface } from "@src/model/internal/interface/game.interface";
import { Tendency } from "@src/model/type/tendency";

export class GameMapper {

    constructor(private readonly sql: Sql) {}

    async getMultipleByIds(ids: number[]): Promise<Game[]> {
        const result = await this.sql<GameDaoInterface[]>`select * from game where id in ${ this.sql(ids) }`;
        if (!result || result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    private convertToEntity(item: GameDaoInterface): Game {
        return {
            ...item,
            resultTendency: item.resultTendency as Tendency,
        }
    }

}