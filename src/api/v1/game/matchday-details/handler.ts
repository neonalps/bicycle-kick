import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { MatchdayDetailsResponseDto } from "@src/model/external/dto/matchday-details-response";
import { MatchdayDetailsService } from "@src/module/matchday-details/service";
import { ApiHelperService } from "@src/module/api-helper/service";
import { isDefined } from "@src/util/common";
import { GetMatchdayDetailsRequestDto } from "@src/model/external/dto/get-matchday-details-request";

export class GetMatchdayDetailsRouteHandler implements RouteHandler<GetMatchdayDetailsRequestDto, MatchdayDetailsResponseDto> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly matchdayDetailsService: MatchdayDetailsService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetMatchdayDetailsRequestDto): Promise<MatchdayDetailsResponseDto> {
        const details = await this.matchdayDetailsService.getDetails(dto);

        const resultDto: MatchdayDetailsResponseDto = {
            competition: this.apiHelperService.convertCompetitionToSmallDto(details.competition),
        };

        if (isDefined(details.fixtures)) {
            resultDto.fixtures = this.apiHelperService.convertMatchdayFixturesToDto(details.fixtures);
        }

        if (isDefined(details.table)) {
            resultDto.table = this.apiHelperService.convertMatchdayTableToDto(details.table);
        }

        return resultDto;
    }

}