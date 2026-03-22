import { Sql } from "@src/db";
import { CreateVenue } from "@src/model/internal/create-venue";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { VenueFlavorDaoInterface } from "@src/model/internal/interface/venue-flavor.interface";
import { VenueDaoInterface } from "@src/model/internal/interface/venue.interface";
import { UpdateVenue } from "@src/model/internal/update-venue";
import { Venue } from "@src/model/internal/venue";
import { VenueFlavor } from "@src/model/internal/venue-flavor";
import { isDefined } from "@src/util/common";
import { VenueFlavorId, VenueId } from "@src/util/domain-types";
import { groupByOccurrenceAndGetLargest } from "@src/util/functional-queries";
import postgres from "postgres";

export class VenueMapper {

    constructor(private readonly sql: Sql) {}

    async create(create: CreateVenue, tx?: postgres.TransactionSql): Promise<VenueId> {
        const query = tx || this.sql;
        const result = await query`insert into venue ${ query(create, 'name', 'shortName', 'capacity', 'city', 'countryCode', 'district', 'latitude', 'longitude', 'normalizedSearch') } returning id`;
        if (result.length !== 1) {
            throw new Error(`Failed to create venue`);
        }
        return result[0].id;
    }

    async updateById(venuId: VenueId, updateVenue: UpdateVenue, tx?: postgres.TransactionSql): Promise<VenueId> {
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

    async getFlavorsForVenue(venueId: VenueId): Promise<VenueFlavor[]> {
        const result = await this.sql<VenueFlavorDaoInterface[]>`select id, venue_id, name from venue_flavor where venue_id = ${ venueId } order by id`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertFlavorToEntity(item));
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

    async getFlavorMapByIds(flavorIds: VenueFlavorId[]): Promise<Map<VenueFlavorId, VenueFlavor>> {
        const result = await this.sql<VenueFlavorDaoInterface[]>`select vf.*, v.city from venue_flavor vf left join venue v on vf.venue_id = v.id where vf.id in ${ this.sql(flavorIds) }`;
        if (result.length === 0) {
            return new Map();
        }

        const resultMap = new Map<number, VenueFlavor>();
        for (const resultItem of result) {
            const entityItem = this.convertFlavorToEntity(resultItem);
            resultMap.set(entityItem.id, entityItem);
        }
        return resultMap;
    }

    async searchForVenue(parts: string[]): Promise<Venue[]> {
        const results = await Promise.all(parts.map(part => this.findByNormalizedSearchValue(part)));
        const matchedIds = results.flat().map(item => item.id);    
        return await this.getMultipleByIds(groupByOccurrenceAndGetLargest(matchedIds));
    }

    async searchForVenueFlavor(parts: string[]): Promise<VenueFlavor[]> {
        const results = await Promise.all(parts.map(part => this.findFlavorByNormalizedSearchValue(part)));
        const matchedIds = results.flat().map(item => item.id);    
        return await this.getMultipleFlavorsByIdsResult(groupByOccurrenceAndGetLargest(matchedIds));
    }

    private async findByNormalizedSearchValue(search: string): Promise<IdInterface[]> {
        const wildCard = `%${search}%`;
        return await this.sql<IdInterface[]>`select id from venue where normalized_search like ${ wildCard } limit 50`;
    }

    private async findFlavorByNormalizedSearchValue(search: string): Promise<IdInterface[]> {
        const wildCard = `%${search}%`;
        return await this.sql<IdInterface[]>`select id from venue_flavor where normalized_search like ${ wildCard } limit 50`;
    }

    private async getMultipleByIdsResult(ids: number[]): Promise<VenueDaoInterface[]> {
        return await this.sql<VenueDaoInterface[]>`select * from venue where id in ${ this.sql(ids) }`;
    }

    private async getMultipleFlavorsByIdsResult(ids: number[]): Promise<VenueFlavorDaoInterface[]> {
        return await this.sql<VenueFlavorDaoInterface[]>`select vf.*, v.city from venue_flavor vf left join venue v on vf.venue_id = v.id where vf.id in ${ this.sql(ids) }`;
    }

    private convertToEntity(item: VenueDaoInterface): Venue {
        return {
            ...item,
            latitude: isDefined(item.latitude) ? Number(item.latitude) : item.latitude,
            longitude: isDefined(item.longitude) ? Number(item.longitude) : item.longitude,
        }
    }

    private convertFlavorToEntity(item: VenueFlavorDaoInterface): VenueFlavor {
        return {
            id: item.id,
            venueId: item.venueId,
            name: item.name,
            city: item.city,
        }
    }

}