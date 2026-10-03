import { GetShirtStatsRequestDto } from "@src/model/external/dto/get-shirt-stats-request";
import { GetShirtStatsResponseDto } from "@src/model/external/dto/get-shirt-stats-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { PersonService } from "@src/module/person/service";
import { ELIGIBLE_SHIRT_WORN_BY_SORT_MODES, ShirtWornBySortMode, StatsService } from "@src/module/stats/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { uniqueArrayElements } from "@src/util/common";
import { validateTrue } from "@src/util/validation";

export class GetShirtStatsRouteHandler implements RouteHandler<GetShirtStatsRequestDto, GetShirtStatsResponseDto> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly personService: PersonService,
        private readonly statsService: StatsService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetShirtStatsRequestDto): Promise<GetShirtStatsResponseDto> {
        const sortMode: ShirtWornBySortMode = dto.sortMode ?? 'temporal';
        validateTrue(ELIGIBLE_SHIRT_WORN_BY_SORT_MODES.includes(sortMode), `Invalid parameter for sortMode. Allowed values are: ${ELIGIBLE_SHIRT_WORN_BY_SORT_MODES.join(', ')}`);

        const shirtWornBy = await this.statsService.getShirtWornBy(Number(dto.shirt), sortMode);

        const wornByPersonIds = uniqueArrayElements(shirtWornBy.map(item => item.personId));
        const wornByPersons = await this.personService.getMapByIds(wornByPersonIds);
        
        return {
            wornBy: this.apiHelperService.convertShirtWornBy(shirtWornBy, wornByPersons),
        }
    }

}