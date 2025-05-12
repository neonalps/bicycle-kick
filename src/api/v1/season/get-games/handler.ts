import { DetailedGameDto } from "@src/model/external/dto/detailed-game";
import { GetSeasonGamesRequestDto } from "@src/model/external/dto/get-season-games.request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GameService } from "@src/module/game/service";
import { MAX_DATE, MIN_DATE, SortOrder } from "@src/module/pagination/constants";
import { PaginationService } from "@src/module/pagination/service";
import { GetSeasonGamesPaginationParams } from "@src/module/season/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class GetSeasonGamesRouteHandler implements RouteHandler<GetSeasonGamesRequestDto, PaginatedResponseDto<DetailedGameDto>> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly gameService: GameService,
        private readonly paginationService: PaginationService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetSeasonGamesRequestDto): Promise<PaginatedResponseDto<DetailedGameDto>> {
        this.paginationService.validateQueryParams(dto);
        const paginationParams = this.getPaginationParams(dto);

        const orderedGameIds = await this.gameService.getOrderedIdsForSeasonPaginated(dto.seasonId, paginationParams);
        const detailedGameDtos = await this.apiHelper.getOrderedDetailedGameDtos(orderedGameIds);

        return {
            nextPageKey: this.buildNextPageKey(detailedGameDtos, paginationParams),
            items: detailedGameDtos,
        }
    }

    private getPaginationParams(dto: GetSeasonGamesRequestDto): GetSeasonGamesPaginationParams {
        if (!dto.nextPageKey) {
            const order: SortOrder = dto.order === SortOrder.Ascending ? SortOrder.Ascending : SortOrder.Descending;
            const limit: number = dto.limit || 100;
            const lastSeen: Date = order === SortOrder.Ascending ? MIN_DATE : MAX_DATE;

            return {
                order,
                limit,
                lastSeen,
            };
        }

        return this.paginationService.decode<GetSeasonGamesPaginationParams>(dto.nextPageKey);
    }

    private buildNextPageKey(items: DetailedGameDto[], oldParams: GetSeasonGamesPaginationParams): string | undefined {
        if (items.length < oldParams.limit) {
            return;
        }

        const newParams: GetSeasonGamesPaginationParams = {
            limit: oldParams.limit,
            order: oldParams.order,
            lastSeen: this.paginationService.getLastElement(items).kickoff,
        };

        return this.paginationService.encode(newParams);
    }

}