import { MergePersonsRequestDto } from "@src/model/external/dto/merge-persons-request";
import { PersonService } from "@src/module/person/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class MergePersonRouteHandler implements RouteHandler<MergePersonsRequestDto, void> {

    constructor(
        private readonly personService: PersonService
    ) {}

    public async handle(_: AuthenticationContext, dto: MergePersonsRequestDto): Promise<void> {
        const personIdsToMerge = dto.personIds;
        if (personIdsToMerge.length < 2) {
            throw new Error(`At least two person IDs must be passed`);
        }

        await this.personService.mergePersons(personIdsToMerge);
    }

}