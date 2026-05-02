import { SquadMember } from "@src/model/internal/squad-member";
import { SquadMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";
import { SeasonService } from "@src/module/season/service";
import { Person } from "@src/model/internal/person";
import { SeasonId } from "@src/util/domain-types";
import { PersonService } from "@src/module/person/service";

export class SquadService {

    constructor(
        private readonly mapper: SquadMapper,
        private readonly personService: PersonService,
        private readonly seasonService: SeasonService,
    ) {}

    async getForSeason(seasonId: SeasonId): Promise<SquadMember[]> {
        validateNotNull(seasonId, "seasonId");

        await this.seasonService.requireById(seasonId);
        return await this.mapper.getForSeason(seasonId);
    }

    async getActiveSquadMembers(): Promise<Person[]> {
        const currentSeason = await this.seasonService.requireCurrent();
        const squadMemberPersonIds = await this.mapper.getActiveMembers(currentSeason.id);
        return await this.personService.getMultipleByIds(squadMemberPersonIds);
    }

}