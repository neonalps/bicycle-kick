import { Sql } from "@src/db";
import { SquadDaoInterface } from "@src/model/internal/interface/squad.interface";
import { SquadMember } from "@src/model/internal/squad-member";

export class SquadMapper {
    
    constructor(private readonly sql: Sql) {}

    async getForSeason(seasonId: number): Promise<SquadMember[]> {
        const result = await this.sql<SquadDaoInterface[]>`select * from squad where season_id = ${seasonId} order by shirt`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    private convertToEntity(item: SquadDaoInterface): SquadMember {
        return {
            id: item.id,
            seasonId: item.seasonId,
            personId: item.personId,
            shirt: item.shirt,
            overallPosition: item.overallPosition,
            from: item.start,
            to: item.end,
            loan: item.loan,
        }
    }

}