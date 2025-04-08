import { Person } from "@src/model/internal/person";
import { PersonMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";

export class PersonService {

    constructor(private readonly mapper: PersonMapper) {}

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

    searchByName(parts: string[]): Promise<Person[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
            ]), 200);
        });
    }

}