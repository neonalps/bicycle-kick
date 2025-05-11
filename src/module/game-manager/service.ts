import { validateNotNull } from "@src/util/validation";
import { GameManager } from "@src/model/internal/game-manager";
import { GameManagerMapper } from "./mapper";

export class GameManagerService {

    constructor(private readonly mapper: GameManagerMapper) {}

    async getManagersForGame(gameId: number): Promise<GameManager[]> {
        validateNotNull(gameId, "gameId");

        return await this.mapper.getManagersForGame(gameId);
    }

    async getManagersForGamesMap(gameIds: number[]): Promise<Map<number, GameManager[]>> {
        validateNotNull(gameIds, "gameIds");
        if (gameIds.length === 0) {
            return new Map();
        }

        return await this.mapper.getManagersForGamesMap(gameIds);
    }

}