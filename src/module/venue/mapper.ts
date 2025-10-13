import { Sql } from "@src/db";
import { CreateVenue } from "@src/model/internal/create-venue";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { VenueDaoInterface } from "@src/model/internal/interface/venue.interface";
import { UpdateVenue } from "@src/model/internal/update-venue";
import { Venue } from "@src/model/internal/venue";
import { isDefined } from "@src/util/common";
import { VenueId } from "@src/util/domain-types";
import { groupByOccurrenceAndGetLargest } from "@src/util/functional-queries";
import postgres from "postgres";

export class VenueMapper {

    constructor(private readonly sql: Sql) {}

    async create(create: CreateVenue, tx?: postgres.TransactionSql): Promise<number> {
        const query = tx || this.sql;
        const result = await query`insert into venue ${ query(create, 'name', 'shortName', 'capacity', 'city', 'countryCode', 'district', 'latitude', 'longitude', 'normalizedSearch') } returning id`;
        if (result.length !== 1) {
            throw new Error(`Failed to create venue`);
        }
        return result[0].id;
    }

    async updateById(venuId: VenueId, updateVenue: UpdateVenue, tx?: postgres.TransactionSql): Promise<number> {
        const query = tx || this.sql;
        const result = await query`update venue set ${ query(updateVenue, 'name', 'shortName', 'capacity', 'city', 'countryCode', 'district', 'latitude', 'longitude', 'normalizedSearch') } where id = ${ venuId } returning id`;
        if (result.length !== 1) {
            throw new Error(`Failed to update venue`);
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

    async getMultipleByIds(ids: number[]): Promise<Venue[]> {
        return (await this.getMultipleByIdsResult(ids)).map(item => this.convertToEntity(item));
    }

    async getMapByIds(ids: number[]): Promise<Map<number, Venue>> {
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

    async search(parts: string[]): Promise<Venue[]> {
        const results = await Promise.all(parts.map(part => this.findByNormalizedSearchValue(part)));
        const matchedIds = results.flat().map(item => item.id);    
        return await this.getMultipleByIds(groupByOccurrenceAndGetLargest(matchedIds));
    }

    private async findByNormalizedSearchValue(search: string): Promise<IdInterface[]> {
        const wildCard = `%${search}%`;
        return await this.sql<IdInterface[]>`select id from venue where normalized_search like ${ wildCard } limit 50`;
    }

    private async getMultipleByIdsResult(ids: number[]): Promise<VenueDaoInterface[]> {
        return await this.sql<VenueDaoInterface[]>`select * from venue where id in ${ this.sql(ids) }`;
    }

    private convertToEntity(item: VenueDaoInterface): Venue {
        return {
            ...item,
            latitude: isDefined(item.latitude) ? Number(item.latitude) : item.latitude,
            longitude: isDefined(item.longitude) ? Number(item.longitude) : item.longitude,
        }
    }

}