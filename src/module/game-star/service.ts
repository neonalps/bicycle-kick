import { validateNotNull } from "@src/util/validation";
import { GameStarMapper } from "./mapper";

export class GameStarService {

    constructor(private readonly mapper: GameStarMapper) {}

    async setGameStarStatus(accountId: number, gameId: number, starred: boolean): Promise<void> {
        validateNotNull(accountId, "accountId");
        validateNotNull(gameId, "gameId");
        validateNotNull(starred, "starred");

        return await this.mapper.setGameStarStatus(accountId, gameId, starred);
    }

    async getGameStars(accountId: number, gameIds: number[]): Promise<number[]> {
        validateNotNull(accountId, "accountId");
        validateNotNull(gameIds, "gameIds");

        return await this.mapper.getGameStars(accountId, gameIds);
    }

    async getGameStarCount(gameIds: number[]): Promise<Map<number, number>> {
        validateNotNull(gameIds, "gameIds");

        return await this.getGameStarCount(gameIds);
    }

}