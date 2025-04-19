import { Sql } from "@src/db";
import { Competition } from "@src/model/internal/competition";
import { CompetitionDaoInterface } from "@src/model/internal/interface/competition.interface";

export class CompetitionMapper {

    constructor(private readonly sql: Sql) {}

    async getById(id: number): Promise<Competition | null> {
        const result = await this.sql<CompetitionDaoInterface[]>`select * from competition where id = ${ id }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
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

    private convertToEntity(item: CompetitionDaoInterface): Competition {
        return {
            ...item,
        };
    }

}