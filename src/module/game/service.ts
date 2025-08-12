import { Game } from "@src/model/internal/game";
import { GameMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";
import { GetSeasonGamesPaginationParams, SeasonService } from "@src/module/season/service";
import { CreateGameRequestDto } from "@src/model/external/dto/create-game-request";
import { QueryOptions } from "@src/model/internal/query-options";
import { GameId } from "@src/util/domain-types";

export class GameService {

    constructor(
        private readonly mapper: GameMapper,
        private readonly seasonService: SeasonService,
    ) {}

    async getById(id: GameId): Promise<Game | null> {
        validateNotNull(id, "id");

        return await this.mapper.getById(id);
    }

    async requireById(id: GameId): Promise<Game> {
        const game = await this.getById(id);
        if (game === null) {
            throw new Error(`No game with ID ${id} exists`);
        }
        return game;
    }

    async getMultipleByIds(ids: number[]): Promise<Game[]> {
        validateNotNull(ids, "ids");
        if (ids.length === 0) {
            return [];
        }

        return await this.mapper.getMultipleByIds(ids);
    }

    async getOrderedIdsForSeasonPaginated(seasonId: number, params: GetSeasonGamesPaginationParams): Promise<number[]> {
        validateNotNull(seasonId, "seasonId");
        validateNotNull(params, "params");
        validateNotNull(params.lastSeen, "params.lastSeenDate");
        validateNotNull(params.limit, "params.limit");
        validateNotNull(params.order, "params.order");

        const season = await this.seasonService.getById(seasonId);
        if (season === null) {
            throw new Error(`No sesaon with ID ${seasonId} exists`);
        }

        return await this.mapper.getOrderedSeasonGameIdsPaginated(season.id, params.lastSeen, params.limit, params.order);
    }

    async create(dto: CreateGameRequestDto): Promise<Game> {
        validateNotNull(dto, "dto");
        validateNotNull(dto.kickoff, "dto.kickoff");

        const season = await this.seasonService.getForDate(dto.kickoff);
        if (season === null) {
            throw new Error(`No season found for kickoff date ${dto.kickoff}`);
        }

        const createdGameId = await this.mapper.createOrUpdatedScheduled({
            ...dto,
            seasonId: season.id,
            isPractice: dto.isPractice ?? false,
            isNeutralGround: dto.isNeutralGround ?? false,
        });

        const createdGame = await this.getById(createdGameId);
        if (createdGame === null) {
            throw new Error(`Failed to create new game`);
        }
        return createdGame;
    }

    async deleteById(gameId: number): Promise<void> {
        validateNotNull(gameId, "gameId");
        
        const game = await this.getById(gameId);
        if (game === null) {
            throw new Error(`No game with ID ${gameId} exists`);
        }

        return await this.mapper.deleteById(gameId);
    }

    async getNextGames(from: Date, take: number = 1): Promise<Game[]> {
        validateNotNull(from, "from");

        return await this.mapper.getNextGames(from, take);
    }

    async getPreviousGames(from: Date, take: number = 1): Promise<Game[]> {
        validateNotNull(from, "from");

        return await this.mapper.getPreviousGames(from, take);
    }

    async getLastFinishedGames(
        take: number, 
        queryOptions: QueryOptions = {}): Promise<Array<Game>> {
        validateNotNull(take, "take");

        return await this.mapper.getLastFinishedGames(take, queryOptions);
    }

    async search(parts: string[]): Promise<Game[]> {
        validateNotNull(parts, "parts");

        return await this.mapper.search(parts);
    }

}