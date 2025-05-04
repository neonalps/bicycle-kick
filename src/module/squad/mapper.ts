import { Sql } from "@src/db";
import { SquadDaoInterface } from "@src/model/internal/interface/squad.interface";
import { Squad } from "@src/model/internal/squad";

export class SquadMapper {
    
    constructor(private readonly sql: Sql) {}

    async getForSeason(seasonId: number): Promise<Squad[]> {
        const result = await this.sql<SquadDaoInterface[]>`select * from squad where season_id = ${seasonId} order by shirt`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    private convertToEntity(item: SquadDaoInterface): Squad {
        return {
            id: item.id,
            seasonId: item.seasonId,
            personId: item.personId,
            shirt: item.shirt,
            overallPosition: item.overallPosition,
        }
    }

}