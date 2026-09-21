import { GameEvent } from "@src/model/internal/game-event";
import { GameEventMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";
import { GameId, PersonId } from "@src/util/domain-types";
import { GameEventType } from "@src/model/external/dto/game-event-type";

export type SentOffPerson = {
    personId: PersonId;
    sentOffType: GameEventType.YellowRedCard | GameEventType.RedCard;
}

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

    async findSentOffMainPlayers(gameId: GameId): Promise<SentOffPerson[]> {
        validateNotNull(gameId, "gameId");

        return await this.mapper.findSentOffMainPlayers(gameId);
    }

}