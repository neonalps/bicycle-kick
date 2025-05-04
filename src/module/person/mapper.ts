import { Sql } from "@src/db";
import { CreatePerson } from "@src/model/internal/create-person";
import { IdInterface } from "@src/model/internal/interface/id.interface";
import { PersonDaoInterface } from "@src/model/internal/interface/person.interface";
import { Person } from "@src/model/internal/person";
import postgres from "postgres";

export class PersonMapper {

    constructor(private readonly sql: Sql) {}

    async create(createPerson: CreatePerson, tx?: postgres.TransactionSql): Promise<number> {
        const query = tx || this.sql;
        const result = await query`insert into person ${ query(createPerson, 'firstName', 'lastName', 'avatar', 'birthday', 'deathday') } returning id`;
        if (result.length !== 1) {
            throw new Error(`Failed to insert person`);
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

    async findByName(parts: string[]): Promise<Person[]> {
        const potentialIdsFromFirstName: number[] = [];
        const potentialIdsFromLastName: number[] = [];

        for (const part of parts) {
            const [firsNameResult, lastNameResult] = await Promise.all([
                this.findByFirstName(part),
                this.findByLastName(part),
            ]);
            
            potentialIdsFromFirstName.push(...firsNameResult.map(result => result.id));
            potentialIdsFromLastName.push(...lastNameResult.map(result => result.id));
        }

        const potentialIds = new Set([...potentialIdsFromFirstName, ...potentialIdsFromLastName]);
        return await this.getMultipleByIds(Array.from(potentialIds));
    }

    private async findByFirstName(firstName: string): Promise<IdInterface[]> {
        return await this.sql<PersonDaoInterface[]>`select id from person where first_name ilike ${ firstName } limit 50`;
    }

    private async findByLastName(firstName: string): Promise<IdInterface[]> {
        return await this.sql<PersonDaoInterface[]>`select id from person where last_name ilike ${ firstName } limit 50`;
    }

    private async getMultipleByIdsResult(ids: number[]): Promise<PersonDaoInterface[]> {
        return await this.sql<PersonDaoInterface[]>`select * from person where id in ${ this.sql(ids) }`;
    }

    private convertToEntity(item: PersonDaoInterface): Person {
        return {
            ...item,
        }
    }

}