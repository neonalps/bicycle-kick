import { PersonService } from "@src/module/person/service";
import { IdResolver, ResolvePossibility } from "@src/module/advanced-query/id-resolver/base";
import { FilterParameter } from "@src/module/advanced-query/filter/parameter";

export class PersonIdResolver extends IdResolver {

    constructor(private readonly personService: PersonService) {
        super();
    }

    async fetchPossibilities(parameter: FilterParameter): Promise<ResolvePossibility[]> {
        const result = await this.personService.searchByName(parameter.value);

        return result.map(item => {
            return {
                id: item.id,
                name: item.name,
            };
        });
    }

}