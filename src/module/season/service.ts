import { Season } from "@src/model/internal/season";
import { SeasonMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";
import { DateSource } from "@src/util/date";
import { PaginationParams } from "@src/module/pagination/constants";
import { DateString, SeasonId } from "@src/util/domain-types";

export interface GetAllSeasonsPaginationParams extends PaginationParams<DateString> {}
export interface GetSeasonGamesPaginationParams extends PaginationParams<DateString> {}

export class SeasonService {

    constructor(private readonly dateSource: DateSource, private readonly mapper: SeasonMapper) {}

    async getById(id: SeasonId): Promise<Season | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async requireById(id: SeasonId): Promise<Season> {
        const season = await this.getById(id);
        if (season === null) {
            throw new Error(`No season with ID ${id} exists`);
        }
        return season;
    }

    async getMapByIds(ids: number[]): Promise<Map<number, Season>> {
        validateNotNull(ids, "ids");
        if (ids.length === 0) {
            return new Map();
        }

        return await this.mapper.getMapByIds(ids);
    }

    async getAllOrderedInMap(): Promise<Map<number, Season>> {
        return await this.mapper.getAllOrderedInMap();
    }

    async getForDate(date: DateString): Promise<Season | null> {
        validateNotNull(date, "date");
        
        return await this.mapper.getForDate(date);
    }

    async getAllPaginated(paginationParams: GetAllSeasonsPaginationParams): Promise<Season[]> {
        validateNotNull(paginationParams, "paginationParams");
        validateNotNull(paginationParams.limit, "paginationParams.limit");
        validateNotNull(paginationParams.order, "paginationParams.order");
        validateNotNull(paginationParams.lastSeen, "paginationParams.lastSeen");

        return await this.mapper.getAllPaginated(paginationParams.lastSeen, paginationParams.limit, paginationParams.order);
    }

    async search(parts: string[]): Promise<Season[]> {
        validateNotNull(parts, "parts");

        return await this.mapper.search(parts);
    }

    async getCurrent(): Promise<Season | null> {
        return await this.mapper.getForDate(this.dateSource.getToday().toISOString());
    }

    async getLast(): Promise<Season | null> {
        const currentSeason = await this.getCurrent();
        if (currentSeason === null) {
            return null;
        }

        const lastSeasonEnd = new Date();
        lastSeasonEnd.setDate(currentSeason.start.getDate() - 1);

        return await this.mapper.getForDate(lastSeasonEnd.toISOString());
    }

}