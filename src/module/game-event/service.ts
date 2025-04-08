import { GameEvent } from "@src/model/internal/game-event";
import { GameEventMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";

export class GameEventService {

    constructor(private readonly mapper: GameEventMapper) {}

    async getOrderedEventsForGame(gameId: number): Promise<GameEvent[]> {
        return await this.mapper.getOrderedEventsForGame(gameId);
    }

    async getOrderedEventsForGamesMap(gameIds: number[]): Promise<Map<number, GameEvent[]>> {
        validateNotNull(gameIds, "gameIds");
        if (gameIds.length === 0) {
            return new Map();
        }

        return await this.mapper.getOrderedEventsForGamesMap(gameIds);
    }

}