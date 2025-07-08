import { GetAllSeasonsRequestDto } from "@src/model/external/dto/get-all-seasons-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { SmallSeasonDto } from "@src/model/external/dto/small-season";
import { Season } from "@src/model/internal/season";
import { ApiHelperService } from "@src/module/api-helper/service";
import { CacheService } from "@src/module/cache/service";
import { MAX_DATE, MIN_DATE, SortOrder } from "@src/module/pagination/constants";
import { PaginationService } from "@src/module/pagination/service";
import { GetAllSeasonsPaginationParams, SeasonService } from "@src/module/season/service";
import { ApplicationHeader, AuthenticationContext, CacheableResponse, RouteHandler } from "@src/router/types";

export class GetAllSeasonsRouteHandler implements RouteHandler<GetAllSeasonsRequestDto, CacheableResponse<PaginatedResponseDto<SmallSeasonDto>>> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly cacheService: CacheService,
        private readonly paginationService: PaginationService,
        private readonly seasonService: SeasonService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetAllSeasonsRequestDto, headers: Record<ApplicationHeader, string>): Promise<CacheableResponse<PaginatedResponseDto<SmallSeasonDto>>> {
        this.paginationService.validateQueryParams(dto);
        const paginationParams = this.getPaginationParams(dto);
        const seasons = await this.seasonService.getAllPaginated(paginationParams);

        const responseItems = seasons.map(item => this.apiHelper.convertSeasonToSmallDto(item));

        const previousContentHash = headers[ApplicationHeader.ContentHash];
        const currentContentHash = this.cacheService.getContentHash(responseItems);
        if (previousContentHash === currentContentHash) {
            return null;
        }

        return {
            nextPageKey: this.buildNextPageKey(seasons, paginationParams),
            items: responseItems,
            contentHash: currentContentHash,
        }
    }

    private getPaginationParams(dto: GetAllSeasonsRequestDto): GetAllSeasonsPaginationParams {
        if (!dto.nextPageKey) {
            const order: SortOrder = dto.order === SortOrder.Ascending ? SortOrder.Ascending : SortOrder.Descending;
            const limit: number = dto.limit || 50;
            const lastSeen: Date = order === SortOrder.Ascending ? MIN_DATE : MAX_DATE;

            return {
                order,
                limit,
                lastSeen: lastSeen.toISOString(),
            };
        }

        return this.paginationService.decode<GetAllSeasonsPaginationParams>(dto.nextPageKey);
    }

    private buildNextPageKey(items: Season[], oldParams: GetAllSeasonsPaginationParams): string | undefined {
        if (items.length < oldParams.limit) {
            return;
        }

        const newParams: GetAllSeasonsPaginationParams = {
            limit: oldParams.limit,
            order: oldParams.order,
            lastSeen: this.paginationService.getLastElement(items).start.toISOString(),
        };

        return this.paginationService.encode(newParams);
    }

}