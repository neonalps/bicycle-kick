import { Sql } from "@src/db";
import { SquadDaoInterface } from "@src/model/internal/interface/squad.interface";
import { SquadMember } from "@src/model/internal/squad-member";
import { PersonId, SeasonId } from "@src/util/domain-types";

export class SquadMapper {
    
    constructor(private readonly sql: Sql) {}

    async getForSeason(seasonId: SeasonId): Promise<SquadMember[]> {
        const result = await this.sql<SquadDaoInterface[]>`select * from squad where season_id = ${seasonId} order by shirt`;
        if (result.length === 0) {
            return [];
        }

        return result.map(item => this.convertToEntity(item));
    }

    async getActiveMembers(seasonId: SeasonId): Promise<PersonId[]> {
        const result = await this.sql<Array<{ personId: PersonId }>>`
            select
                sq.person_id
            from
                squad sq
            where
                sq.season_id = ${seasonId} and
                (sq.start is null or sq.start < now()) and
                (sq.end is null or sq.end > now())
        `;

        if (result.length === 0) {
            return [];
        }

        return result.map(item => item.personId);
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