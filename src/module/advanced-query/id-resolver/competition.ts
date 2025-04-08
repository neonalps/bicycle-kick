import { CompetitionService } from "@src/module/competition/service";
import { IdResolver, ResolvePossibility } from "@src/module/advanced-query/id-resolver/base";
import { FilterParameter } from "@src/module/advanced-query/filter/parameter";

export class CompetitionIdResolver extends IdResolver {

    constructor(private readonly competitionService: CompetitionService) {
        super();
    }

    async fetchPossibilities(parameter: FilterParameter): Promise<ResolvePossibility[]> {
        return [];
    }

}