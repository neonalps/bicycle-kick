import { Game } from "@src/model/internal/game";
import { GameMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";

export class GameService {

    constructor(private readonly mapper: GameMapper) {}

    async getMultipleByIds(ids: number[]): Promise<Game[]> {
        validateNotNull(ids, "ids");

        return await this.mapper.getMultipleByIds(ids);
    }

}