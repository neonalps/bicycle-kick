import { Sql } from "@src/db";
import { SeasonDaoInterface } from "@src/model/internal/interface/season.interface";
import { Season } from "@src/model/internal/season";
import { SortOrder } from "../pagination/constants";

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

    async getAllPaginated(lastSeenDate: Date, limit: number, order: SortOrder): Promise<Season[]> {
        const result = await this.sql<SeasonDaoInterface[]>`select * from season where start ${order === SortOrder.Ascending ? this.sql`>` : this.sql`<`} ${lastSeenDate} order by start ${this.determineSortOrder(order)} limit ${limit}`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    private determineSortOrder(order: SortOrder) {
        return order === SortOrder.Descending ? this.sql`desc` : this.sql`asc`;
    }

    private convertToEntity(item: SeasonDaoInterface): Season {
        return {
            ...item,
        };
    }

}