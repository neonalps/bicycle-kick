import { validateNotNull } from "@src/util/validation";
import { GameRefereeMapper } from "./mapper";
import { GameReferee } from "@src/model/internal/game-referee";

export class GameRefereeService {

    constructor(private readonly mapper: GameRefereeMapper) {}

    async getRefereesForGame(gameId: number): Promise<GameReferee[]> {
        validateNotNull(gameId, "gameId");

        return await this.mapper.getRefereesForGame(gameId);
    }

    async getRefereesForGamesMap(gameIds: number[]): Promise<Map<number, GameReferee[]>> {
        validateNotNull(gameIds, "gameIds");
        if (gameIds.length === 0) {
            return new Map();
        }

        return await this.mapper.getRefereesForGamesMap(gameIds);
    }

}