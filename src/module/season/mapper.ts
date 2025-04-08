import { Sql } from "@src/db";
import { SeasonDaoInterface } from "@src/model/internal/interface/season.interface";
import { Season } from "@src/model/internal/season";

export class SeasonMapper {

    constructor(private readonly sql: Sql) {}

    async getById(id: number): Promise<Season | null> {
        const result = await this.sql<SeasonDaoInterface[]>`select * from season where id = ${ id }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    async getMapByIds(ids: number[]): Promise<Map<number, Season>> {
        const result = await this.sql<SeasonDaoInterface[]>`select * from season where id in ${ this.sql(ids) }`;
        if (result.length === 0) {
            return new Map();
        }

        const resultMap = new Map<number, Season>();
        for (const resultItem of result) {
            const entityItem = this.convertToEntity(resultItem);
            resultMap.set(entityItem.id, entityItem);
        }
        return resultMap;
    }

    async getForDate(date: Date): Promise<Season | null> {
        const result = await this.sql<SeasonDaoInterface[]>`select * from season where start >= ${date} and end <= ${date}`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    private convertToEntity(item: SeasonDaoInterface): Season {
        return {
            ...item,
        };
    }

}