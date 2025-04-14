import { GetAllSeasonsRequestDto } from "@src/model/external/dto/get-all-seasons-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { SeasonDto } from "@src/model/external/dto/season";
import { Season } from "@src/model/internal/season";
import { ApiHelperService } from "@src/module/api-helper/service";
import { MAX_DATE, MIN_DATE, SortOrder } from "@src/module/pagination/constants";
import { PaginationService } from "@src/module/pagination/service";
import { GetAllSeasonsPaginationParams, SeasonService } from "@src/module/season/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class GetAllSeasonsRouteHandler implements RouteHandler<GetAllSeasonsRequestDto, PaginatedResponseDto<SeasonDto>> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly paginationService: PaginationService,
        private readonly seasonService: SeasonService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetAllSeasonsRequestDto): Promise<PaginatedResponseDto<SeasonDto>> {
        this.paginationService.validateQueryParams(dto);
        const paginationParams = this.getPaginationParams(dto);
        const seasons = await this.seasonService.getAllPaginated(paginationParams);

        return {
            nextPageKey: this.buildNextPageKey(seasons, paginationParams),
            items: seasons.map(item => this.apiHelper.convertSeasonToDto(item)),
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
                lastSeen,
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
            lastSeen: this.paginationService.getLastElement(items).start,
        };

        return this.paginationService.encode(newParams);
    }

}