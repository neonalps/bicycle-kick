import { validateNotNull } from "@src/util/validation";
import { GamePlayerMapper } from "./mapper";
import { GamePlayer } from "@src/model/internal/game-player";

export class GamePlayerService {

    constructor(private readonly mapper: GamePlayerMapper) {}

    async getPlayersForGame(gameId: number): Promise<GamePlayer[]> {
        validateNotNull(gameId, "gameId");

        return await this.mapper.getPlayersForGame(gameId);
    }

    async getPlayersForGamesMap(gameIds: number[]): Promise<Map<number, GamePlayer[]>> {
        validateNotNull(gameIds, "gameIds");
        if (gameIds.length === 0) {
            return new Map();
        }

        return await this.mapper.getPlayersForGamesMap(gameIds);
    }

}