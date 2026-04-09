import { BasicCompetitionDto } from "@src/model/external/dto/basic-competition";
import { GetAllCompetitionsRequestDto } from "@src/model/external/dto/get-all-competitions-request";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { CacheService } from "@src/module/cache/service";
import { CompetitionService, GetAllCompetitionsPaginationParams } from "@src/module/competition/service";
import { MAX_NUMBER, MIN_NUMBER, SortOrder } from "@src/module/pagination/constants";
import { PaginationService } from "@src/module/pagination/service";
import { ApplicationHeader, AuthenticationContext, CacheableResponse, RouteHandler } from "@src/router/types";

export class GetAllCompetitionsRouteHandler implements RouteHandler<GetAllCompetitionsRequestDto, CacheableResponse<PaginatedResponseDto<BasicCompetitionDto>>> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly cacheService: CacheService,
        private readonly competitionService: CompetitionService,
        private readonly paginationService: PaginationService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetAllCompetitionsRequestDto, headers: Record<ApplicationHeader, string>): Promise<CacheableResponse<PaginatedResponseDto<BasicCompetitionDto>>> {
        this.paginationService.validateQueryParams(dto);
        const paginationParams = this.getPaginationParams(dto);

        const orderedCompetitions = await this.competitionService.getAllPaginated(paginationParams);
        const responseItems = this.apiHelper.convertOrderedCompetitionsToBasicDto(orderedCompetitions);

        const previousContentHash = headers[ApplicationHeader.ContentHash];
        const currentContentHash = this.cacheService.getContentHash(responseItems);
        if (previousContentHash === currentContentHash) {
            return null;
        }

        return {
            nextPageKey: this.buildNextPageKey(responseItems, paginationParams),
            items: responseItems,
            contentHash: currentContentHash,
        }

    }

    private getPaginationParams(dto: GetAllCompetitionsRequestDto): GetAllCompetitionsPaginationParams {
        if (!dto.nextPageKey) {
            const order: SortOrder = dto.order === SortOrder.Descending ? SortOrder.Descending : SortOrder.Ascending;
            const limit: number = dto.limit || 100;
            const lastSeen: number = order === SortOrder.Ascending ? MIN_NUMBER : MAX_NUMBER;

            return {
                order,
                limit,
                lastSeen,
            };
        }

        return this.paginationService.decode<GetAllCompetitionsPaginationParams>(dto.nextPageKey);
    }

    private buildNextPageKey(items: BasicCompetitionDto[], oldParams: GetAllCompetitionsPaginationParams): string | undefined {
        if (items.length < oldParams.limit) {
            return;
        }

        const newParams: GetAllCompetitionsPaginationParams = {
            limit: oldParams.limit,
            order: oldParams.order,
            lastSeen: this.paginationService.getLastElement(items).sortOrder,
        };

        return this.paginationService.encode(newParams);
    }

}