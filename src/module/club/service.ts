import { Club } from "@src/model/internal/club";
import { ClubMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";

export class ClubService {

    constructor(private readonly mapper: ClubMapper) {}

    async getById(id: number): Promise<Club | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async getMapByIds(ids: number[]): Promise<Map<number, Club>> {
        validateNotNull(ids, "ids");
        if (ids.length === 0) {
            return new Map();
        }

        return await this.mapper.getMapByIds(ids);
    }

    searchByName(parts: string[]): Promise<Club[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
            ]), 89);
        });
    }

}