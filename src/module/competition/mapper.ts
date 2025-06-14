import { Sql } from "@src/db";
import { Competition } from "@src/model/internal/competition";
import { CreateCompetition } from "@src/model/internal/create-competition";
import { CompetitionDaoInterface } from "@src/model/internal/interface/competition.interface";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { groupByOccurrenceAndGetLargest } from "@src/util/functional-queries";
import postgres from "postgres";

export class CompetitionMapper {

    constructor(private readonly sql: Sql) {}

    async create(create: CreateCompetition, tx?: postgres.TransactionSql): Promise<number> {
        const query = tx || this.sql;
        const result = await query`insert into competition ${ query(create, 'name', 'shortName', 'isDomestic', 'parentId', 'combineStatisticsWithParent', 'iconLarge', 'iconSmall', 'normalizedSearch') } returning id`;
        if (result.length !== 1) {
            throw new Error(`Failed to create competition`);
        }
        return result[0].id;
    }

    async getById(id: number): Promise<Competition | null> {
        const result = await this.sql<CompetitionDaoInterface[]>`select * from competition where id = ${ id }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    async getMultipleByIds(ids: number[]): Promise<Competition[]> {
        return (await this.getMultipleByIdsResult(ids)).map(item => this.convertToEntity(item));
    }

    async getAllInMap(): Promise<Map<number, Competition>> {
        const result = await this.sql<CompetitionDaoInterface[]>`select * from competition`;
        if (result.length === 0) {
            return new Map();
        }

        const resultMap = new Map<number, Competition>();
        for (const resultItem of result) {
            const entityItem = this.convertToEntity(resultItem);
            resultMap.set(entityItem.id, entityItem);
        }
        return resultMap;
    }

    async getMapByIds(ids: number[]): Promise<Map<number, Competition>> {
        const result = await this.sql<CompetitionDaoInterface[]>`select * from competition where id in ${ this.sql(ids) }`;
        if (result.length === 0) {
            return new Map();
        }

        const resultMap = new Map<number, Competition>();
        for (const resultItem of result) {
            const entityItem = this.convertToEntity(resultItem);
            resultMap.set(entityItem.id, entityItem);
        }
        return resultMap;
    }

    async search(parts: string[]): Promise<Competition[]> {
        const results = await Promise.all(parts.map(part => this.findByNormalizedSearchValue(part)));
        const matchedIds = results.flat().map(item => item.id);    
        return await this.getMultipleByIds(groupByOccurrenceAndGetLargest(matchedIds));
    }

    private async findByNormalizedSearchValue(search: string): Promise<IdInterface[]> {
        const wildCard = `%${search}%`;
        return await this.sql<IdInterface[]>`select id from competition where normalized_search like ${ wildCard } limit 50`;
    }

    private async getMultipleByIdsResult(ids: number[]): Promise<CompetitionDaoInterface[]> {
        return await this.sql<CompetitionDaoInterface[]>`select * from competition where id in ${ this.sql(ids) }`;
    }

    private convertToEntity(item: CompetitionDaoInterface): Competition {
        return {
            id: item.id,
            name: item.name,
            shortName: item.shortName,
            iconSmall: item.iconSmall,
            iconLarge: item.iconLarge,
            isDomestic: item.isDomestic,
            combineStatisticsWithParent: item.combineStatisticsWithParent,
            parentId: item.parentId,
        };
    }

}