import { Sql } from "@src/db";
import { VenueDaoInterface } from "@src/model/internal/interface/venue.interface";
import { Venue } from "@src/model/internal/venue";

export class VenueMapper {

    constructor(private readonly sql: Sql) {}

    async getById(id: number): Promise<Venue | null> {
        const result = await this.sql<VenueDaoInterface[]>`select * from venue where id = ${ id }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    async getMultipleByIds(ids: number[]): Promise<Map<number, Venue>> {
        const result = await this.sql<VenueDaoInterface[]>`select * from venue where id in ${ this.sql(ids) }`;
        if (result.length === 0) {
            return new Map();
        }

        const resultMap = new Map<number, Venue>();
        for (const resultItem of result) {
            const entityItem = this.convertToEntity(resultItem);
            resultMap.set(entityItem.id, entityItem);
        }
        return resultMap;
    }

    private convertToEntity(item: VenueDaoInterface): Venue {
        return {
            ...item,
        }
    }

}