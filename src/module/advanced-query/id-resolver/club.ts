import { IdResolver, ResolvePossibility } from "@src/module/advanced-query/id-resolver/base";
import { FilterParameter } from "@src/module/advanced-query/filter/parameter";
import { ClubService } from "@src/module/club/service";

export class ClubIdResolver extends IdResolver {

    constructor(private readonly clubService: ClubService) {
        super();
    }

    async fetchPossibilities(parameter: FilterParameter): Promise<ResolvePossibility[]> {
        const result = await this.clubService.search(parameter.value);

        return result.map(item => {
            return {
                id: item.id,
                name: item.name,
            };
        });
    }

}