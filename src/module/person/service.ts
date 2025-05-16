import { Person } from "@src/model/internal/person";
import { PersonMapper } from "./mapper";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { CreatePerson } from "@src/model/internal/create-person";
import { normalizeForSearch } from "@src/util/search";

export class PersonService {

    constructor(private readonly mapper: PersonMapper) {}

    async create(createPerson: Omit<CreatePerson, 'normalizedSearch'>): Promise<Person> {
        validateNotNull(createPerson, "createPerson");
        validateNotBlank(createPerson.firstName, "createPerson.firstName");
        validateNotBlank(createPerson.lastName, "createPerson.lastName");

        const createdPersonId = await this.mapper.create({
            ...createPerson,
            normalizedSearch: normalizeForSearch([createPerson.firstName, createPerson.lastName].join(" ")),
        });
        const createdPerson = await this.getById(createdPersonId);
        if (createdPerson === null) {
            throw new Error(`Something went wrong while creating person`);
        }
        return createdPerson;
    }

    async getById(id: number): Promise<Person | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async getMapByIds(ids: number[]): Promise<Map<number, Person>> {
        validateNotNull(ids, "ids");
        if (ids.length === 0) {
            return new Map();
        }

        return await this.mapper.getMapByIds(ids);
    }

    async search(parts: string[]): Promise<Person[]> {
        validateNotNull(parts, "parts");

        return await this.mapper.search(parts);
    }

}