import { validateNotNull } from "@src/util/validation";
import { GameAttendedMapper } from "./mapper";

export class GameAttendedService {

    constructor(private readonly mapper: GameAttendedMapper) {}

    async setGameAttendedStatus(accountId: number, gameId: number, attended: boolean): Promise<void> {
        validateNotNull(accountId, "accountId");
        validateNotNull(gameId, "gameId");
        validateNotNull(attended, "attended");

        return await this.mapper.setGameAttendedStatus(accountId, gameId, attended);
    }

    async getGameStars(accountId: number, gameIds: number[]): Promise<number[]> {
        validateNotNull(accountId, "accountId");
        validateNotNull(gameIds, "gameIds");

        return await this.mapper.getGameAttended(accountId, gameIds);
    }

    async getGameAttendedCount(gameIds: number[]): Promise<Map<number, number>> {
        validateNotNull(gameIds, "gameIds");

        return await this.getGameAttendedCount(gameIds);
    }

}