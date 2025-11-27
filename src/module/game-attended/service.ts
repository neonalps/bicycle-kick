import { validateNotNull } from "@src/util/validation";
import { GameAttendedMapper } from "./mapper";
import { AccountId, GameId } from "@src/util/domain-types";

export class GameAttendedService {

    constructor(private readonly mapper: GameAttendedMapper) {}

    async setGameAttendedStatus(accountId: AccountId, gameId: GameId, attended: boolean): Promise<void> {
        validateNotNull(accountId, "accountId");
        validateNotNull(gameId, "gameId");
        validateNotNull(attended, "attended");

        return await this.mapper.setGameAttendedStatus(accountId, gameId, attended);
    }

    async getGameAttended(accountId: AccountId, gameIds: GameId[]): Promise<GameId[]> {
        validateNotNull(accountId, "accountId");
        validateNotNull(gameIds, "gameIds");

        return await this.mapper.getGameAttended(accountId, gameIds);
    }

    async getGameAttendedForAccount(accountId: AccountId): Promise<GameId[]> {
        validateNotNull(accountId, "accountId");

        return await this.mapper.getGameAttendedForAccount(accountId);
    }

    async getGameAttendedCount(gameIds: GameId[]): Promise<Map<number, number>> {
        validateNotNull(gameIds, "gameIds");

        return await this.getGameAttendedCount(gameIds);
    }

}