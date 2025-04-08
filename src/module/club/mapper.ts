import { Sql } from "@src/db";
import { Club } from "@src/model/internal/club";
import { ClubDaoInterface } from "@src/model/internal/interface/club.interface";

export class ClubMapper {

    constructor(private readonly sql: Sql) {}

    async getById(id: number): Promise<Club | null> {
        const result = await this.sql<ClubDaoInterface[]>`select * from club where id = ${ id }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
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

    private convertToEntity(item: ClubDaoInterface): Club {
        return {
            ...item,
        };
    }

}