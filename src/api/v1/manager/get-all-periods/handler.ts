import { GetManagerPeriodsRequestDto } from "@src/model/external/dto/get-manager-periods-request";
import { ManagerPeriodDto } from "@src/model/external/dto/manager-period";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { GetManagerPeriodsPaginationParams, ManagerPeriodService } from "@src/module/manager-period/service";
import { MAX_DATE, MIN_DATE, SortOrder } from "@src/module/pagination/constants";
import { PaginationService } from "@src/module/pagination/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class GetAllManagerPeriodsRouteHandler implements RouteHandler<GetManagerPeriodsRequestDto, PaginatedResponseDto<ManagerPeriodDto>> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly managerPeriodService: ManagerPeriodService,
        private readonly paginationService: PaginationService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetManagerPeriodsRequestDto): Promise<PaginatedResponseDto<ManagerPeriodDto>> {
        this.paginationService.validateQueryParams(dto);
        const paginationParams = this.getPaginationParams(dto);

        const orderedPeriods = await this.managerPeriodService.getAllPaginated(paginationParams);
        const responseItems = await this.apiHelperService.convertManagerPeriodsToDtos(orderedPeriods);

        return {
            nextPageKey: this.buildNextPageKey(responseItems, paginationParams),
            items: responseItems,
        }
    }

    private getPaginationParams(dto: GetManagerPeriodsRequestDto): GetManagerPeriodsPaginationParams {
        if (!dto.nextPageKey) {
            const order: SortOrder = dto.order === SortOrder.Ascending ? SortOrder.Ascending : SortOrder.Descending;
            const limit: number = dto.limit || 20;
            const lastSeen: Date = order === SortOrder.Ascending ? MIN_DATE : MAX_DATE;

            const params: GetManagerPeriodsPaginationParams = {
                order,
                limit,
                lastSeen: lastSeen.toISOString(),
            };

            return params;
        }

        return this.paginationService.decode<GetManagerPeriodsPaginationParams>(dto.nextPageKey);
    }

    private buildNextPageKey(items: ManagerPeriodDto[], oldParams: GetManagerPeriodsPaginationParams): string | undefined {
        if (items.length < oldParams.limit) {
            return;
        }

        const newParams: GetManagerPeriodsPaginationParams = {
            limit: oldParams.limit,
            order: oldParams.order,
            lastSeen: this.paginationService.getLastElement(items).start,
        };

        return this.paginationService.encode(newParams);
    }

}