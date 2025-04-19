import { Game } from "@src/model/internal/game";
import { GameMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";
import { SortOrder } from "@src/module/pagination/constants";
import { GetSeasonGamesPaginationParams } from "../season/service";

export class GameService {

    constructor(private readonly mapper: GameMapper) {}

    async getById(id: number): Promise<Game | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async getMultipleByIds(ids: number[]): Promise<Game[]> {
        validateNotNull(ids, "ids");
        if (ids.length === 0) {
            return [];
        }

        return await this.mapper.getMultipleByIds(ids);
    }

    async getForSeasonPaginated(seasonId: number, params: GetSeasonGamesPaginationParams): Promise<Game[]> {
        validateNotNull(seasonId, "seasonId");
        validateNotNull(params, "params");
        validateNotNull(params.lastSeen, "params.lastSeenDate");
        validateNotNull(params.limit, "params.limit");
        validateNotNull(params.order, "params.order");

        return await this.mapper.getOrderedSeasonGamesPaginated(seasonId, params.lastSeen, params.limit, params.order);
    }

}