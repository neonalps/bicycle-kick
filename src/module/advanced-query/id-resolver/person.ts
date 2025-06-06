import { PersonService } from "@src/module/person/service";
import { IdResolver, ResolvePossibility } from "@src/module/advanced-query/id-resolver/base";
import { FilterParameter } from "@src/module/advanced-query/filter/parameter";

export class PersonIdResolver extends IdResolver {

    constructor(private readonly personService: PersonService) {
        super();
    }

    async fetchPossibilities(parameter: FilterParameter): Promise<ResolvePossibility[]> {
        return [];
    }

}