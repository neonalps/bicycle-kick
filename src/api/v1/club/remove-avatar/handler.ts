import { RemoveClubAvatarRequestDto } from "@src/model/external/dto/remove-club-avatar-request";
import { ClubService } from "@src/module/club/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { ClubId } from "@src/util/domain-types";

export class RemoveClubAvatarRouteHandler implements RouteHandler<RemoveClubAvatarRequestDto, void> {

    constructor(
            private readonly clubService: ClubService,
        ) {}
    
        public async handle(_: AuthenticationContext, dto: RemoveClubAvatarRequestDto): Promise<void> {
            const clubId: ClubId = Number(dto.clubId);
    
            await this.clubService.requireById(clubId);

            await this.clubService.removeClubAvatar(clubId);
        }   

}