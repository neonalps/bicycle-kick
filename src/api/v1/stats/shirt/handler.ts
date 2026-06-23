import { GetShirtStatsRequestDto } from "@src/model/external/dto/get-shirt-stats-request";
import { GetShirtStatsResponseDto } from "@src/model/external/dto/get-shirt-stats-response";
import { StatsService } from "@src/module/stats/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class GetShirtStatsRouteHandler implements RouteHandler<GetShirtStatsRequestDto, GetShirtStatsResponseDto> {

    constructor(private readonly statsService: StatsService) {}

    public async handle(_: AuthenticationContext, dto: GetShirtStatsRequestDto): Promise<GetShirtStatsResponseDto> {
        const wornByStats = await this.statsService.getShirtWornBy(Number(dto.shirt));
        
        return {
            wornBy: [],
        }
    }

}