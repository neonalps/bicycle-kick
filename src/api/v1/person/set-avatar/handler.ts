import { BasicPersonDto } from "@src/model/external/dto/basic-person";
import { SetPersonAvatarRequestDto } from "@src/model/external/dto/set-person-avatar-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { PersonService } from "@src/module/person/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { PersonId } from "@src/util/domain-types";

export class SetPersonAvatarRouteHandler implements RouteHandler<SetPersonAvatarRequestDto, BasicPersonDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly personService: PersonService,
    ) {}

    public async handle(_: AuthenticationContext, dto: SetPersonAvatarRequestDto): Promise<BasicPersonDto> {
        const personId: PersonId = Number(dto.personId);

        const person = await this.personService.requireById(personId);
        // TODO implement
        return this.apiHelper.convertPersonToBasicDto(person);
    }   

}