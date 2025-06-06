import { GetSeasonSquadRequestDto } from "@src/model/external/dto/get-season-squad-request";
import { GetSeasonSquadResponseDto } from "@src/model/external/dto/get-season-squad-response";
import { ApiHelperService } from "@src/module/api-helper/service";
import { SquadService } from "@src/module/squad/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class GetSeasonSquadRouteHandler implements RouteHandler<GetSeasonSquadRequestDto, GetSeasonSquadResponseDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly squadService: SquadService,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetSeasonSquadRequestDto): Promise<GetSeasonSquadResponseDto> {
        const squad = await this.squadService.getForSeason(dto.seasonId);
        const squadDto = await this.apiHelper.getSquadDto(squad);

        return {
            squad: squadDto,
        }
    }

}