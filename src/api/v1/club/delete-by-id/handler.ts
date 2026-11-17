import { DeleteClubByIdRequestDto } from "@src/model/external/dto/delete-club-by-id-request";
import { ClubService } from "@src/module/club/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { ClubId } from "@src/util/domain-types";

export class DeleteClubByIdRouteHandler implements RouteHandler<DeleteClubByIdRequestDto, void> {

    constructor(
        private readonly clubService: ClubService,
    ) {}

    public async handle(_: AuthenticationContext, dto: DeleteClubByIdRequestDto): Promise<void> {
        const clubId: ClubId = Number(dto.clubId);
        await this.clubService.requireById(clubId);
        await this.clubService.deleteById(clubId);
    }

}