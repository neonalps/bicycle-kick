import { IdResolver, ResolvePossibility } from "@src/module/advanced-query/id-resolver/base";
import { FilterParameter } from "@src/module/advanced-query/filter/parameter";
import { SeasonService } from "@src/module/season/service";
import { ParameterName } from "@src/module/advanced-query/scenario/constants";
import { Season } from "@src/model/internal/season";

export class SeasonIdResolver extends IdResolver {

    constructor(private readonly seasonService: SeasonService) {
        super();
    }

    async fetchPossibilities(parameter: FilterParameter): Promise<ResolvePossibility[]> {
        if (parameter.name === ParameterName.Current) {
            return [this.convertToPossibility(await this.seasonService.getCurrent() as Season)];
        } else if (parameter.name === ParameterName.Last) {
            return [this.convertToPossibility(await this.seasonService.getLast() as Season)];
        }

        const result = await this.seasonService.search(parameter.value);
        return result.map(item => this.convertToPossibility(item));
    }

    private convertToPossibility(item: Season): ResolvePossibility {
        return {
            id: item.id,
            name: item.name,
        };
    }

}