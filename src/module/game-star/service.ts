import { validateNotNull } from "@src/util/validation";
import { GameStarMapper } from "./mapper";
import { AccountId, GameId } from "@src/util/domain-types";

export class GameStarService {

    constructor(private readonly mapper: GameStarMapper) {}

    async setGameStarStatus(accountId: AccountId, gameId: GameId, starred: boolean): Promise<void> {
        validateNotNull(accountId, "accountId");
        validateNotNull(gameId, "gameId");
        validateNotNull(starred, "starred");

        return await this.mapper.setGameStarStatus(accountId, gameId, starred);
    }

    async getGameStars(accountId: AccountId, gameIds: GameId[]): Promise<GameId[]> {
        validateNotNull(accountId, "accountId");
        validateNotNull(gameIds, "gameIds");

        return await this.mapper.getGameStars(accountId, gameIds);
    }

    async getGameStarsForAccount(accountId: AccountId): Promise<GameId[]> {
        validateNotNull(accountId, "accountId");

        return await this.mapper.getGameStarsForAccount(accountId);
    }

    async getGameStarCount(gameIds: GameId[]): Promise<Map<GameId, number>> {
        validateNotNull(gameIds, "gameIds");

        return await this.getGameStarCount(gameIds);
    }

}