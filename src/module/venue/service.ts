import { Venue } from "@src/model/internal/venue";
import { VenueMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";

export class VenueService {

    constructor(private readonly mapper: VenueMapper) {}

    async getById(id: number): Promise<Venue | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async getMultipleByIds(ids: number[]): Promise<Map<number, Venue>> {
        validateNotNull(ids, "ids");
        if (ids.length === 0) {
            return new Map();
        }

        return await this.mapper.getMultipleByIds(ids);
    }

}