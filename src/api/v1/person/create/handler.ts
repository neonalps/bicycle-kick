import { BasicPersonDto } from "@src/model/external/dto/basic-person";
import { CreatePersonRequestDto } from "@src/model/external/dto/create-person-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { PersonService } from "@src/module/person/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class CreatePersonRouteHandler implements RouteHandler<CreatePersonRequestDto, BasicPersonDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly personService: PersonService,
    ) {}

    public async handle(_: AuthenticationContext, dto: CreatePersonRequestDto): Promise<BasicPersonDto> {
        const createdPerson = await this.personService.create({
            lastName: dto.lastName,
            firstName: dto.firstName,
            avatar: dto.avatar,
            birthday: dto.birthday,
            deathday: dto.deathday,
            nationalities: dto.nationalities,
        });

        return this.apiHelper.convertPersonToBasicDto(createdPerson);
    }

}