import { IdResolver, ResolvePossibility } from "@src/module/advanced-query/id-resolver/base";
import { FilterParameter } from "@src/module/advanced-query/filter/parameter";
import { VenueService } from "@src/module/venue/service";

export class VenueIdResolver extends IdResolver {

    constructor(private readonly venueService: VenueService) {
        super();
    }

    async fetchPossibilities(parameter: FilterParameter): Promise<ResolvePossibility[]> {
        const result = await this.venueService.searchByName(parameter.value);

        return result.map(item => {
            return {
                id: item.id,
                name: item.name,
            };
        });
    }

}