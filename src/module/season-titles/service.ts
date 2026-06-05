import { SeasonTitle } from "@src/model/internal/season-title";
import { SeasonTitlesMapper } from "./mapper";
import { validateNotNull } from "@src/util/validation";
import { CompetitionId } from "@src/util/domain-types";

export class SeasonTitlesService {

    constructor(private readonly mapper: SeasonTitlesMapper) {}

    async getTitlesForPeriod(from: Date, to: Date | null): Promise<SeasonTitle[]> {
        validateNotNull(from, "from");
        
        return await this.mapper.getTitlesForPeriod(from, to);
    }

    async getTitlesForCompetition(competitionId: CompetitionId): Promise<SeasonTitle[]> {
        validateNotNull(competitionId, "competitionId");

        return await this.mapper.getTitlesForCompetition(competitionId);
    }

}