import { GetPlayerAppearancesRequestDto } from "@src/model/external/dto/get-player-appearances-request";
import { GetPlayerAppearancesResponseDto } from "@src/model/external/dto/get-player-appearances-response";
import { PaginatedResponseDto } from "@src/model/external/dto/paginated-response";
import { RankedPersonResultItemDto } from "@src/model/external/dto/player-competition-stats";
import { ApiHelperService } from "@src/module/api-helper/service";
import { CompetitionService } from "@src/module/competition/service";
import { MAX_NUMBER, RankOffset, SortOrder } from "@src/module/pagination/constants";
import { PaginationService } from "@src/module/pagination/service";
import { GetPlayerAppearancesPaginationParams, RankedValuePaginationLastSeen, StatsService } from "@src/module/stats/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { ArrayNonEmpty, isDefined, splitNonEmptyArrayString } from "@src/util/common";
import { CompetitionId } from "@src/util/domain-types";

export class GetPlayerAppearanceStatsRouteHandler implements RouteHandler<GetPlayerAppearancesRequestDto, PaginatedResponseDto<GetPlayerAppearancesResponseDto>> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly competitionService: CompetitionService,
        private readonly paginationService: PaginationService,
        private readonly statsService: StatsService,
    ) {}

    public async handle(_: AuthenticationContext, request: GetPlayerAppearancesRequestDto): Promise<PaginatedResponseDto<GetPlayerAppearancesResponseDto>> {
        this.paginationService.validatePaginatedRequest(request, (requestProperties) => {
            if (requestProperties.length === 0) {
                return `At least one query property must be passed for this request`;
            }
        });

        const paginationParams = this.getPaginationParams(request);

        const paginatedResult = await this.statsService.getMostAppearancesPaginated(
            {
                onlyForMain: paginationParams.forMain,
                onlyCompetitions: isDefined(paginationParams.competitionIds) ? await this.competitionService.getEffectiveCompetitionIds(paginationParams.competitionIds) : undefined,
            }, paginationParams);
        const responseItems = await this.apiHelperService.convertRankedPlayerResultItemToDto([...paginatedResult]);

        return {
            nextPageKey: this.buildNextPageKey(responseItems, paginationParams),
            items: responseItems,
        }
    }

    private getPaginationParams(dto: GetPlayerAppearancesRequestDto): GetPlayerAppearancesPaginationParams {
        if (!dto.nextPageKey) {
            const order: SortOrder = dto.order === SortOrder.Ascending ? SortOrder.Ascending : SortOrder.Descending;
            const limit: number = dto.limit || 30;
            const lastSeen: RankedValuePaginationLastSeen = order === SortOrder.Ascending ? { value: -1, personId: 0, rankOffset: { display: 0, effective: 0 } } : { value: MAX_NUMBER, personId: MAX_NUMBER, rankOffset: { display: 0, effective: 0 } };

            const params: GetPlayerAppearancesPaginationParams = {
                order,
                limit,
                lastSeen,
                forMain: dto.forMain,
            };

            if (isDefined(dto.competitions)) {
                params.competitionIds = splitNonEmptyArrayString(dto.competitions).map(item => Number(item)) as ArrayNonEmpty<CompetitionId>;
            }

            return params;
        }

        return this.paginationService.decode<GetPlayerAppearancesPaginationParams>(dto.nextPageKey);
    }

    private buildNextPageKey(items: RankedPersonResultItemDto[], oldParams: GetPlayerAppearancesPaginationParams): string | undefined {
        if (items.length < oldParams.limit) {
            return;
        }

        const lastElement = this.paginationService.getLastElement(items);

        const rankOffset: RankOffset = {
            display: lastElement.rank,
            effective: lastElement.rank + items.filter(item => item.value === lastElement.value).length - 1,
        }

        const newParams: GetPlayerAppearancesPaginationParams = {
            limit: oldParams.limit,
            order: oldParams.order,
            lastSeen: { value: lastElement.value, personId: lastElement.person.id, rankOffset: rankOffset },
            forMain: oldParams.forMain,
        };

        if (isDefined(oldParams.competitionIds)) {
            newParams.competitionIds = oldParams.competitionIds;
        }

        return this.paginationService.encode(newParams);
    }

}