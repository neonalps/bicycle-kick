import { BasicGameDto } from "@src/model/external/dto/basic-game";
import { GetGamesRequestDto } from "@src/model/external/dto/get-games-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GameService, GetGamesPaginationParams } from "@src/module/game/service";
import { MAX_DATE, MIN_DATE, SortOrder } from "@src/module/pagination/constants";
import { PaginationService } from "@src/module/pagination/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { isDefined } from "@src/util/common";

export class GetGamesPaginatedRouteHandler implements RouteHandler<GetGamesRequestDto, PaginatedResponseDto<BasicGameDto>> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly gameService: GameService,
        private readonly paginationService: PaginationService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetGamesRequestDto): Promise<PaginatedResponseDto<BasicGameDto>> {
        this.paginationService.validateQueryParams(dto);
        const paginationParams = this.getPaginationParams(dto);

        const orderedGames = await this.gameService.getGamesPaginated(paginationParams);
        const responseItems = await this.apiHelperService.getOrderedBasicGameDtos(orderedGames);

        return {
            nextPageKey: this.buildNextPageKey(responseItems, paginationParams),
            items: responseItems,
        };
    }

    private getPaginationParams(dto: GetGamesRequestDto): GetGamesPaginationParams {
        if (!dto.nextPageKey) {
            const order: SortOrder = dto.order === SortOrder.Ascending ? SortOrder.Ascending : SortOrder.Descending;
            const limit: number = dto.limit || 50;
            const lastSeen: Date = order === SortOrder.Ascending ? MIN_DATE : MAX_DATE;

            const params: GetGamesPaginationParams = {
                order,
                limit,
                lastSeen: lastSeen.toISOString(),
            };

            if (isDefined(dto.opponentId)) {
                params.opponentId = dto.opponentId;
            }

            if (isDefined(dto.tendency)) {
                params.tendency = dto.tendency;
            }

            if (isDefined(dto.competitionId)) {
                params.competitionId = dto.competitionId;
            }

            if (isDefined(dto.seasonId)) {
                params.seasonId = dto.seasonId;
            }

            return params;
        }

        return this.paginationService.decode<GetGamesPaginationParams>(dto.nextPageKey);
    }

    private buildNextPageKey(items: BasicGameDto[], oldParams: GetGamesPaginationParams): string | undefined {
        if (items.length < oldParams.limit) {
            return;
        }

        const newParams: GetGamesPaginationParams = {
            limit: oldParams.limit,
            order: oldParams.order,
            lastSeen: this.paginationService.getLastElement(items).kickoff,
        };

        if (isDefined(oldParams.opponentId)) {
            newParams.opponentId = oldParams.opponentId;
        }

        if (isDefined(oldParams.tendency)) {
            newParams.tendency = oldParams.tendency;
        }

        if (isDefined(oldParams.competitionId)) {
            newParams.competitionId = oldParams.competitionId;
        }

        if (isDefined(oldParams.seasonId)) {
            newParams.seasonId = oldParams.seasonId;
        }

        return this.paginationService.encode(newParams);
    }

}