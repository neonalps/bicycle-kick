import { ApiHelperService } from "@src/module/api-helper/service";
import { ApplicationHeader, AuthenticationContext, RouteHandler } from "@src/router/types";
import { ClubId } from "@src/util/domain-types";
import { Nullish } from "@src/util/types";
import { MultipartFile } from '@fastify/multipart'
import { ensureNotNullish } from "@src/util/common";
import { StorageService } from "@src/module/storage/service";
import { SetClubAvatarRequestDto } from "@src/model/external/dto/set-club-avatar-request";
import { BasicClubDto } from "@src/model/external/dto/basic-club";
import { ClubService } from "@src/module/club/service";

export class SetClubAvatarRouteHandler implements RouteHandler<SetClubAvatarRequestDto, BasicClubDto> {

    private static readonly CLUB_FOLDER = `c`;

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly clubService: ClubService,
        private readonly storageService: StorageService,
    ) {}

    public async handle(_: AuthenticationContext, dto: SetClubAvatarRequestDto, headers: Record<ApplicationHeader, string>, file: Nullish<MultipartFile>): Promise<BasicClubDto> {
        const clubId: ClubId = Number(dto.clubId);

        const uploadedFile = ensureNotNullish(file, `No upload file was passed`);
        await this.clubService.requireById(clubId);

        const fileType = uploadedFile.filename.substring(uploadedFile.filename.lastIndexOf('.') + 1);
        const avatarFilename = `${SetClubAvatarRouteHandler.CLUB_FOLDER}/${clubId}.${fileType}`;

        await this.storageService.uploadFile(SetClubAvatarRouteHandler.CLUB_FOLDER, `${clubId}.${fileType}`, uploadedFile.file);

        await this.clubService.setClubAvatar(clubId, avatarFilename);
        
        const updatedClub = await this.clubService.requireById(clubId);
        return this.apiHelper.convertClubToBasicDto(updatedClub);
    }   

}