import { Sql } from "@src/db";
import { VenueDaoInterface } from "@src/model/internal/interface/venue.interface";
import { Venue } from "@src/model/internal/venue";
import postgres from "postgres";

export class VenueMapper {

    constructor(private readonly sql: Sql) {}

    async create(create: Omit<Venue, 'id'>, tx?: postgres.TransactionSql): Promise<number> {
        const query = tx || this.sql;
        const result = await query`insert into venue ${ query(create, 'name', 'shortName', 'capacity', 'city', 'countryCode', 'district', 'latitude', 'longitude') } returning id`;
        if (result.length !== 1) {
            throw new Error(`Failed to create venue`);
        }
        return result[0].id;
    }

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