import { CompetitionResponseDto } from "@src/model/external/dto/competition-response";
import { GetCompetitionByIdRequestDto } from "@src/model/external/dto/get-competition-by-id-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { CompetitionService } from "@src/module/competition/service";
import { SeasonTitlesService } from "@src/module/season-titles/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { promiseAllObject } from "@src/util/common";
import { CompetitionId } from "@src/util/domain-types";

export class GetCompetitionByIdRouteHandler implements RouteHandler<GetCompetitionByIdRequestDto, CompetitionResponseDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly competitionService: CompetitionService,
        private readonly seasonTitleService: SeasonTitlesService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetCompetitionByIdRequestDto): Promise<CompetitionResponseDto> {
        const competitionId: CompetitionId = Number(dto.id);

        const { competition, titles } = await promiseAllObject({
            competition: this.competitionService.requireById(competitionId),
            titles: this.seasonTitleService.getTitlesForCompetition(competitionId),
        });

        const basicCompetitionDto = this.apiHelper.convertCompetitionToBasicDto(competition);
        const titleDtos = await this.apiHelper.convertCompetitionTitleDtos(titles);

        return {
            ...basicCompetitionDto,
            titles: titleDtos,
        }
    }

}