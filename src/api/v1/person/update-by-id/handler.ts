import { BasicPersonDto } from "@src/model/external/dto/basic-person";
import { UpdatePersonRequestDto } from "@src/model/external/dto/update-person-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { PersonService } from "@src/module/person/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class UpdatePersonByIdRouteHandler implements RouteHandler<UpdatePersonRequestDto, BasicPersonDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly personService: PersonService,
    ) {}

    public async handle(_: AuthenticationContext, dto: UpdatePersonRequestDto): Promise<BasicPersonDto> {
        const updatedPerson = await this.personService.updateById(dto.personId, {
            lastName: dto.lastName,
            firstName: dto.firstName,
            avatar: dto.avatar,
            birthday: dto.birthday,
            deathday: dto.deathday,
            nationalities: dto.nationalities,
        });

        return this.apiHelper.convertPersonToBasicDto(updatedPerson);
    }

}