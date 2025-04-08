import { Game } from "@src/model/internal/game";
import { GameMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";

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

}