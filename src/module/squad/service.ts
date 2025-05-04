import { Squad } from "@src/model/internal/squad";
import { SquadMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";
import { SeasonService } from "@src/module/season/service";

export class SquadService {

    constructor(private readonly mapper: SquadMapper, private readonly seasonService: SeasonService) {}

    async getForSeason(seasonId: number): Promise<Squad[]> {
        validateNotNull(seasonId, "seasonId");

        const season = await this.seasonService.getById(seasonId);
        if (season === null) {
            throw new Error(`No season with ID ${seasonId} exists`);
        }

        return await this.mapper.getForSeason(seasonId);
    }

}