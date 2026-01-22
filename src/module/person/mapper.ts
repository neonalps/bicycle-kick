import { Sql } from "@src/db";
import { CreatePerson } from "@src/model/internal/create-person";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { PersonDaoInterface } from "@src/model/internal/interface/person.interface";
import { Person } from "@src/model/internal/person";
import { UpdatePerson } from "@src/model/internal/update-person";
import { getOrThrow } from "@src/util/common";
import { PersonId } from "@src/util/domain-types";
import { groupByOccurrenceAndGetLargest } from "@src/util/functional-queries";
import postgres from "postgres";

export class PersonMapper {

    constructor(private readonly sql: Sql) {}

    async create(createPerson: CreatePerson, tx?: postgres.TransactionSql): Promise<number> {
        const query = tx || this.sql;
        const result = await query`insert into person ${ query(createPerson, 'firstName', 'lastName', 'avatar', 'birthday', 'deathday', 'nationalities', 'normalizedSearch') } returning id`;
        if (result.length !== 1) {
            throw new Error(`Failed to insert person`);
        }

        return result[0].id;
    }

    async updateById(personId: PersonId, updatePerson: UpdatePerson, tx?: postgres.TransactionSql): Promise<number> {
        const query = tx || this.sql;
        const result = await query`update person set ${ query(updatePerson, 'firstName', 'lastName', 'avatar', 'birthday', 'deathday', 'nationalities', 'normalizedSearch') } where id = ${ personId } returning id`;
        if (result.length !== 1) {
            throw new Error(`Failed to update person`);
        }

        return result[0].id;
    }

    async getById(id: number): Promise<Person | null> {
        const result = await this.sql<PersonDaoInterface[]>`select * from person where id = ${ id }`;
        if (result.length !== 1) {
            return null;
        }

        return this.convertToEntity(result[0]);
    }

    async getMultipleByIds(ids: number[]): Promise<Person[]> {
        return (await this.getMultipleByIdsResult(ids)).map(item => this.convertToEntity(item));
    }

    async getMapByIds(ids: number[]): Promise<Map<number, Person>> {
        const result = await this.getMultipleByIdsResult(ids);

        const resultMap = new Map<number, Person>();
        result.forEach(resultItem => {
            const entityItem = this.convertToEntity(resultItem);
            resultMap.set(entityItem.id, entityItem);
        });
        return resultMap;
    }

    async search(parts: string[]): Promise<Person[]> {
        const results = await Promise.all(parts.map(part => this.findByNormalizedSearchValue(part)));
        const matchedIds = results.flat().map(item => item.id);

        const groupedPersonIds = groupByOccurrenceAndGetLargest(matchedIds);
        const orderedPersonIds = await this.orderPersonIdsByPopularity(groupedPersonIds);

        const personDetailsMap = await this.getMapByIds(orderedPersonIds);
        return orderedPersonIds.map(personId => getOrThrow(personDetailsMap, personId, `failed to find person ${personId} in details map`));
    }

    private async orderPersonIdsByPopularity(personIds: PersonId[]): Promise<PersonId[]> {
        const result = await this.sql<IdInterface[]>`
            select
                sub.id
            from (
                select 
                    p.id,
                    case when gp.minutes_played is not null then 2 else 0 end as score_played,
                    case when gp.shirt is not null and gp.minutes_played is null then 1 else 0 end as score_sub,
                    case when gp.goals_scored is not null then gp.goals_scored else 0 end as score_goals_scored,
                    case when gp.assists is not null then gp.assists else 0 end as score_assists,
                    case when gr.role is not null then 2 else 0 end as score_referee,
                    case when gm.role is not null then 2 else 0 end as score_manager
                from
                    person p left join	
                    game_players gp on gp.person_id = p.id left join
                    game_managers gm on gm.person_id = p.id left join
                    game_referees gr on gr.person_id = p.id
                where
                    p.id in ${ this.sql(personIds) }
            ) sub 
            group by
                sub.id
            order by
                sum(sub.score_played + sub.score_sub + sub.score_goals_scored + sub.score_assists + sub.score_referee + sub.score_manager) desc
        `;

        return result.map(item => item.id);
    }

    private async findByNormalizedSearchValue(search: string): Promise<IdInterface[]> {
        const wildCard = `%${search}%`;
        return await this.sql<IdInterface[]>`select id from person where normalized_search like ${ wildCard } limit 50`;
    }

    private async getMultipleByIdsResult(ids: number[]): Promise<PersonDaoInterface[]> {
        return await this.sql<PersonDaoInterface[]>`select * from person where id in ${ this.sql(ids) }`;
    }

    private convertToEntity(item: PersonDaoInterface): Person {
        return {
            id: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            avatar: item.avatar,
            birthday: item.birthday,
            deathday: item.deathday,
            nationalities: item.nationalities,
        }
    }

}