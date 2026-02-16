import { ApplicationStatsResponseDto } from "@src/model/external/dto/overall-application-stats-response";
import { ApplicationStatsService } from "@src/module/application/stats.service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class GetApplicationStatsRouteHandler implements RouteHandler<void, ApplicationStatsResponseDto> {

    constructor(private readonly applicationStatesService: ApplicationStatsService) {}

    public async handle(_: AuthenticationContext): Promise<ApplicationStatsResponseDto> {
        return await this.applicationStatesService.getApplicationStats();
    }

}