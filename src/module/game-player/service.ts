import { validateNotNull } from "@src/util/validation";
import { GamePlayerMapper } from "./mapper";
import { GamePlayer } from "@src/model/internal/game-player";
import { PaginationParams } from "@src/module/pagination/constants";
import { DateString, PersonId } from "@src/util/domain-types";

export interface GetPlayerGamesPlayedPaginationParams extends PaginationParams<DateString> {
    competitionId?: string;
    opponentId?: string;
    seasonId?: string;
    minutesPlayed?: string;
    goalsScored?: string;
    assists?: string;
    goalsConceded?: string;
    ownGoals?: number;
    yellowCard?: boolean;
    yellowRedCard?: boolean;
    redCard?: boolean;
    regulationPenaltiesTaken?: string;
    regulationPenaltiesScored?: string;
    regulationPenaltiesFaced?: string;
    regulationPenaltiesSaved?: string;
    psoPenaltiesTaken?: string;
    psoPenaltiesScored?: string;
    psoPenaltiesFaced?: string;
    psoPenaltiesSaved?: string;
    forMain?: boolean;
}

export class GamePlayerService {

    constructor(private readonly mapper: GamePlayerMapper) {}

    async getPlayersForGame(gameId: number): Promise<GamePlayer[]> {
        validateNotNull(gameId, "gameId");

        return await this.mapper.getPlayersForGame(gameId);
    }

    async getPlayersForGamesMap(gameIds: number[]): Promise<Map<number, GamePlayer[]>> {
        validateNotNull(gameIds, "gameIds");
        if (gameIds.length === 0) {
            return new Map();
        }

        return await this.mapper.getPlayersForGamesMap(gameIds);
    }

    async getGamesPlayedPaginated(personId: PersonId, params: GetPlayerGamesPlayedPaginationParams): Promise<GamePlayer[]> {
        validateNotNull(personId, "personId");
        validateNotNull(params, "params");
        validateNotNull(params.limit, "params.limit");
        validateNotNull(params.order, "params.order");
        validateNotNull(params.lastSeen, "params.lastSeen");

        return await this.mapper.getGamesPlayedPaginated(personId, params);
    }

}