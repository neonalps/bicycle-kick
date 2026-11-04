import { RemoveClubAvatarRequestDto } from "@src/model/external/dto/remove-club-avatar-request";
import { ClubService } from "@src/module/club/service";
import { StorageService } from "@src/module/storage/service";
import { getStorageFileFromFullPath } from "@src/module/storage/util";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { ClubId } from "@src/util/domain-types";

export class RemoveClubAvatarRouteHandler implements RouteHandler<RemoveClubAvatarRequestDto, void> {

    constructor(
            private readonly clubService: ClubService,
            private readonly storageService: StorageService,
        ) {}
    
        public async handle(_: AuthenticationContext, dto: RemoveClubAvatarRequestDto): Promise<void> {
            const clubId: ClubId = Number(dto.clubId);
    
            const club = await this.clubService.requireById(clubId);

            if (club.iconSmall) {
                await this.storageService.deleteFile(getStorageFileFromFullPath(club.iconSmall));
                await this.clubService.removeClubAvatar(clubId);
            }
        }   

}