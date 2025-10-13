import { BasicClubDto } from "@src/model/external/dto/basic-club";
import { UpdateClubByIdRequestDto } from "@src/model/external/dto/update-club-by-id-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { ClubService } from "@src/module/club/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";

export class UpdateClubByIdRouteHandler implements RouteHandler<UpdateClubByIdRequestDto, BasicClubDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly clubService: ClubService,
    ) {}

    public async handle(_: AuthenticationContext, dto: UpdateClubByIdRequestDto): Promise<BasicClubDto> {
        const updatedClub = await this.clubService.updateById(dto.clubId, {
            name: dto.name,
            shortName: dto.shortName,
            iconLarge: dto.iconLarge,
            iconSmall: dto.iconSmall,
            city: dto.city,
            district: dto.district,
            countryCode: dto.countryCode,
            primaryColour: dto.primaryColour,
            secondaryColour: dto.secondaryColour,
            homeVenueId: dto.homeVenueId,
        });

        return this.apiHelper.convertClubToBasicDto(updatedClub)
    }

}