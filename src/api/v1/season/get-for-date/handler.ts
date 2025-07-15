import { GetSeasonForDateRequestDto } from "@src/model/external/dto/get-season-for-date-request";
import { SmallSeasonDto } from "@src/model/external/dto/small-season";
import { ApiHelperService } from "@src/module/api-helper/service";
import { SeasonService } from "@src/module/season/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class GetSeasonForDateHandler implements RouteHandler<GetSeasonForDateRequestDto, SmallSeasonDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly seasonService: SeasonService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetSeasonForDateRequestDto): Promise<SmallSeasonDto> {
        const season = await this.seasonService.getForDate(dto.date);
        if (season === null) {
            throw new Error(`No season found for date ${dto.date}`);
        }
        return this.apiHelper.convertSeasonToSmallDto(season);
    }

}