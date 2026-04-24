import { validateNotNull } from "@src/util/validation";
import { GameRefereeMapper } from "./mapper";
import { GameReferee } from "@src/model/internal/game-referee";
import { GameId } from "@src/util/domain-types";

export class GameRefereeService {

    constructor(private readonly mapper: GameRefereeMapper) {}

    async getRefereesForGame(gameId: GameId): Promise<GameReferee[]> {
        validateNotNull(gameId, "gameId");

        return await this.mapper.getRefereesForGame(gameId);
    }

    async getRefereesForGamesMap(gameIds: GameId[]): Promise<Map<GameId, GameReferee[]>> {
        validateNotNull(gameIds, "gameIds");
        if (gameIds.length === 0) {
            return new Map();
        }

        return await this.mapper.getRefereesForGamesMap(gameIds);
    }

}