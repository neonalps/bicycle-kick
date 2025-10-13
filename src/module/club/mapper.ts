import { Sql } from "@src/db";
import { Club } from "@src/model/internal/club";
import { CreateClub } from "@src/model/internal/create-club";
import { ClubDaoInterface } from "@src/model/internal/interface/club.interface";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { UpdateClub } from "@src/model/internal/update-club";
import { ClubId } from "@src/util/domain-types";
import { groupByOccurrenceAndGetLargest } from "@src/util/functional-queries";
import postgres from "postgres";

export class ClubMapper {

    constructor(private readonly sql: Sql) {}

    async create(create: CreateClub, tx?: postgres.TransactionSql): Promise<number> {
        const query = tx || this.sql;
        const result = await query`insert into club ${ query(create, 'name', 'shortName', 'city', 'countryCode', 'district', 'homeVenueId', 'iconLarge', 'iconSmall', 'primaryColour', 'secondaryColour', 'normalizedSearch') } returning id`;
        if (result.length !== 1) {
            throw new Error(`Failed to create club`);
        }
        return result[0].id;
    }
    
    async updateById(clubId: ClubId, update: UpdateClub, tx?: postgres.TransactionSql): Promise<number> {
        const query = tx || this.sql;
        const result = await query`update club set ${ query(update, 'name', 'shortName', 'city', 'countryCode', 'district', 'homeVenueId', 'iconLarge', 'iconSmall', 'primaryColour', 'secondaryColour', 'normalizedSearch') } where id = ${ clubId } returning id`;
        if (result.length !== 1) {
            throw new Error(`Failed to update club`);
        }
        return result[0].id;
    }

    async getById(id: number): Promise<Club | null> {
        const result = await this.sql<ClubDaoInterface[]>`select * from club where id = ${ id }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    async getMultipleByIds(ids: number[]): Promise<Club[]> {
        return (await this.getMultipleByIdsResult(ids)).map(item => this.convertToEntity(item));
    }

    async getMapByIds(ids: number[]): Promise<Map<number, Club>> {
        const result = await this.sql<ClubDaoInterface[]>`select * from club where id in ${ this.sql(ids) }`;
        if (result.length === 0) {
            return new Map();
        }

        const resultMap = new Map<number, Club>();
        for (const resultItem of result) {
            const entityItem = this.convertToEntity(resultItem);
            resultMap.set(entityItem.id, entityItem);
        }
        return resultMap;
    }

    async search(parts: string[]): Promise<Club[]> {
        const results = await Promise.all(parts.map(part => this.findByNormalizedSearchValue(part)));
        const matchedIds = results.flat().map(item => item.id);    
        return await this.getMultipleByIds(groupByOccurrenceAndGetLargest(matchedIds));
    }

    private async findByNormalizedSearchValue(search: string): Promise<IdInterface[]> {
        const wildCard = `%${search}%`;
        return await this.sql<IdInterface[]>`select id from club where normalized_search like ${ wildCard } limit 50`;
    }

    private async getMultipleByIdsResult(ids: number[]): Promise<ClubDaoInterface[]> {
        return await this.sql<ClubDaoInterface[]>`select * from club where id in ${ this.sql(ids) }`;
    }

    private convertToEntity(item: ClubDaoInterface): Club {
        return {
            ...item,
        };
    }

}