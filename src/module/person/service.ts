import { Person } from "@src/model/internal/person";
import { PersonMapper } from "./mapper";
import { validateNotBlank, validateNotNull } from "@src/util/validation";
import { CreatePerson } from "@src/model/internal/create-person";
import { normalizeForSearch } from "@src/util/search";
import { UpdatePerson } from "@src/model/internal/update-person";
import { PersonId } from "@src/util/domain-types";
import { ArrayNonEmpty } from "@src/util/common";

export class PersonService {

    constructor(private readonly mapper: PersonMapper) {}

    async create(createPerson: Omit<CreatePerson, 'normalizedSearch'>): Promise<Person> {
        validateNotNull(createPerson, "createPerson");
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

    async updateById(personId: PersonId, updatePerson: Omit<UpdatePerson, 'normalizedSearch'>): Promise<Person> {
        validateNotNull(personId, "personId");
        validateNotNull(updatePerson, "updatePerson");
        validateNotBlank(updatePerson.lastName, "updatePerson.lastName");

        await this.requireById(personId);

        await this.mapper.updateById(personId, {
            ...updatePerson,
            normalizedSearch: normalizeForSearch([updatePerson.firstName, updatePerson.lastName].join(" ")),
        });
        
        return await this.requireById(personId);
    }

    async getById(id: PersonId): Promise<Person | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async requireById(id: PersonId): Promise<Person> {
        const person = await this.getById(id);
        if (person === null) {
            throw new Error(`No person with ID ${id} exists`);
        }
        return person;
    }

    async getMapByIds(ids: PersonId[]): Promise<Map<number, Person>> {
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

    async mergePersons(personIdsToMerge: PersonId[]): Promise<void> {
        // check that all personst exist
        const existingPersonIds = await this.mapper.getMultipleByIds(personIdsToMerge);
        if (personIdsToMerge.length !== existingPersonIds.length) {
            throw new Error(`Not all passed persons exist`);
        }

        
    }

}