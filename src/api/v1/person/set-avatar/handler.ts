import { BasicPersonDto } from "@src/model/external/dto/basic-person";
import { SetPersonAvatarRequestDto } from "@src/model/external/dto/set-person-avatar-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { PersonService } from "@src/module/person/service";
import { ApplicationHeader, AuthenticationContext, RouteHandler } from "@src/router/types";
import { PersonId } from "@src/util/domain-types";
import { Nullish } from "@src/util/types";
import { MultipartFile } from '@fastify/multipart'
import { ensureNotNullish } from "@src/util/common";
import { StorageService } from "@src/module/storage/service";
import { assertValidFileType, getFileTypeFromFilename, getFullPathFromFile, getPersonStorageFile } from "@src/module/storage/util";

export class SetPersonAvatarRouteHandler implements RouteHandler<SetPersonAvatarRequestDto, BasicPersonDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly personService: PersonService,
        private readonly storageService: StorageService,
    ) {}

    public async handle(_: AuthenticationContext, dto: SetPersonAvatarRequestDto, headers: Record<ApplicationHeader, string>, file: Nullish<MultipartFile>): Promise<BasicPersonDto> {
        const personId: PersonId = Number(dto.personId);

        const uploadedFile = ensureNotNullish(file, `No upload file was passed`);
        await this.personService.requireById(personId);

        const fileType = getFileTypeFromFilename(uploadedFile.filename);
        assertValidFileType(fileType, ['jpg', 'png', 'webp']);
        
        const storageFile = getPersonStorageFile(personId, fileType);

        await this.storageService.uploadFile(storageFile, uploadedFile.file);

        await this.personService.setPersonAvatar(personId, getFullPathFromFile(storageFile));
        
        const updatedPerson = await this.personService.requireById(personId);
        return this.apiHelper.convertPersonToBasicDto(updatedPerson);
    }   

}