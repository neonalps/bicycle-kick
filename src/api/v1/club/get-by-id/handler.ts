import { BasicClubDto } from "@src/model/external/dto/basic-club";
import { GetClubByIdRequestDto } from "@src/model/external/dto/get-club-by-id-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { ClubService } from "@src/module/club/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class GetClubByIdRouteHandler implements RouteHandler<GetClubByIdRequestDto, BasicClubDto> {

    constructor(
        private readonly apiHelper: ApiHelperService, 
        private readonly clubService: ClubService,
        private readonly mainClubId: number,
    ) {}

    public async handle(_: AuthenticationContext, dto: GetClubByIdRequestDto): Promise<BasicClubDto> {
        const clubId = typeof dto.clubId === 'string' && dto.clubId === "main" ? this.mainClubId : dto.clubId;

        const club = await this.clubService.getById(clubId);
        if (club === null) {
            throw new Error(`No club with ID ${clubId} exists`);
        }

        return this.apiHelper.convertClubToBasicDto(club);
    }

}