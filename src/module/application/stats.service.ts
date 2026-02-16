import { ApplicationStatsResponseDto } from "@src/model/external/dto/overall-application-stats-response";
import { ApplicationStatsMapper } from "./stats.mapper";

export class ApplicationStatsService {

    constructor(
        private readonly mapper: ApplicationStatsMapper,
    ) {}

    async getApplicationStats(): Promise<ApplicationStatsResponseDto> {
        return await this.mapper.getApplicationStats();
    }

}