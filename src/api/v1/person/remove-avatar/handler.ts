import { RemovePersonAvatarRequestDto } from "@src/model/external/dto/remove-person-avatar-request";
import { PersonService } from "@src/module/person/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { PersonId } from "@src/util/domain-types";

export class RemovePersonAvatarRouteHandler implements RouteHandler<RemovePersonAvatarRequestDto, void> {

    constructor(
            private readonly personService: PersonService,
        ) {}
    
        public async handle(_: AuthenticationContext, dto: RemovePersonAvatarRequestDto): Promise<void> {
            const personId: PersonId = Number(dto.personId);
    
            await this.personService.requireById(personId);

            await this.personService.removePersonAvatar(personId);
        }   

}