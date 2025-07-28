import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { WeltfussballClient } from "@src/module/external-provider/weltfussball/client";
import { MatchdayDetailsResponseDto } from "@src/model/external/dto/matchday-details-response";
import { MatchdayDetailsService } from "@src/module/matchday-details/service";
import { ApiHelperService } from "@src/module/api-helper/service";
import { isDefined } from "@src/util/common";
import { GetMatchdayDetailsRequestDto } from "@src/model/external/dto/get-matchday-details-request";

export class GetMatchdayDetailsRouteHandler implements RouteHandler<GetMatchdayDetailsRequestDto, MatchdayDetailsResponseDto> {

    constructor(
        private readonly apiHelperService: ApiHelperService,
        private readonly matchdayDetailsService: MatchdayDetailsService,
        private readonly client: WeltfussballClient,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetMatchdayDetailsRequestDto): Promise<MatchdayDetailsResponseDto> {
        const details = await this.matchdayDetailsService.getDetails(this.client, dto);

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