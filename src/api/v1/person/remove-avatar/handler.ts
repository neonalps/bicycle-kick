import { RemovePersonAvatarRequestDto } from "@src/model/external/dto/remove-person-avatar-request";
import { PersonService } from "@src/module/person/service";
import { StorageService } from "@src/module/storage/service";
import { getStorageFileFromFullPath } from "@src/module/storage/util";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { PersonId } from "@src/util/domain-types";

export class RemovePersonAvatarRouteHandler implements RouteHandler<RemovePersonAvatarRequestDto, void> {

    constructor(
            private readonly personService: PersonService,
            private readonly storageService: StorageService,
        ) {}
    
        public async handle(_: AuthenticationContext, dto: RemovePersonAvatarRequestDto): Promise<void> {
            const personId: PersonId = Number(dto.personId);
    
            const person = await this.personService.requireById(personId);
            if (person.avatar) {
                await this.personService.removePersonAvatar(personId);
                await this.storageService.deleteFile(getStorageFileFromFullPath(person.avatar));
            }
        }   

}