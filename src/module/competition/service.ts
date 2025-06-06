import { Competition } from "@src/model/internal/competition";
import { validateNotNull } from "@src/util/validation";
import { CompetitionMapper } from "./mapper";

export class CompetitionService {

    constructor(private readonly mapper: CompetitionMapper) {}

    async getById(id: number): Promise<Competition | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async getMapByIds(ids: number[]): Promise<Map<number, Competition>> {
        validateNotNull(ids, "ids");
        if (ids.length === 0) {
            return new Map();
        }

        return await this.mapper.getMapByIds(ids);
    }

    async search(parts: string[]): Promise<Competition[]> {
        validateNotNull(parts, "parts");

        return await this.mapper.search(parts);
    }

}