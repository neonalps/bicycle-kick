import { BasicClubDto } from "@src/model/external/dto/basic-club";
import { UpdateClubByIdRequestDto } from "@src/model/external/dto/update-club-by-id-request";
import { ApiHelperService } from "@src/module/api-helper/service";
import { ClubService } from "@src/module/club/service";
import { VenueService } from "@src/module/venue/service";
import { AuthenticationContext, RouteHandler } from "@src/router/types";
import { ClubId } from "@src/util/domain-types";

export class UpdateClubByIdRouteHandler implements RouteHandler<UpdateClubByIdRequestDto, BasicClubDto> {

    constructor(
        private readonly apiHelper: ApiHelperService,
        private readonly clubService: ClubService,
        private readonly venueService: VenueService,
    ) {}

    public async handle(_: AuthenticationContext, dto: UpdateClubByIdRequestDto): Promise<BasicClubDto> {
        const clubId: ClubId = Number(dto.clubId);

        const venueId = await this.venueService.requireVenueIdForFlavorId(dto.homeVenueFlavorId);

        const updatedClub = await this.clubService.updateById(clubId, {
            name: dto.name,
            shortName: dto.shortName,
            city: dto.city,
            district: dto.district,
            countryCode: dto.countryCode,
            primaryColour: dto.primaryColour,
            secondaryColour: dto.secondaryColour,
            homeVenueId: venueId,
        });

        return this.apiHelper.convertClubToBasicDto(updatedClub)
    }

}