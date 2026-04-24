import { GameId } from "@src/util/domain-types";
import { GameAbsenceMapper } from "./mapper";
import { GameAbsence } from "@src/model/internal/game-absence";
import { validateNotNull } from "@src/util/validation";

export class GameAbsenceService {

    constructor(private readonly mapper: GameAbsenceMapper) {}

    async getForGame(gameId: GameId): Promise<GameAbsence[]> {
        validateNotNull(gameId, "gameId");

        return await this.mapper.getForGame(gameId);
    }

    async getOrderedAbsencesForGamesMap(gameIds: GameId[]): Promise<Map<GameId, GameAbsence[]>> {
        validateNotNull(gameIds, "gameIds");
        if (gameIds.length === 0) {
            return new Map();
        }

        return await this.mapper.getOrderedAbsencesForGamesMap(gameIds);
    }

}