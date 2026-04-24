import { GameEvent } from "@src/model/internal/game-event";
import { GameEventMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";
import { GameId } from "@src/util/domain-types";

export class GameEventService {

    constructor(private readonly mapper: GameEventMapper) {}

    async getOrderedEventsForGame(gameId: GameId): Promise<GameEvent[]> {
        return await this.mapper.getOrderedEventsForGame(gameId);
    }

    async getOrderedEventsForGamesMap(gameIds: GameId[]): Promise<Map<GameId, GameEvent[]>> {
        validateNotNull(gameIds, "gameIds");
        if (gameIds.length === 0) {
            return new Map();
        }

        return await this.mapper.getOrderedEventsForGamesMap(gameIds);
    }

}