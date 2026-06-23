import { ApplicationStatsResponseDto } from "@src/model/external/dto/overall-application-stats-response";
import { ApplicationStatsService } from "@src/module/application/stats.service";
import { RouteHandler } from "@src/router/types";

export class GetApplicationStatsRouteHandler implements RouteHandler<void, ApplicationStatsResponseDto> {

    constructor(private readonly applicationStatsService: ApplicationStatsService) {}

    public async handle(): Promise<ApplicationStatsResponseDto> {
        return await this.applicationStatsService.getApplicationStats();
    }

}