import { SquadMember } from "@src/model/internal/squad-member";
import { SquadMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";
import { SeasonService } from "@src/module/season/service";

export class SquadService {

    constructor(private readonly mapper: SquadMapper, private readonly seasonService: SeasonService) {}

    async getForSeason(seasonId: number): Promise<SquadMember[]> {
        validateNotNull(seasonId, "seasonId");

        await this.seasonService.requireById(seasonId);
        return await this.mapper.getForSeason(seasonId);
    }

}