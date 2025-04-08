import { Sql } from "@src/db";
import { Game } from "@src/model/internal/game";
import { GameDaoInterface } from "@src/model/internal/interface/game.interface";
import { GameStatus } from "@src/model/type/game-status";
import { Tendency } from "@src/model/type/tendency";

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

    private convertToEntity(item: GameDaoInterface): Game {
        return {
            ...item,
            resultTendency: item.resultTendency as Tendency,
            status: item.status as GameStatus,
        }
    }

}