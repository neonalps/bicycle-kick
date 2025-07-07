import { Club } from "@src/model/internal/club";
import { ClubMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";

export class ClubService {

    constructor(private readonly mapper: ClubMapper) {}

    async getById(id: number): Promise<Club | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async requireById(id: number): Promise<Club> {
        const club = await this.getById(id);
        if (club === null) {
            throw new Error(`No club with ID ${id} exists`);
        }
        return club;
    }

    async getMapByIds(ids: number[]): Promise<Map<number, Club>> {
        validateNotNull(ids, "ids");
        if (ids.length === 0) {
            return new Map();
        }

        return await this.mapper.getMapByIds(ids);
    }

    async search(parts: string[]): Promise<Club[]> {
        validateNotNull(parts, "parts");

        return await this.mapper.search(parts);
    }

}